import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { getUser, getToken } from "../utils/auth";

export default function Cart() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const token = getToken();
  const userId = user?.id;

  useEffect(() => {
    if (!token || !userId) {
      setError("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/cart/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được giỏ hàng.");
        return res.json();
      })
      .then((data) => {
        setCart(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, userId]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!productId || quantity < 1) {
      alert("Vui lòng nhập ID sản phẩm và số lượng hợp lệ.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/cart/${userId}/add?productId=${productId}&quantity=${quantity}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Thêm sản phẩm thất bại.");
      const data = await res.json();
      // Refresh cart after adding
      const cartRes = await fetch(`http://localhost:8080/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!cartRes.ok) throw new Error("Không tải lại được giỏ hàng.");
      const updatedCart = await cartRes.json();
      setCart(updatedCart);
      setProductId("");
      setQuantity(1);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/cart/${userId}/increase?productId=${productId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Cập nhật số lượng thất bại.");
      const data = await res.json();
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: data.product.quantity, totalPrice: data.product.totalPrice }
            : item
        ),
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const item = cart.items.find((i) => i.productId === productId);
    if (item.quantity <= 1) {
      alert("Số lượng không thể giảm dưới 1. Bạn có thể xóa toàn bộ giỏ hàng nếu muốn.");
      return;
    }
    alert("Chức năng giảm số lượng hiện không được hỗ trợ. Vui lòng liên hệ hỗ trợ.");
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa giỏ hàng thất bại.");
      setCart((prev) => ({ ...prev, items: [] }));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="loader h-16 w-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  const totalCartPrice = cart?.items?.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  ) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header cartItems={cart?.items || []} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
          <h2 className="text-3xl font-semibold text-white mb-6">Giỏ Hàng</h2>
          {/* Add Product Form */}
          <form onSubmit={handleAddToCart} className="mb-6 flex space-x-4">
            <div>
              <label className="block text-gray-400 uppercase text-xs mb-1">
                ID Sản Phẩm
              </label>
              <input
                type="number"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-32 p-2 rounded bg-gray-700 text-white focus:outline-none"
                placeholder="Nhập ID"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 uppercase text-xs mb-1">
                Số Lượng
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min="1"
                className="w-24 p-2 rounded bg-gray-700 text-white focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
            >
              Thêm vào giỏ
            </button>
          </form>
          {/* Cart Items */}
          {cart?.items?.length > 0 ? (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gray-700 p-4 rounded-lg"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg text-white">{item.name}</h3>
                      <p className="text-gray-400">
                        Đơn giá: {item.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                      <p className="text-gray-400">
                        Tổng: {item.totalPrice.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                      >
                        -
                      </button>
                      <span className="text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.productId)}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <p className="text-xl text-white">
                  Tổng cộng: {totalCartPrice.toLocaleString("vi-VN")} VNĐ
                </p>
                <button
                  onClick={handleClearCart}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center">Giỏ hàng trống.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}