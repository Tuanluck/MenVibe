package com.example.clothingshop.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String shippingAddress;
    private LocalDateTime orderDate;
    private double totalAmount;
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Quản lý tham chiếu từ Order đến OrderItem
    private List<OrderItem> items;

    public Order() {}

    public Order(User user, String shippingAddress, LocalDateTime orderDate, double totalAmount, OrderStatus status) {
        this.user = user;
        this.shippingAddress = shippingAddress;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }
}