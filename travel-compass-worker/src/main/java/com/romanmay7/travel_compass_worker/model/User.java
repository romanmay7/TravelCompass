package com.romanmay7.travel_compass_worker.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String email;
    private String name;
    private String password; // Encoded for email login
    private String googleId; // For Google OAuth users
}