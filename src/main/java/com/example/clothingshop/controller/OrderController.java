package com.example.clothingshop.controller;

import com.example.clothingshop.dto.RevenueStatsDTO;
import com.example.clothingshop.model.Order;
import com.example.clothingshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order createOrder(@RequestParam Long userId, @RequestParam String shippingAddress) {
        return orderService.createOrder(userId, shippingAddress);
    }

    @GetMapping("/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public Order checkout(@RequestParam Long userId, @RequestParam String shippingAddress, @RequestParam String email) {
        return orderService.processPaymentAndSendEmail(userId, shippingAddress, email);
    }

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/stats/daily")
    public List<RevenueStatsDTO> getDailyStats(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @RequestParam(required = false) String status) {
        return orderService.getDailyStats(startDate, endDate, status);
    }

    @GetMapping("/stats/monthly")
    public List<RevenueStatsDTO> getMonthlyStats(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @RequestParam(required = false) String status) {
        return orderService.getMonthlyStats(startDate, endDate, status);
    }
}