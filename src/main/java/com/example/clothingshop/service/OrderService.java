package com.example.clothingshop.service;

import com.example.clothingshop.dto.RevenueStatsDTO;
import com.example.clothingshop.model.Order;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    Order createOrder(Long userId, String shippingAddress);
    List<Order> getOrdersByUserId(Long userId);
    Order processPaymentAndSendEmail(Long userId, String shippingAddress, String email);
    List<Order> getAllOrders();
    Order updateOrderStatus(Long orderId, String status);
    List<RevenueStatsDTO> getDailyStats(LocalDateTime startDate, LocalDateTime endDate, String status);
    List<RevenueStatsDTO> getMonthlyStats(LocalDateTime startDate, LocalDateTime endDate, String status);
}