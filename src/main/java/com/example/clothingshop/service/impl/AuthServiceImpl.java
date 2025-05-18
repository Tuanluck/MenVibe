package com.example.clothingshop.service.impl;

import com.example.clothingshop.dto.LoginRequest;
import com.example.clothingshop.dto.RegisterRequest;
import com.example.clothingshop.dto.UpdateUserRequest;
import com.example.clothingshop.model.User;
import com.example.clothingshop.repository.UserRepository;
import com.example.clothingshop.service.AuthService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User register(RegisterRequest registerRequest) {
        // Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được đăng ký");
        }

        // Kiểm tra số điện thoại đã tồn tại
        if (userRepository.findByPhone(registerRequest.getPhone()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }

        // Tạo user mới
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhone(registerRequest.getPhone());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword()); // Lưu ý: Nên mã hóa password
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

        // Cập nhật các trường được cung cấp
        if (updateRequest.getFirstName() != null) {
            existingUser.setFirstName(updateRequest.getFirstName());
        }
        if (updateRequest.getLastName() != null) {
            existingUser.setLastName(updateRequest.getLastName());
        }
        if (updateRequest.getPhone() != null) {
            // Kiểm tra số điện thoại mới không trùng với user khác
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
}