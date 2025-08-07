package com.example.clothingshop.dto;

import lombok.Data;
import java.util.Date;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private Date birthDate;
    private String gender;
}