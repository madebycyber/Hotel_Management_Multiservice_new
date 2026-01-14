package com.example.booking_service.repository;

import com.example.booking_service.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, String> {

    /**
     * Tìm kiếm khách hàng dựa trên sự kết hợp của 3 thông tin định danh.
     * Spring Data JPA sẽ tự động sinh câu lệnh SQL tương ứng.
     */
    Optional<KhachHang> findByTenKhAndSdtAndEmail(String tenKh, String sdt, String email);

    // Bạn cũng có thể thêm hàm này nếu muốn check tồn tại nhanh
    boolean existsBySdtAndEmail(String sdt, String email);
}