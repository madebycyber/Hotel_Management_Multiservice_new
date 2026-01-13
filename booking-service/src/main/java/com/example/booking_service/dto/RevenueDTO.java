package com.example.booking_service.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueDTO {
    private String month; // "2026-01"
    private BigDecimal revenue;
}