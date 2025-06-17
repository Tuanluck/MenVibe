package com.example.clothingshop.service.impl;

import com.example.clothingshop.dto.CartResponseDTO;
import com.example.clothingshop.model.Cart;
import com.example.clothingshop.model.CartItem;
import com.example.clothingshop.model.Product;
import com.example.clothingshop.model.User;
import com.example.clothingshop.repository.CartRepository;
import com.example.clothingshop.repository.ProductRepository;
import com.example.clothingshop.repository.UserRepository;
import com.example.clothingshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart getCartByUserId(Long userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isPresent()) {
            return cartOpt.get();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Cart newCart = new Cart();
        newCart.setUser(user);
        return cartRepository.save(newCart);
    }

    @Override
    public CartItem addToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cart.getItems().add(cartItem);
        }

        cartItem.setTotalPrice(product.getPrice() * cartItem.getQuantity()); // Cập nhật totalPrice
        cartRepository.save(cart);
        return cartItem;
    }

    @Override
    public CartItem increaseQuantity(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart with ID: " + productId));

        cartItem.setQuantity(cartItem.getQuantity() + 1);
        cartItem.setTotalPrice(cartItem.getProduct().getPrice() * cartItem.getQuantity()); // Cập nhật totalPrice
        cartRepository.save(cart);
        return cartItem;
    }

    @Override
    public CartItem decreaseQuantity(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart with ID: " + productId));

        cartItem.setQuantity(cartItem.getQuantity() - 1);
        if (cartItem.getQuantity() <= 0) {
            cart.getItems().remove(cartItem);
            // Giả định bạn có CartItemRepository để xóa item
            // Nếu không, chỉ cần xóa khỏi danh sách items
            return null; // Trả null để báo hiệu đã xóa
        }
        cartItem.setTotalPrice(cartItem.getProduct().getPrice() * cartItem.getQuantity()); // Cập nhật totalPrice
        cartRepository.save(cart);
        return cartItem;
    }

    @Override
    public void removeItem(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        CartItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart with ID: " + productId));
        cart.getItems().remove(itemToRemove);
        // Giả định bạn có CartItemRepository để xóa item khỏi database
        // Nếu không, chỉ cần xóa khỏi danh sách items
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public double getCartTotal(Long userId) {
        Cart cart = getCartByUserId(userId);
        return cart.getItems().stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
    }

    @Override
    public Cart saveCart(Long userId, List<CartResponseDTO.CartItemDTO> items) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear(); // Xóa giỏ hiện tại

        for (CartResponseDTO.CartItemDTO itemDTO : items) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + itemDTO.getProductId()));
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(itemDTO.getQuantity());
            cartItem.setTotalPrice(product.getPrice() * itemDTO.getQuantity()); // Cập nhật totalPrice
            cart.getItems().add(cartItem);
        }
        return cartRepository.save(cart);
    }
}