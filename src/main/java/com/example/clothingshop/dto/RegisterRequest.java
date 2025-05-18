// src/main/java/com/example/clothingshop/dto/RegisterRequest.java
package com.example.clothingshop.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
}