package com.example.clothingshop.controller;

import com.example.clothingshop.dto.CartResponseDTO;
import com.example.clothingshop.model.Cart;
import com.example.clothingshop.model.CartItem;
import com.example.clothingshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public CartResponseDTO getCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            List<CartResponseDTO.CartItemDTO> items = cart.getItems().stream()
                    .map(item -> new CartResponseDTO.CartItemDTO(
                            item.getId(),
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getProduct().getPrice(),
                            item.getProduct().getImageUrl(),
                            item.getQuantity(),
                            item.getTotalPrice()
                    ))
                    .collect(Collectors.toList());
            return new CartResponseDTO(cart.getId(), cart.getUser().getId(), items);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{userId}/add")
    public Map<String, Object> addToCart(@PathVariable Long userId,
                                         @RequestParam Long productId,
                                         @RequestParam(defaultValue = "1") int quantity) {
        try {
            CartItem cartItem = cartService.addToCart(userId, productId, quantity);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã thêm");
            response.put("product", Map.of(
                    "id", cartItem.getProduct().getId(),
                    "name", cartItem.getProduct().getName(),
                    "price", cartItem.getProduct().getPrice(),
                    "imageUrl", cartItem.getProduct().getImageUrl(),
                    "quantity", cartItem.getQuantity(),
                    "totalPrice", cartItem.getTotalPrice()
            ));
            return response;
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PutMapping("/{userId}/increase")
    public Map<String, Object> increaseQuantity(@PathVariable Long userId,
                                                @RequestParam Long productId) {
        try {
            CartItem cartItem = cartService.increaseQuantity(userId, productId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã cập nhật số lượng");
            response.put("product", Map.of(
                    "id", cartItem.getProduct().getId(),
                    "name", cartItem.getProduct().getName(),
                    "price", cartItem.getProduct().getPrice(),
                    "imageUrl", cartItem.getProduct().getImageUrl(),
                    "quantity", cartItem.getQuantity(),
                    "totalPrice", cartItem.getTotalPrice()
            ));
            return response;
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/clear")
    public void clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}