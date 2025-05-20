// src/main/java/com/example/clothingshop/repository/UserRepository.java
package com.example.clothingshop.repository;

import com.example.clothingshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByResetToken(String resetToken);

}