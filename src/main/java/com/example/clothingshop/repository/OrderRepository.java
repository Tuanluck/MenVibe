package com.example.clothingshop.repository;

import com.example.clothingshop.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    @Query("SELECT DATE(orderDate) as period, SUM(totalAmount) as totalRevenue, COUNT(id) as orderCount " +
            "FROM Order " +
            "WHERE orderDate BETWEEN :startDate AND :endDate " +
            "AND (:status IS NULL OR status = :status) " +
            "GROUP BY DATE(orderDate)")
    List<Object[]> getDailyStats(LocalDateTime startDate, LocalDateTime endDate, String status);

    @Query("SELECT DATE_TRUNC('month', orderDate) as period, SUM(totalAmount) as totalRevenue, COUNT(id) as orderCount " +
            "FROM Order " +
            "WHERE orderDate BETWEEN :startDate AND :endDate " +
            "AND (:status IS NULL OR status = :status) " +
            "GROUP BY DATE_TRUNC('month', orderDate)")
    List<Object[]> getMonthlyStats(LocalDateTime startDate, LocalDateTime endDate, String status);

    List<Order> findAll();
}