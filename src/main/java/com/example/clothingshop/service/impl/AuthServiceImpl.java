// src/main/java/com/example/clothingshop/service/impl/AuthServiceImpl.java
package com.example.clothingshop.service.impl;

import com.example.clothingshop.dto.LoginRequest;
import com.example.clothingshop.dto.RegisterRequest;
import com.example.clothingshop.model.User;
import com.example.clothingshop.repository.UserRepository;
import com.example.clothingshop.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User register(RegisterRequest registerRequest) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Tạo user mới
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword()); // Lưu ý: nên mã hóa password
        user.setEmail(registerRequest.getEmail());

        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}