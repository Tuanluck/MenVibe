package com.example.clothingshop.service;

import com.example.clothingshop.model.Cart;
import com.example.clothingshop.model.CartItem;

public interface CartService {
    Cart getCartByUserId(Long userId);
    CartItem addToCart(Long userId, Long productId, int quantity);
    CartItem increaseQuantity(Long userId, Long productId);
    void clearCart(Long userId);
}