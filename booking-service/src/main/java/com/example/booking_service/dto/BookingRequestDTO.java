package com.example.booking_service.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingRequestDTO {
    private String maKhachHang;
    private String maPhong;
    private LocalDateTime ngayCheckIn;
    private LocalDateTime ngayCheckOut;
    
    // Danh sách các dịch vụ khách chọn thêm
    private List<ServiceDTO> services; 
}