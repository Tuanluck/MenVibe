// src/main/java/com/example/clothingshop/service/AdminUserService.java
package com.example.clothingshop.service;

import com.example.clothingshop.dto.UpdateUserRequest;
import com.example.clothingshop.model.User;
import java.util.List;

public interface AdminUserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
}