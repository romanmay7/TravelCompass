package com.romanmay7.travel_compass_core.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "*") // Adjust this to your frontend URL in production
public class PhotoProxyController {

    @Value("${google.maps.key}")
    private String googleKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<byte[]> getPhoto(@RequestParam String photoReference) {
        String url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference="
                + photoReference + "&key=" + googleKey;

        // Fetch the image from Google as a byte array
        byte[] imageBytes = restTemplate.getForObject(url, byte[].class);

        // Return the image data directly to the browser
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes);
    }
}