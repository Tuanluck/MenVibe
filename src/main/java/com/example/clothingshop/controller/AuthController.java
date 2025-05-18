package com.example.clothingshop.controller;

import com.example.clothingshop.dto.LoginRequest;
import com.example.clothingshop.dto.RegisterRequest;
import com.example.clothingshop.model.User;
import com.example.clothingshop.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}

