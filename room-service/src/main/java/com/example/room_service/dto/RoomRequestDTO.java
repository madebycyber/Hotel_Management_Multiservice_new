package com.example.room_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RoomRequestDTO {
    private Integer soPhong;
    private String loaiPhongId; // Frontend gửi mã loại phòng (ví dụ: "lp001")
    private String trangThai;
    private String moTa;
}