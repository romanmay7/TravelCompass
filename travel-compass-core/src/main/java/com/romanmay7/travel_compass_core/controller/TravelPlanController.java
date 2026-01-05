package com.romanmay7.travel_compass_core.controller;

import com.romanmay7.travel_compass_core.model.PlanRequest;
import com.romanmay7.travel_compass_core.model.TravelPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.romanmay7.travel_compass_core.repository.PlanRepository;
import com.romanmay7.travel_compass_core.service.TravelPlanService;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "http://localhost:3000") // Allow React to connect
public class TravelPlanController {

    @Autowired
    private TravelPlanService travelPlanService;

    @Autowired
    private PlanRepository travelPlanRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> createPlan(@RequestBody PlanRequest request) {
        // Validation: Ensure a userId is present if your UI requires login
        if (request.getUserId() == null || request.getUserId().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID is required");
        }

        TravelPlan plan = travelPlanService.getOrGeneratePlan(request);

        // If the itinerary is NOT null, it was already in the DB
        if (plan.getItinerary() != null && !plan.getItinerary().isEmpty()) {
            return ResponseEntity.ok(plan);
        }

        // If itinerary is null, it's a new placeholder. Return 202 + the object (id included)
        return ResponseEntity.accepted().body(plan);
    }

    /**
     * GET: New endpoint for the "My Plans" view.
     * Fetches all trips associated with a specific logged-in user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TravelPlan>> getPlansByUserId(@PathVariable String userId) {
        List<TravelPlan> plans = travelPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(plans);
    }

    //  POLLING ENDPOINT
    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable String id) {
        TravelPlan plan = travelPlanService.getPlanById(id);

        if (plan == null) return ResponseEntity.notFound().build();

        if (plan.getItinerary() == null) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Processing...");
        }

        return ResponseEntity.ok(plan);
    }
}



