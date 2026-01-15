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

    // --- XÓA HẾT CÁC HÀM GETTER/SETTER Ở DƯỚI ĐI ---
    // Lombok (@Data) sẽ tự sinh code ngầm cho bạn.
    // Việc viết đè throw UnsupportedOperationException sẽ làm hỏng code.
}