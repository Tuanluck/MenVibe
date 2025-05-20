package com.example.clothingshop.service;

import com.example.clothingshop.dto.*;
import com.example.clothingshop.model.User;
import java.util.List;

public interface AuthService {
    User register(RegisterRequest registerRequest);
    User login(LoginRequest loginRequest);
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUser(Long id, UpdateUserRequest updateRequest);
    void deleteUser(Long id);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}