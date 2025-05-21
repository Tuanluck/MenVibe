package com.example.clothingshop.service.impl;

import com.example.clothingshop.dto.ForgotPasswordRequest;
import com.example.clothingshop.dto.ResetPasswordRequest;
import com.example.clothingshop.dto.LoginRequest;
import com.example.clothingshop.dto.RegisterRequest;
import com.example.clothingshop.dto.UpdateUserRequest;
import com.example.clothingshop.model.User;
import com.example.clothingshop.repository.UserRepository;
import com.example.clothingshop.service.AuthService;
import com.example.clothingshop.service.EmailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.ClassPathResource;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.io.IOException;


@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Override
    public User register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được đăng ký");
        }

        if (userRepository.findByPhone(registerRequest.getPhone()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhone(registerRequest.getPhone());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword()); // Nên mã hóa mật khẩu
        user.setBirthDate(registerRequest.getBirthDate());
        user.setGender(registerRequest.getGender());

        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + id));
    }

    @Override
    public User updateUser(Long id, UpdateUserRequest updateRequest) {
        User existingUser = getUserById(id);

        if (updateRequest.getFirstName() != null) {
            existingUser.setFirstName(updateRequest.getFirstName());
        }
        if (updateRequest.getLastName() != null) {
            existingUser.setLastName(updateRequest.getLastName());
        }
        if (updateRequest.getPhone() != null) {
            if (!existingUser.getPhone().equals(updateRequest.getPhone()) &&
                    userRepository.findByPhone(updateRequest.getPhone()).isPresent()) {
                throw new RuntimeException("Số điện thoại đã được sử dụng");
            }
            existingUser.setPhone(updateRequest.getPhone());
        }
        if (updateRequest.getBirthDate() != null) {
            existingUser.setBirthDate(updateRequest.getBirthDate());
        }
        if (updateRequest.getGender() != null) {
            existingUser.setGender(updateRequest.getGender());
        }

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    // ✅ Xử lý quên mật khẩu
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        String emailContent = loadEmailTemplate(token);
        emailService.sendHtmlEmail(
                user.getEmail(),
                "Yêu cầu đặt lại mật khẩu",
                emailContent
        );

    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token đã hết hạn");
        }

        user.setPassword(request.getNewPassword()); // 🔐 Nên mã hóa mật khẩu nếu có
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }
    private String loadEmailTemplate(String token) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/reset-password-template.html");
            String template = new String(Files.readAllBytes(resource.getFile().toPath()), StandardCharsets.UTF_8);
            String resetLink = "http://localhost:3000/reset-password?token=" + token;
            return template.replace("${resetLink}", resetLink);
        } catch (IOException e) {
            throw new RuntimeException("Không thể load email template", e);
        }
    }



}