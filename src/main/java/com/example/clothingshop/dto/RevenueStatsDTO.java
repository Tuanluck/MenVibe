package com.example.clothingshop.dto;

import lombok.Data;

@Data
public class RevenueStatsDTO {

    private String period; // Thời gian (ngày hoặc tháng, tùy theo loại thống kê)
    private Double totalRevenue; // Tổng doanh thu
    private Long orderCount; // Số lượng đơn hàng

    public RevenueStatsDTO() {}

    public RevenueStatsDTO(String period, Double totalRevenue, Long orderCount) {
        this.period = period;
        this.totalRevenue = totalRevenue;
        this.orderCount = orderCount;
    }
}