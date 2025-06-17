package com.example.clothingshop.service;

import com.example.clothingshop.dto.CartResponseDTO;
import com.example.clothingshop.model.Cart;
import com.example.clothingshop.model.CartItem;

import java.util.List;

public interface CartService {
    Cart getCartByUserId(Long userId);
    CartItem addToCart(Long userId, Long productId, int quantity);
    CartItem increaseQuantity(Long userId, Long productId);
    CartItem decreaseQuantity(Long userId, Long productId); // Thêm mới
    void removeItem(Long userId, Long productId); // Thêm mới
    void clearCart(Long userId);
    double getCartTotal(Long userId); // Thêm mới
    Cart saveCart(Long userId, List<CartResponseDTO.CartItemDTO> items);
}