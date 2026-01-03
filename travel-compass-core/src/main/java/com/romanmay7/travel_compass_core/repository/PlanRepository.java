package com.romanmay7.travel_compass_core.repository;

import com.romanmay7.travel_compass_core.model.TravelPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PlanRepository extends MongoRepository<TravelPlan, String> {

    /**
     * 1. THE DUPLICATE PREVENTER
     * Checks if we already have a COMPLETED plan for this destination/user/date.
     * We add 'userId' so that users don't accidentally "steal" each other's cached plans
     * if they have different privacy settings.
     */
    @Query("{ 'userId': ?0, 'destination': ?1, 'startDate': ?2, 'endDate': ?3, 'interests': { $all: ?4 } }")
    Optional<TravelPlan> findExisting(
            String userId,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            List<String> interests
    );

    /**
     * 2. THE USER DASHBOARD QUERY
     * Fetches the list for the "My Plans" section in your React UI.
     * We sort by 'createdAt' descending so the newest trips appear first.
     */
    List<TravelPlan> findByUserIdOrderByCreatedAtDesc(String userId);
}