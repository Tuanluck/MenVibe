package com.example.clothingshop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private double price;
    private int stock;

    @Column(name = "image_url")
    private String imageUrl;  // Added field for storing image URL or path

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}