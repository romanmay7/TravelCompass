package com.romanmay7.travel_compass_core.model;

public class AuthResponse {
    private String id;
    private String name;
    private String email;
    private String token;

    public AuthResponse(String id, String name, String email, String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getToken() { return token; }
}