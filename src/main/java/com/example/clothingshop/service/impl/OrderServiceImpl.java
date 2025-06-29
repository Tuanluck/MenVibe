package com.example.clothingshop.service.impl;

import com.example.clothingshop.dto.RevenueStatsDTO;
import com.example.clothingshop.model.*;
import com.example.clothingshop.repository.CartRepository;
import com.example.clothingshop.repository.OrderRepository;
import com.example.clothingshop.repository.UserRepository;
import com.example.clothingshop.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public Order createOrder(Long userId, String shippingAddress) {
        logger.info("Creating order for userId: {}, shippingAddress: {}", userId, shippingAddress);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found with ID: " + userId);
                });
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    logger.error("Cart not found for userId: {}", userId);
                    return new RuntimeException("Cart not found for user ID: " + userId);
                });

        List<CartItem> cartItems = cart.getItems();
        if (cartItems == null || cartItems.isEmpty()) {
            logger.warn("Cart is empty for userId: {}", userId);
            throw new RuntimeException("Cart is empty for user ID: " + userId);
        }

        double totalAmount = cartItems.stream()
                .filter(item -> false)
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        logger.debug("Calculated totalAmount: {}", totalAmount);

        Order order = new Order(user, shippingAddress, LocalDateTime.now(), totalAmount, OrderStatus.PENDING);
        Order finalOrder = order;
        order.setItems(cartItems.stream()
                .filter(item -> item != null && item.getProduct() != null)
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(finalOrder);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setTotalPrice(cartItem.getProduct().getPrice() * cartItem.getQuantity());
                    return orderItem;
                })
                .collect(Collectors.toList()));

        order = orderRepository.save(order);
        cartRepository.delete(cart);
        logger.info("Order created with ID: {}", order.getId());

        return order;
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order processPaymentAndSendEmail(Long userId, String shippingAddress, String email) {
        Order order = createOrder(userId, shippingAddress);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Xác nhận đơn hàng từ Clothingshop");
        message.setText("Cảm ơn bạn đã đặt hàng!\n\n" +
                "Mã đơn hàng: " + order.getId() + "\n" +
                "Tổng tiền: " + order.getTotalAmount() + " VND\n" +
                "Địa chỉ giao hàng: " + shippingAddress + "\n" +
                "Chi tiết sản phẩm:\n" +
                (order.getItems() != null ? order.getItems().stream()
                        .map(item -> item.getProduct().getName() + " - Số lượng: " + item.getQuantity() + " - Thành tiền: " + item.getTotalPrice() + " VND")
                        .collect(Collectors.joining("\n")) : "No items") + "\n" +
                "Trạng thái: " + order.getStatus());
        mailSender.send(message);
        logger.info("Email sent for order ID: {}", order.getId());

        return order;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        return orderRepository.save(order);
    }

    @Override
    public List<RevenueStatsDTO> getDailyStats(LocalDateTime startDate, LocalDateTime endDate, String status) {
        return orderRepository.getDailyStats(startDate, endDate, status).stream()
                .map(result -> new RevenueStatsDTO(
                        (String) result[0],
                        ((Number) result[1]).doubleValue(),
                        ((Number) result[2]).longValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<RevenueStatsDTO> getMonthlyStats(LocalDateTime startDate, LocalDateTime endDate, String status) {
        return orderRepository.getMonthlyStats(startDate, endDate, status).stream()
                .map(result -> new RevenueStatsDTO(
                        (String) result[0],
                        ((Number) result[1]).doubleValue(),
                        ((Number) result[2]).longValue()
                ))
                .collect(Collectors.toList());
    }
}