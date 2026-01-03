package com.romanmay7.travel_compass_worker.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "travel_plans")
@TypeAlias("TravelPlan")
@Data // Using Lombok
public class TravelPlan {
    @Id
    @Field(targetType = FieldType.OBJECT_ID)
    private String id;
    private String userId;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> interests;

    // The structured data from Gemini + Google Maps/Places
    private List<DayPlan> itinerary;

    private LocalDateTime createdAt = LocalDateTime.now();
}

