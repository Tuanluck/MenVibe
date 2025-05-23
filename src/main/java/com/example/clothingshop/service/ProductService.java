package com.example.clothingshop.service;

import com.example.clothingshop.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> getProductsByCategory(Long categoryId);
    Product getProductById(Long id);
    List<Product> searchProducts(String keyword);
    List<Product> getAllProducts();

}