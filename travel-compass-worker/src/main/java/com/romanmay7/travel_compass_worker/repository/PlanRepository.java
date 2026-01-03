package com.romanmay7.travel_compass_worker.repository;

import com.romanmay7.travel_compass_worker.model.TravelPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PlanRepository extends MongoRepository<TravelPlan, String> {
    // Finds a plan matching destination, start/end dates, and interests
    // The 'all' operator ensures all interests in the request are present in the document
    @Query("{ 'destination': ?0, 'startDate': ?1, 'endDate': ?2, 'interests': { $all: ?3 } }")
    Optional<TravelPlan> findExisting(
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            List<String> interests
    );

    // Spring generates the logic for save(), findById(), and delete() automatically!
    List<TravelPlan> findByUserId(String userId);
}