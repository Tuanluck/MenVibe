// src/main/java/com/example/clothingshop/service/AuthService.java
package com.example.clothingshop.service;

import com.example.clothingshop.dto.LoginRequest;
import com.example.clothingshop.dto.RegisterRequest;
import com.example.clothingshop.model.User;

public interface AuthService {
    User register(RegisterRequest registerRequest);
    User login(LoginRequest loginRequest);
}