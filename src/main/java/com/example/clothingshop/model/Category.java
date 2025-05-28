package com.example.clothingshop.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Product> products = new ArrayList<>();
}