package com.example.room_service.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.room_service.dto.RoomRequestDTO; // Import DTO
import com.example.room_service.entity.*;
import com.example.room_service.service.RoomService;

@RestController
@RequestMapping("/api")
public class RoomController {
    @Autowired private RoomService roomService;

    // --- ROOMS ---
    @GetMapping("/rooms")
<<<<<<< HEAD
<<<<<<< HEAD
    public ResponseEntity<List<Phong>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // SỬA ĐỔI: Nhận RoomRequestDTO
    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(@RequestBody RoomRequestDTO roomDTO) {
=======
=======
>>>>>>> parent of 0544b01 (UpDocker)
    public ResponseEntity<Page<Phong>> getAllRooms(
            @RequestParam(defaultValue = "0") int page, // Mặc định trang 0
            @RequestParam(defaultValue = "10") int size // Mặc định 10 dòng
    ) {
        return ResponseEntity.ok(roomService.getAllRooms(page, size));
    }

// SỬA: Thêm tham số file ảnh và đổi thành @ModelAttribute
    @PostMapping(value = "/rooms", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRoom(
            @ModelAttribute RoomRequestDTO roomDTO, // Dữ liệu text (số phòng, loại...)
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile // File ảnh
    ) {
>>>>>>> parent of 0544b01 (UpDocker)
        try {
            return ResponseEntity.ok(roomService.createRoom(roomDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/rooms/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(roomService.getRoomStats());
    }

    // --- LOẠI PHÒNG (Cần thiết cho dropdown frontend) ---
    @GetMapping("/loai-phong")
<<<<<<< HEAD
<<<<<<< HEAD
    public ResponseEntity<List<LoaiPhong>> getAllLoaiPhong() {
        return ResponseEntity.ok(roomService.getAllLoaiPhong());
=======
=======
>>>>>>> parent of 0544b01 (UpDocker)
    public ResponseEntity<Page<LoaiPhong>> getAllLoaiPhong(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(roomService.getAllLoaiPhong(page, size));
>>>>>>> parent of 0544b01 (UpDocker)
    }

    @PostMapping("/loai-phong")
    public ResponseEntity<?> createLoaiPhong(@RequestBody LoaiPhong loaiPhong) {
        return ResponseEntity.ok(roomService.createLoaiPhong(loaiPhong));
    }

    // --- DỊCH VỤ ---
    @GetMapping("/dich-vu")
<<<<<<< HEAD
<<<<<<< HEAD
    public ResponseEntity<List<DichVu>> getAllDichVu() {
        return ResponseEntity.ok(roomService.getAllDichVu());
=======
=======
>>>>>>> parent of 0544b01 (UpDocker)
    public ResponseEntity<Page<DichVu>> getAllDichVu(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(roomService.getAllDichVu(page, size));
    }

    @PostMapping("/dich-vu")
    public ResponseEntity<?> createDichVu(@RequestBody DichVu dichVu) {
        try{
            if(dichVu.getGiaTien() < 0){
                throw new RuntimeException("Giá tiền dịch vụ không được âm.");
            }
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
        try{
            return ResponseEntity.ok(roomService.createDichVu(dichVu));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }

    }
    @GetMapping("/rooms/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable String id) {
        try {
            // Gọi service để tìm phòng (nên dùng hàm tìm kiếm không phân biệt hoa thường)
            return ResponseEntity.ok(roomService.getRoomById(id));
        } catch (RuntimeException e) {
            // Trả về 404 nếu không tìm thấy (để Booking Service bắt được lỗi FeignException.NotFound)
            return ResponseEntity.notFound().build();
        }
>>>>>>> parent of 0544b01 (UpDocker)
    }
}