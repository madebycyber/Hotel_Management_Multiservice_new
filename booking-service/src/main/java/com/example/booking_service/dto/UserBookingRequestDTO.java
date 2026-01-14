package com.example.booking_service.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserBookingRequestDTO {
    // Thông tin khách hàng
    private String tenKh;
    private String sdt;
    private String email;

    // Thông tin đặt phòng
    private String maPhong;
    private LocalDateTime ngayCheckIn;
    private LocalDateTime ngayCheckOut;
    
    // Danh sách dịch vụ: [{ "maDichVu": "dv001", "soLuong": 2 }]
    private List<ServiceDTO> services; 
}