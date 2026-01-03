package com.romanmay7.travel_compass_worker.model;

import lombok.Data;

import java.util.List;

@Data
public class Activity {
    private String time;
    private String siteName;
    private String description;
    private GeoPoint coordinates; // For the Map markers
    private List<String> photoReferences; // From Google Places API
    private List<String> imageUrls;        // For Mock Data (Unsplash/Static)
    private String category; // e.g., "Restaurant", "Extreme Sport"

    public void setImageUrl(String url) {
        this.imageUrls = List.of(url);
    }
}
