package com.example.clothingshop.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class CartResponseDTO {
    // Getters and setters
    private Long id;
    private Long userId;
    private List<CartItemDTO> items;

    public CartResponseDTO(Long id, Long userId, List<CartItemDTO> items) {
        this.id = id;
        this.userId = userId;
        this.items = items;
    }

    @Setter
    @Getter
    public static class CartItemDTO {
        // Getters and setters
        private Long id;
        private Long productId;
        private String productName;
        private double price;
        private String imageUrl;
        private int quantity;
        private double totalPrice;

        public CartItemDTO(Long id, Long productId, String productName, double price, String imageUrl, int quantity, double totalPrice) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.imageUrl = imageUrl;
            this.quantity = quantity;
            this.totalPrice = totalPrice;
        }

    }
}