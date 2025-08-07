import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { clearCart, fetchCart, fetchTotal } from "../features/cart/cartSlice";
import { FiShoppingCart, FiTruck, FiMail, FiCheckCircle } from "react-icons/fi";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getUser();
  const userId = user?.id;

  const { items: cartItems, total } = useSelector((state) => state.cart);
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod or bank

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
      dispatch(fetchTotal(userId));
    } else {
      alert("Bạn cần đăng nhập để thanh toán!");
      navigate("/login");
    }
  }, [userId, dispatch, navigate]);

  const handleCheckout = async () => {
    if (!shippingAddress || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/checkout?userId=${userId}&shippingAddress=${encodeURIComponent(
          shippingAddress
        )}&email=${encodeURIComponent(email)}&paymentMethod=${paymentMethod}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Thanh toán thất bại");

      alert("Đặt hàng thành công! Cảm ơn bạn!");
      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header cartItems={cartItems} />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-black text-white px-6 py-4">
              <h1 className="text-2xl font-bold flex items-center">
                <FiShoppingCart className="mr-3" />
                Thanh Toán Đơn Hàng
              </h1>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Shipping Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiTruck className="mr-2" />
                  Thông Tin Giao Hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Địa chỉ giao hàng *</label>
                    <input
                      type="text"
                      placeholder="Nhập địa chỉ đầy đủ"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email nhận xác nhận *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Phương Thức Thanh Toán</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === "cod" ? "border-black bg-black" : "border-gray-300"}`}>
                        {paymentMethod === "cod" && <FiCheckCircle className="text-white text-xs" />}
                      </div>
                      <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </div>
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "bank" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                    onClick={() => setPaymentMethod("bank")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === "bank" ? "border-black bg-black" : "border-gray-300"}`}>
                        {paymentMethod === "bank" && <FiCheckCircle className="text-white text-xs" />}
                      </div>
                      <span className="font-medium">Chuyển khoản ngân hàng</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Tóm Tắt Đơn Hàng</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.productId || item.id} className="p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img
                              src={item.imageUrl || "https://via.placeholder.com/80"}
                              alt={item.name}
                              className="w-16 h-16 rounded-md object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Tạm tính:</span>
                      <span>{total?.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">Phí vận chuyển:</span>
                      <span>0đ</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <span className="text-lg font-bold">Tổng cộng:</span>
                      <span className="text-lg font-bold">{total?.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                disabled={loading || cartItems.length === 0}
                onClick={handleCheckout}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all ${loading || cartItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 hover:shadow-lg"}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "XÁC NHẬN ĐẶT HÀNG"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;