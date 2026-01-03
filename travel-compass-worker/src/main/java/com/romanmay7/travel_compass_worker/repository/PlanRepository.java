package com.romanmay7.travel_compass_worker.repository;

import com.romanmay7.travel_compass_worker.model.TravelPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PlanRepository extends MongoRepository<TravelPlan, String> {


    @Query("{ 'userId': ?0, 'destination': ?1, 'startDate': ?2, 'endDate': ?3, 'interests': { $all: ?4 } }")
    Optional<TravelPlan> findExisting(
            String userId,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            List<String> interests
    );


    List<TravelPlan> findByUserIdOrderByCreatedAtDesc(String userId);
}