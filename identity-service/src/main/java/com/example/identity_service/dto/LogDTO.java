package com.example.identity_service.dto;
import lombok.Data;

@Data
public class LogDTO {
    private String user;
    private String action;
    private String target;
    private String serviceName;
}