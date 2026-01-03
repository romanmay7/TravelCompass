package com.romanmay7.travel_compass_worker.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.romanmay7.travel_compass_worker.model.Activity;
import com.romanmay7.travel_compass_worker.model.DayPlan;
import com.romanmay7.travel_compass_worker.model.PlanRequest;
import com.romanmay7.travel_compass_worker.model.TravelPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.romanmay7.travel_compass_worker.repository.PlanRepository;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PlanWorkerService {

    @Value("${gemini.api.key}")
    private String geminiKey;

    @Value("${google.maps.key}")
    private String googleKey;

    @Autowired
    private PlanRepository planRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "travel-requests", groupId = "planner-group")
    public void listen(PlanRequest request) {
        try {
            String planId = request.getPlanId();
            // Log the user ID as well for better debugging/tracing
            System.out.println("✅ Worker received request for Plan ID: " + planId + " from User: " + request.getUserId());

            // --- STEP 0: OPTIMIZED RETRY LOGIC ---
            TravelPlan existingPlanObject = null;
            int attempts = 0;
            int maxAttempts = 10;

            while (attempts < maxAttempts) {
                // Attempt a direct ID lookup (Much faster than findAll())
                Optional<TravelPlan> planOpt = planRepository.findById(planId);

                if (planOpt.isPresent()) {
                    existingPlanObject = planOpt.get();
                    System.out.println("✅ MATCH FOUND in DB! Proceeding...");
                    break;
                } else {
                    attempts++;
                    System.out.println("⏳ Plan ID " + planId + " not found yet. Attempt " + attempts + "/" + maxAttempts);
                    Thread.sleep(1000);
                }
            }

            if (existingPlanObject == null) {
                System.err.println("❌ ERROR: Plan ID " + planId + " never appeared in DB.");
                return;
            }

            // --- STEP 1: Gemini Call ---
            String rawJson = callGemini(request);

            // --- STEP 2: Parsing ---
            List<DayPlan> itinerary = objectMapper.readValue(rawJson, new TypeReference<List<DayPlan>>(){});

            // --- STEP 3: Google Maps Enrichment ---
            for (DayPlan day : itinerary) {
                for (Activity activity : day.getActivities()) {
                    enrichWithGoogleData(activity);
                }
            }

            // --- STEP 4: PERSISTENCE ---
            existingPlanObject.setItinerary(itinerary);
            // Ensure the plan remains linked to the user during the save
            // existingPlanObject.setUserId(request.getUserId()); // Only if it was missing

            planRepository.save(existingPlanObject);

            System.out.println("🚀 SUCCESS: Itinerary generated and saved for Plan " + planId);

        } catch (Exception e) {
            System.err.println("❌ ERROR in Worker: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String callGemini(PlanRequest req) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiKey;

        // Build the JSON body as a raw string to match Postman exactly
        String jsonBody = String.format("""
        {
          "contents": [{
            "parts": [{
              "text": "Create a %d day trip to %s. Interests: %s. Return ONLY a JSON array of objects with keys: dayNumber, theme, activities[]. Activity keys: time, siteName, description, category, coordinates{lat, lng}."
            }]
          }],
          "generationConfig": {
            "response_mime_type": "application/json"
          }
        }
        """, req.getDaysBetween(), req.getDestination(), String.join(", ", req.getInterests()));

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            System.out.println("DEBUG: Sending to Gemini URL: " + url);

            // Use postForEntity to see the Status Code
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, entity, String.class);

            System.out.println("DEBUG: Status Code: " + responseEntity.getStatusCode());
            String responseBody = responseEntity.getBody();
            System.out.println("DEBUG: Raw Response: " + responseBody);

            JsonNode root = objectMapper.readTree(responseBody);
            return root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText().trim();

        } catch (Exception e) {
            // THIS WILL FINALLY TELL US THE REAL ERROR
            System.err.println("CRITICAL ERROR: " + e.getMessage());
            if (e instanceof org.springframework.web.client.HttpStatusCodeException) {
                System.err.println("API ERROR BODY: " + ((org.springframework.web.client.HttpStatusCodeException)e).getResponseBodyAsString());
            }
            e.printStackTrace();
            return "[]";
        }
    }

    private void enrichWithGoogleData(Activity activity) {
        try {
            // 1. SAFE ENCODING: Handles accents (é) and symbols (&) better than .replace()
            String encodedName = UriUtils.encode(activity.getSiteName(), StandardCharsets.UTF_8);
            String searchUrl = String.format(
                    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%s&inputtype=textquery&fields=place_id&key=%s",
                    encodedName, googleKey
            );

            JsonNode searchRes = restTemplate.getForObject(searchUrl, JsonNode.class);

            // 2. PREVENT NPE: .path() returns a MissingNode instead of null if index 0 is empty
            JsonNode candidate = searchRes.path("candidates").path(0);

            if (!candidate.isMissingNode()) {
                String placeId = candidate.path("place_id").asText();

                // Step B: Get Photo References
                String detailsUrl = String.format(
                        "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=photos&key=%s",
                        placeId, googleKey
                );
                JsonNode detailsRes = restTemplate.getForObject(detailsUrl, JsonNode.class);

                JsonNode photosNode = detailsRes.path("result").path("photos");
                if (photosNode.isArray()) {
                    List<String> photoUrls = new ArrayList<>();

                    // Grab up to 5 photos and convert them to viewable URLs immediately
                    for (int i = 0; i < Math.min(photosNode.size(), 5); i++) {
                        String ref = photosNode.get(i).path("photo_reference").asText();

                        // 3. ENRICHMENT: Build the final URL so the frontend can just use it
                        String directImageUrl = String.format(
                                "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=%s&key=%s",
                                ref, googleKey
                        );
                        photoUrls.add(directImageUrl);
                    }

                    // Use the viewable URLs field
                    activity.setImageUrls(photoUrls);
                }
            } else {
                // Logs why Google found nothing (e.g., ZERO_RESULTS or REQUEST_DENIED)
                String status = searchRes.path("status").asText();
                System.out.println("No candidate for " + activity.getSiteName() + ". Status: " + status);
            }
        } catch (Exception e) {
            System.err.println("Enrichment failed for " + activity.getSiteName() + ": " + e.getMessage());
        }
    }
}

