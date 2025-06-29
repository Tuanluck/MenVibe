import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { FiPackage, FiCalendar, FiMapPin, FiDollarSign, FiClock, FiCheckCircle, FiTruck } from "react-icons/fi";
import { motion } from "framer-motion";

const MyOrdersPage = () => {
  const user = getUser();
  const navigate = useNavigate();
  const userId = user?.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      alert("Vui lòng đăng nhập để xem đơn hàng của bạn!");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/orders/${userId}`);
        if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Đã giao":
        return <FiCheckCircle className="text-green-500" />;
      case "Đang giao":
        return <FiTruck className="text-blue-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-100 text-green-800";
      case "Đang giao":
        return "bg-blue-100 text-blue-800";
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Header cartItems={[]} />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiPackage className="mr-3" />
              Đơn Hàng Của Tôi
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FiPackage className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Bạn chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mb-6">Các đơn hàng của bạn sẽ xuất hiện tại đây</p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Tiếp tục mua sắm
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full mr-3">
                          #{order.id}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)} flex items-center`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="mr-1" />
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleString("vi-VN")
                          : "Không rõ"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-start">
                        <FiMapPin className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                          <p className="text-gray-800">{order.shippingAddress || "Không có"}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FiDollarSign className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Tổng tiền</p>
                          <p className="text-gray-800 font-medium">
                            {typeof order.totalPrice === "number"
                              ? order.totalPrice.toLocaleString("vi-VN") + "đ"
                              : "Đang cập nhật"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FiPackage className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Số lượng sản phẩm</p>
                          <p className="text-gray-800">{order.items?.length || 0} sản phẩm</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-sm font-medium text-black hover:text-gray-700 transition flex items-center"
                    >
                      Xem chi tiết đơn hàng
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrdersPage;