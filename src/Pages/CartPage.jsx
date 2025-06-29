// src/features/cart/CartPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import {
  fetchCart,
  fetchTotal,
  clearCart,
  setError,
  updateCart,
} from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import {
  FiShoppingCart,
  FiTrash2,
  FiSave,
  FiArrowRight,
  FiLogIn,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: reduxItems, total, loading, error } = useSelector((state) => state.cart);
  const [guestItems, setGuestItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = getUser();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
      dispatch(fetchTotal(userId));
    } else {
      const stored = JSON.parse(localStorage.getItem("guestCart")) || [];
      setGuestItems(stored);
    }
  }, [dispatch, userId]);

  const handleQuantityChange = async (productId, action) => {
    setIsProcessing(true);
    if (!userId) {
      // Guest mode
      const updated = guestItems.map((item) => {
        if (item.id === productId) {
          const newQty = action === "increase" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      }).filter((item) => item.quantity > 0);

      setGuestItems(updated);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      setIsProcessing(false);
      return;
    }

    try {
      const endpoint = action === "increase" ? "increase" : "decrease";
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/${endpoint}?productId=${productId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Cập nhật số lượng thất bại");
      dispatch(fetchCart(userId));
      dispatch(fetchTotal(userId));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    setIsProcessing(true);

    if (!userId) {
      const filtered = guestItems.filter((item) => item.id !== productId);
      setGuestItems(filtered);
      localStorage.setItem("guestCart", JSON.stringify(filtered));
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/remove?productId=${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");
      dispatch(updateCart(reduxItems.filter((item) => item.productId !== productId)));
      dispatch(fetchTotal(userId));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) return;
    setIsProcessing(true);

    if (!userId) {
      localStorage.removeItem("guestCart");
      setGuestItems([]);
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/clear`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa giỏ hàng thất bại");
      dispatch(clearCart());
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveCart = async () => {
    if (!userId) {
      alert("Bạn cần đăng nhập để lưu giỏ hàng.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reduxItems),
      });
      if (!res.ok) throw new Error("Lưu giỏ hàng thất bại");
      alert("Giỏ hàng đã được lưu!");
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thanh toán.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const displayedItems = userId ? reduxItems : guestItems;
  const totalPrice = displayedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading && userId)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
        <p className="text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    );

  return (
    <>
      <Header cartItems={[]} />
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FiShoppingCart className="mr-3" />
                Giỏ hàng của bạn
              </h1>
            </div>

            <div className="p-6">
              {displayedItems.length === 0 ? (
                <div className="text-center py-12">
                  <FiShoppingCart className="mx-auto text-5xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Giỏ hàng trống
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Hãy thêm sản phẩm vào giỏ hàng của bạn
                  </p>
                  <button
                    onClick={() => navigate("/home")}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md text-black hover:bg-gray-100 transition-colors"
                  >
                    Tiếp tục mua sắm <FiArrowRight className="ml-2" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-4 border-b border-gray-200"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.imageUrl || "https://via.placeholder.com/300"}
                          alt={item.name}
                          className="h-20 w-20 rounded-md object-cover border border-gray-200"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {item.price.toLocaleString()} VNĐ
                          </p>
                          <div className="mt-2 flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.id || item.productId, "decrease")}
                              disabled={item.quantity <= 1 || isProcessing}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="text-gray-900 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id || item.productId, "increase")}
                              disabled={isProcessing}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleRemoveItem(item.id || item.productId)}
                        disabled={isProcessing}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {displayedItems.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tổng cộng:</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPrice.toLocaleString()} VNĐ
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleClearCart}
                    disabled={isProcessing}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FiTrash2 className="mr-2" />
                    Xóa giỏ hàng
                  </button>

                  <button
                    onClick={handleSaveCart}
                    disabled={isProcessing}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    Lưu giỏ hàng
                  </button>

                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Thanh toán <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
