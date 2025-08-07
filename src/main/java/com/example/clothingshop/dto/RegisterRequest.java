// src/main/java/com/example/clothingshop/dto/RegisterRequest.java
package com.example.clothingshop.dto;

import lombok.Data;

import java.util.Date;


@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String password;
    private Date birthDate;
    private String gender;
}