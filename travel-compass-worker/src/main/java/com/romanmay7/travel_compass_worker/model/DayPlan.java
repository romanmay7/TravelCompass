package com.romanmay7.travel_compass_worker.model;

import lombok.Data;

import java.util.List;

@Data
public class DayPlan {
    private int dayNumber;
    private String date;
    private String theme; // e.g., "Historic Center Exploration"
    private List<Activity> activities;
}
