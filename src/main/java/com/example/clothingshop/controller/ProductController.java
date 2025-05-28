package com.example.clothingshop.controller;

import com.example.clothingshop.model.Product;
import com.example.clothingshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Lấy tất cả sản phẩm
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Lấy sản phẩm theo categoryId (tham số tùy chọn)
    @GetMapping
    public List<Product> getProductsByCategory(@RequestParam(required = false) Long categoryId) {
        try {
            return categoryId != null
                    ? productService.getProductsByCategory(categoryId)
                    : productService.getAllProducts();
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + categoryId, e);
        }
    }

    // Lấy chi tiết sản phẩm theo ID
    @GetMapping("/{id}")
    public Product getProductDetails(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with ID: " + id);
        }
        return product;
    }

    // Tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Keyword is required for search");
        }
        return productService.searchProducts(keyword);
    }

    // Lọc sản phẩm theo các tiêu chí
    @GetMapping("/filter")
    public List<Product> filterProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock) {
        try {
            // Kiểm tra giá trị minPrice và maxPrice hợp lệ (tránh âm hoặc quá lớn bất thường)
            if (minPrice != null && minPrice < 0) {
                throw new IllegalArgumentException("Minimum price cannot be negative");
            }
            if (maxPrice != null && maxPrice < 0) {
                throw new IllegalArgumentException("Maximum price cannot be negative");
            }
            if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
                throw new IllegalArgumentException("Minimum price cannot be greater than maximum price");
            }
            return productService.filterProducts(categoryId, minPrice, maxPrice, inStock);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter parameters", e);
        }
    }
}