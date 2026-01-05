package com.romanmay7.travel_compass_core.controller;

import com.romanmay7.travel_compass_core.model.AuthResponse;
import com.romanmay7.travel_compass_core.model.LoginRequest;
import com.romanmay7.travel_compass_core.model.SignupRequest;
import com.romanmay7.travel_compass_core.model.User;
import com.romanmay7.travel_compass_core.repository.UserRepository;
import com.romanmay7.travel_compass_core.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for User Signup and Login")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils; // Helper class to create tokens

    // ADD THIS LINE
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // --- SIGNUP ENDPOINT ---
    @Operation(summary = "Register a new user")
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        // 1. Check if email already exists
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // 2. Create new user and ENCODE the password
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword())); // Hashing

        User savedUser = userRepository.save(user);

        // 3. Optional: Automatically log them in by returning a token
        String token = jwtUtils.generateToken(savedUser.getEmail());
        return ResponseEntity.ok(new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                token
        ));
    }

    // --- LOGIN ENDPOINT ---
    @Operation(summary = "Login and receive JWT")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Compare hashed password with raw input
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtils.generateToken(user.getEmail());
                return ResponseEntity.ok(new AuthResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        token
                ));
            }
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }
}