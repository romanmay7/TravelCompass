package com.romanmay7.travel_compass_worker.services;

import com.romanmay7.travel_compass_worker.model.PlanRequest;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class PlanListener {

    @KafkaListener(topics = "travel-requests", groupId = "worker-debug-group-v1")
    public void handlePlanRequest(PlanRequest request) {
        System.out.println("✅ RECEIVED DATA FROM KAFKA");
        System.out.println("Destination: " + request.getDestination());
        System.out.println("Start Date: " + request.getStartDate());
        System.out.println("End Date: " + request.getEndDate());

        // Testing your new method!
        long totalDays = request.getDaysBetween();
        System.out.println("Calculated Trip Length: " + totalDays + " days");
    }
}