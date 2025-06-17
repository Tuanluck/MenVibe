package com.example.clothingshop.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

@Entity
@Data
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonBackReference
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonManagedReference
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Setter
    @Column(name = "total_price")
    private Double totalPrice;

    // Constructor mặc định
    public CartItem() {}

    // Constructor với tham số
    public CartItem(Cart cart, Product product, int quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.totalPrice = product.getPrice() * quantity; // Loại bỏ if, giả định price không null
    }

    // Phương thức getTotalPrice (tính động)
    public double getTotalPrice() {
        return product.getPrice() * quantity; // Loại bỏ if, giả định price không null
    }
}