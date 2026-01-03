package com.romanmay7.travel_compass_core.controller;

import com.romanmay7.travel_compass_core.model.PlanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/test")
public class KafkaTestController {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @GetMapping("/send")
    public String testKafka() {
        PlanRequest request = new PlanRequest();
        request.setPlanId(UUID.randomUUID().toString());
        request.setDestination("Paris");
        request.setStartDate(LocalDate.of(2026, 6, 1));
        request.setEndDate(LocalDate.of(2026, 6, 5));
        request.setInterests(List.of("Art", "Food"));

        // Ensure this topic name matches your Worker's @KafkaListener
        kafkaTemplate.send("travel-requests", request);

        return "Message sent to Kafka! Check Worker logs.";
    }
}
