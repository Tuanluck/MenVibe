package com.example.clothingshop.service.impl;

import com.example.clothingshop.model.Category;
import com.example.clothingshop.repository.CategoryRepository;
import com.example.clothingshop.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}