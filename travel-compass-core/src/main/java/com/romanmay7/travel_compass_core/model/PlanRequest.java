package com.romanmay7.travel_compass_core.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanRequest {
    private String planId;      // Generated UUID
    private String userId;      // From JWT Context
    private String destination;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private List<String> interests;
    private PlanStatus status;  // PENDING, PROCESSING, COMPLETED, FAILED
}

