package com.romanmay7.travel_compass_core.repository;

import com.romanmay7.travel_compass_core.model.TravelPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PlanRepository extends MongoRepository<TravelPlan, String> {

    // Keep your strict search for the "Initial Check" (to avoid duplicate AI calls)
    @Query("{ 'destination': ?0, 'startDate': ?1, 'endDate': ?2, 'interests': { $all: ?3 } }")
    Optional<TravelPlan> findExisting(
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            List<String> interests
    );

    // ADD THIS for the Polling Endpoint
    // This allows the frontend to find the plan with just destination and date
    Optional<TravelPlan> findByDestinationAndStartDate(String destination, LocalDate startDate);

    List<TravelPlan> findByUserId(String userId);
}