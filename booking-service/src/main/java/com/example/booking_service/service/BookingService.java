package com.example.booking_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.booking_service.client.RoomClient;
import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.PaymentRequestDTO;
import com.example.booking_service.dto.RevenueDTO;
import com.example.booking_service.dto.ServiceDTO;
import com.example.booking_service.dto.UserBookingRequestDTO;
import com.example.booking_service.entity.ChiTietDatPhong;
import com.example.booking_service.entity.HoaDonThanhToan;
import com.example.booking_service.entity.KhachHang; // 1. Nhớ Import Entity KhachHang
import com.example.booking_service.entity.PhieuDatPhong;
import com.example.booking_service.repository.ChiTietDatPhongRepository;
import com.example.booking_service.repository.HoaDonRepository;
import com.example.booking_service.repository.KhachHangRepository;
import com.example.booking_service.repository.PhieuDatPhongRepository;
import com.example.booking_service.repository.DichVuRepository;

import feign.FeignException;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {
    @Autowired private PhieuDatPhongRepository phieuRepo;
    @Autowired private ChiTietDatPhongRepository chitietRepo;
    @Autowired private RoomClient roomClient;
    @Autowired private KhachHangRepository khachHangRepo; 
    @Autowired private HoaDonRepository hoaDonRepo;
    @Autowired private DichVuRepository dichVuRepo;
    @PersistenceContext private EntityManager entityManager;
    @Autowired 
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public PhieuDatPhong createBooking(BookingRequestDTO req) {
        try {
            // ---------------------------------------------------------
            // 1. CHECK ROOM SERVICE (Giữ nguyên logic "mềm")
            // ---------------------------------------------------------
            try {
                roomClient.getRoomById(req.getMaPhong());
            } catch (Exception e) {
                System.err.println("⚠️ Cảnh báo: Room Service error: " + e.getMessage());
            }

            // ---------------------------------------------------------
            // 2. SINH MÃ BOOKING (ĐÂY LÀ BƯỚC QUAN TRỌNG ĐANG THIẾU)
            // ---------------------------------------------------------
            Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_phieudatphong_ma')", Long.class);
            String maPhieu = "dp" + String.format("%03d", nextVal); // Ví dụ: dp001, dp002...

            // 3. KHỞI TẠO PHIẾU
            PhieuDatPhong phieu = new PhieuDatPhong();
            
            // --- GÁN MÃ VỪA SINH VÀO ---
            phieu.setMaDatPhong(maPhieu); 
            // ---------------------------

            phieu.setMaPhong(req.getMaPhong().trim());

            // Xử lý Khách hàng
            if (req.getMaKhachHang() != null) {
                KhachHang khRef = entityManager.getReference(KhachHang.class, req.getMaKhachHang());
                phieu.setKhachHang(khRef);
            } else {
                throw new RuntimeException("Chưa chọn khách hàng!");
            }

            phieu.setNgayCheckIn(req.getNgayCheckIn());
            phieu.setNgayCheckOut(req.getNgayCheckOut());
            phieu.setTongGia(BigDecimal.ZERO);
            phieu.setTrangThai("Đã đặt");

            // 4. LƯU PHIẾU
            phieu = phieuRepo.saveAndFlush(phieu); // Bây giờ ID đã có, sẽ không lỗi nữa
            entityManager.refresh(phieu);

            // 5. LƯU DỊCH VỤ
            if (req.getServices() != null && !req.getServices().isEmpty()) {
                for (ServiceDTO s : req.getServices()) {
                    if (s.getMaDichVu() != null) {
                        Long nextValCT = jdbcTemplate.queryForObject("SELECT nextval('seq_chitietdatphong_ma')", Long.class);
                        String maCT = "ct" + String.format("%03d", nextValCT);

                        ChiTietDatPhong ct = new ChiTietDatPhong();
                        ct.setMaCTDP(maCT); // Hoặc setMaCTDP tùy entity
                        ct.setMaDatPhong(phieu.getMaDatPhong());
                        ct.setMaDichVu(s.getMaDichVu());
                        ct.setSoLuong(s.getSoLuong());
                        
                        chitietRepo.save(ct);
                    }
                }
            }
            return phieu;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi Backend: " + e.getMessage());
        }
    }

    // 1. Lấy danh sách Booking có phân trang
    public Page<PhieuDatPhong> getAllBookings(int page, int size) {
        // Sắp xếp theo ngày check-in mới nhất
        Pageable pageable = PageRequest.of(page, size, Sort.by("ngayCheckIn").descending());
        return phieuRepo.findAll(pageable);
    }

    // 2. Lấy danh sách dịch vụ đã đặt theo Booking ID
    public List<ChiTietDatPhong> getServicesByBookingId(String bookingId) {
        return chitietRepo.findByMaDatPhong(bookingId);
    }

    // Hàm lấy danh sách hóa đơn
    public Page<HoaDonThanhToan> getAllInvoices(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("ngayTT").descending());
        return hoaDonRepo.findAll(pageable);
    }

    // Hàm thêm dịch vụ vào booking đã có
    @Transactional
    public void addServiceToBooking(String bookingId, ServiceDTO dto) {
        // Validate booking tồn tại
        if (!phieuRepo.existsById(bookingId)) {
            throw new RuntimeException("Booking không tồn tại");
        }

        // Sinh mã chi tiết
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_chitietdatphong_ma')", Long.class);
        String maCT = "ct" + String.format("%03d", nextVal);

        ChiTietDatPhong ct = new ChiTietDatPhong();
        ct.setMaCTDP(maCT);
        ct.setMaDatPhong(bookingId);
        ct.setMaDichVu(dto.getMaDichVu());
        ct.setSoLuong(dto.getSoLuong());

        chitietRepo.save(ct);
    }

    // Thêm Transactional ở đây để đảm bảo EntityManager có thể chạy refresh
    @Transactional 
    public HoaDonThanhToan generateInvoice(String bookingId) {
        PaymentRequestDTO req = new PaymentRequestDTO();
        req.setMaDatPhong(bookingId);
        req.setHinhThucTT("Chuyển khoản");
        
        // Lưu ý: Đảm bảo "NV01" hoặc mã nhân viên nào đó đã tồn tại trong bảng nhanvien 
        // để tránh lỗi Foreign Key như bước trước
        req.setMaNV("USER_SELF"); 

        // Gọi trực tiếp logic tạo hóa đơn
        return createInvoice(req);
    }

    @Transactional
    public HoaDonThanhToan createInvoice(PaymentRequestDTO req) {
        // 1. Lấy thông tin phiếu đặt
        PhieuDatPhong booking = phieuRepo.findById(req.getMaDatPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu đặt: " + req.getMaDatPhong()));

        // 2. TÍNH TOÁN TỔNG TIỀN Ở BACKEND
        BigDecimal totalAmount = calculateTotalAmount(booking);

        // 3. Tạo mã hóa đơn
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_hoadon_ma')", Long.class);
        String maHD = "hd" + String.format("%03d", nextVal);

        // 4. Khởi tạo đối tượng Hóa đơn
        HoaDonThanhToan hd = new HoaDonThanhToan();
        hd.setMaHd(maHD);
        hd.setPhieuDatPhong(booking);
        hd.setNgayTT(LocalDateTime.now());
        hd.setHinhThucTT(req.getHinhThucTT() != null ? req.getHinhThucTT() : "Chuyển khoản");
        hd.setTrangThaiTT("Đã thanh toán");
        hd.setMaNV(req.getMaNV() != null ? req.getMaNV() : "NV01");
        
        // Gán số tiền đã tính toán ở Backend
        hd.setSoTienTT(totalAmount); 

        // 5. Lưu hóa đơn và cập nhật trạng thái Booking
        hd = hoaDonRepo.save(hd);
        
        booking.setTongGia(totalAmount);
        booking.setTrangThai("Đang sử dụng");
        phieuRepo.save(booking);

        return hd;
    }

    // --- Hàm phụ trợ tính toán chi tiết ---
    private BigDecimal calculateTotalAmount(PhieuDatPhong booking) {
        BigDecimal total = BigDecimal.ZERO;

        // A. Tính tiền phòng: (Giá loại phòng) * (Số ngày ở)
        try {
            // Lấy thông tin phòng từ Room Service
            Map<String, Object> room = (Map<String, Object>) roomClient.getRoomById(booking.getMaPhong());
            Map<String, Object> loaiPhong = (Map<String, Object>) room.get("loaiPhong");
            BigDecimal giaPhong = new BigDecimal(loaiPhong.get("gia").toString());

            long days = java.time.temporal.ChronoUnit.DAYS.between(booking.getNgayCheckIn(), booking.getNgayCheckOut());
            if (days <= 0) days = 1; // Ở trong ngày tính là 1 ngày

            total = total.add(giaPhong.multiply(BigDecimal.valueOf(days)));
        } catch (Exception e) {
            System.err.println("Lỗi tính tiền phòng, sử dụng giá mặc định 0: " + e.getMessage());
        }

        // B. Tính tiền dịch vụ từ danh sách ChiTietDatPhong
        List<ChiTietDatPhong> details = chitietRepo.findByMaDatPhong(booking.getMaDatPhong());
        for (ChiTietDatPhong ct : details) {
            try {
                // Lấy giá dịch vụ (Bạn có thể dùng DichVuRepository hoặc gọi API)
                // Ở đây giả sử bạn có thể lấy giá dịch vụ từ một bảng/API
                BigDecimal giaDV = getPriceOfService(ct.getMaDichVu()); 
                BigDecimal soLuong = BigDecimal.valueOf(ct.getSoLuong() != null ? ct.getSoLuong() : 1);
                
                total = total.add(giaDV.multiply(soLuong));
            } catch (Exception e) {
                System.err.println("Lỗi tính tiền dịch vụ " + ct.getMaDichVu());
            }
        }

        return total;
    }

    private BigDecimal getPriceOfService(String maDichVu) {
        if (maDichVu == null || maDichVu.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        return dichVuRepo.findById(maDichVu)
                    .map(dichVu -> dichVu.getGiaTien()) 
                    // CÁCH SỬA: lambda phải trả về một giá trị BigDecimal
                    .orElseGet(() -> BigDecimal.ZERO);
    }

    public List<RevenueDTO> getRevenueStats() {
        return hoaDonRepo.getMonthlyRevenue();
    }
    
@Transactional
public PhieuDatPhong createUserBooking(UserBookingRequestDTO req) {
    // 1. Tìm hoặc tạo Khách hàng (Dùng lại thông tin cũ nếu trùng 3 yếu tố)
    KhachHang khachHang = khachHangRepo
        .findByTenKhAndSdtAndEmail(req.getTenKh(), req.getSdt(), req.getEmail())
        .orElseGet(() -> {
            KhachHang newKh = new KhachHang();
            newKh.setMaKh("kh" + System.currentTimeMillis());
            newKh.setTenKh(req.getTenKh());
            newKh.setSdt(req.getSdt());
            newKh.setEmail(req.getEmail());
            return khachHangRepo.save(newKh);
        });

    // 2. Sinh mã Phiếu đặt
    Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('seq_phieudatphong_ma')", Long.class);
    String maPhieu = "dp" + String.format("%03d", nextVal);

    // 3. Khởi tạo Phiếu
    PhieuDatPhong phieu = new PhieuDatPhong();
    phieu.setMaDatPhong(maPhieu);
    phieu.setKhachHang(khachHang);
    phieu.setMaPhong(req.getMaPhong());
    phieu.setNgayCheckIn(req.getNgayCheckIn());
    phieu.setNgayCheckOut(req.getNgayCheckOut());
    phieu.setTrangThai("Chờ thanh toán");

    // 4. Tính toán tổng tiền sơ bộ (Tiền phòng)
    // Giả sử bạn lấy giá phòng từ Room Service thông qua FeignClient
    try {
        Object roomObj = roomClient.getRoomById(req.getMaPhong());
        // Logic parse giá từ roomObj và nhân với số ngày ở (Duration)
        // phieu.setTongGia(calculatedAmount);
    } catch (Exception e) {
        phieu.setTongGia(BigDecimal.ZERO); // Fallback nếu lỗi client
    }

    phieu = phieuRepo.save(phieu);

    // 5. Lưu dịch vụ đi kèm
    if (req.getServices() != null) {
        for (ServiceDTO s : req.getServices()) {
            ChiTietDatPhong ct = new ChiTietDatPhong();
            ct.setMaCTDP("ct" + UUID.randomUUID().toString().substring(0,8));
            ct.setMaDatPhong(phieu.getMaDatPhong());
            ct.setMaDichVu(s.getMaDichVu());
            ct.setSoLuong(s.getSoLuong());
            chitietRepo.save(ct);
        }
    }

    return phieu;
}

public List<PhieuDatPhong> getHistoryByPhone(String sdt) {
    // Tìm khách hàng theo SĐT rồi lấy danh sách phiếu
    return phieuRepo.findByKhachHang_SdtOrderByNgayCheckInDesc(sdt);
}

}