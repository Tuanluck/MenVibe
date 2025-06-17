package com.example.clothingshop.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class CartResponseDTO {
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
        private Long id;
        private Long productId;
        private String name; // Sửa từ productName thành name để khớp với khai báo trường
        private Double price;
        private String imageUrl;
        private int quantity;
        private Double totalPrice;

        public CartItemDTO(Long id, Long productId, String name, Double price, String imageUrl, int quantity, Double totalPrice) {
            this.id = id;
            this.productId = productId;
            this.name = name; // Sử dụng name thay vì productName
            this.price = price;
            this.imageUrl = imageUrl;
            this.quantity = quantity;
            this.totalPrice = totalPrice;
        }
    }
}