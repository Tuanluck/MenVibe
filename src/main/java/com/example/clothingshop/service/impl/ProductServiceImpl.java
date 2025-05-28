package com.example.clothingshop.service.impl;

import com.example.clothingshop.model.Product;
import com.example.clothingshop.repository.ProductRepository;
import com.example.clothingshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        return productRepository.findAll().stream()
                .filter(p -> p.getName().toLowerCase().contains(keyword.toLowerCase()))
                .toList();
    }

    @Override
    public List<Product> getAllProducts() {
        return List.of();
    }

    @Override
    public List<Product> filterProducts(Long categoryId, Double minPrice, Double maxPrice, Boolean inStock) {
        return productRepository.filterProducts(categoryId, minPrice, maxPrice, inStock);
    }
}