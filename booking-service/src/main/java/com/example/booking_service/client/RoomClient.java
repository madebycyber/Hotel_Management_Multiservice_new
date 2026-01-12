package com.example.booking_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// name="ROOM-SERVICE" phải khớp với tên service Room bạn đặt trong application.properties
@FeignClient(name = "ROOM-SERVICE") 
public interface RoomClient {
    @GetMapping("/api/rooms/{id}")
    Object getRoomById(@PathVariable("id") String id);

    @GetMapping("/api/services/{id}")
    Object getServiceById(@PathVariable("id") String id);
}