package com.example.clothingshop.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName; // Họ

    @Column(nullable = false)
    private String lastName; // Tên

    @Column(nullable = false, unique = true)
    private String phone; // Số điện thoại

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date birthDate; // Ngày sinh

    @Column(nullable = false)
    private String gender; // Giới tính

    // ➕ Thêm cho chức năng quên mật khẩu
    private String resetToken;

    private LocalDateTime resetTokenExpiry;
}
