package com.romanmay7.travel_compass_core.service;

import com.romanmay7.travel_compass_core.kafka.Producer;
import com.romanmay7.travel_compass_core.model.PlanRequest;
import com.romanmay7.travel_compass_core.model.TravelPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.romanmay7.travel_compass_core.repository.PlanRepository;

import java.util.Optional;

@Service
public class TravelPlanService {

    @Autowired
    private PlanRepository travelPlanRepository;

    @Autowired
    private Producer producer; // Use your custom component

    public TravelPlan getOrGeneratePlan(PlanRequest request) {
        // 1. Check if a COMPLETED plan already exists
        Optional<TravelPlan> existing = travelPlanRepository.findExisting(
                request.getUserId(),request.getDestination(), request.getStartDate(), request.getEndDate(), request.getInterests());

        if (existing.isPresent()) {
            return existing.get();
        }

        // 2. Not found? Create a "Placeholder" document to get an ID
        TravelPlan pendingPlan = new TravelPlan();
        pendingPlan.setDestination(request.getDestination());
        pendingPlan.setStartDate(request.getStartDate());
        pendingPlan.setEndDate(request.getEndDate());
        pendingPlan.setInterests(request.getInterests());
        pendingPlan.setItinerary(null); // This signifies it's still "Loading"
        // --- THIS IS THE MISSING PIECE ---
        pendingPlan.setUserId(request.getUserId());

        // Save it to get the MongoDB _id
        TravelPlan savedPlaceholder = travelPlanRepository.save(pendingPlan);

        // 3. Send the request to Kafka, including the new ID
        // You might need to update your PlanRequest model to include a 'planId' field
        request.setPlanId(savedPlaceholder.getId());
        // 2. Push to Kafka for background processing
        producer.send(request);

        return savedPlaceholder; // Return the object containing the ID
    }
}

