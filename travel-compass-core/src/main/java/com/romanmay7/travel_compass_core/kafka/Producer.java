package com.romanmay7.travel_compass_core.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper; // Standard Jackson 2 style

@Component
public class Producer {

    public static final String APP_TOPIC = "travel-requests";

    // Specify types <String, Object> to allow any DTO to be sent
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void send(Object message) {
        // Spring handles the JSON conversion automatically via JsonSerializer
        kafkaTemplate.send(APP_TOPIC, message);
        System.out.println("Backend sending to Kafka: " + message);
    }
}