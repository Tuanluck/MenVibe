package com.example.clothingshop.controller;

import com.example.clothingshop.dto.LoginRequest;
import com.example.clothingshop.dto.RegisterRequest;
import com.example.clothingshop.dto.UpdateUserRequest;
import com.example.clothingshop.model.User;
import com.example.clothingshop.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Đăng ký user mới
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest registerRequest) {
        User user = authService.register(registerRequest);
        return ResponseEntity.ok(user);
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {
        User user = authService.login(loginRequest);
        return ResponseEntity.ok(user);
    }

    // Lấy thông tin tất cả users (chỉ dành cho admin)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Lấy thông tin user bằng ID
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = authService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // Cập nhật thông tin user
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest updateRequest) {
        User updatedUser = authService.updateUser(id, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    // Xóa user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}