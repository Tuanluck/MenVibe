// src/main/java/com/example/clothingshop/dto/LoginRequest.java
package com.example.clothingshop.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}