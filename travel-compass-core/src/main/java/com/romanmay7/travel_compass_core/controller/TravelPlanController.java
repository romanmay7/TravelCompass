package com.romanmay7.travel_compass_core.controller;

import com.romanmay7.travel_compass_core.model.PlanRequest;
import com.romanmay7.travel_compass_core.model.TravelPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.romanmay7.travel_compass_core.repository.PlanRepository;
import com.romanmay7.travel_compass_core.service.TravelPlanService;

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
        TravelPlan plan = travelPlanService.getOrGeneratePlan(request);

        // If the itinerary is NOT null, it was already in the DB
        if (plan.getItinerary() != null && !plan.getItinerary().isEmpty()) {
            return ResponseEntity.ok(plan);
        }

        // If itinerary is null, it's a new placeholder. Return 202 + the object (id included)
        return ResponseEntity.accepted().body(plan);
    }

    //  POLLING ENDPOINT
    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable String id) {
        return travelPlanRepository.findById(id)
                .map(plan -> {
                    // If the worker has filled the itinerary, return it
                    if (plan.getItinerary() != null && !plan.getItinerary().isEmpty()) {
                        return ResponseEntity.ok(plan);
                    }
                    // Otherwise, tell frontend it's still processing
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body("Processing...");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}



