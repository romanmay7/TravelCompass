package com.romanmay7.travel_compass_worker.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    // ADD THIS METHOD to resolve the error
    public long getDaysBetween() {
        if (startDate == null || endDate == null) return 1;
        // Adding +1 ensures a June 1 to June 3 trip is "3 days"
        return ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }
}

