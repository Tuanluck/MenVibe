import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth"; 

const AddProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
    stock: "",
  });
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const user = getUser(); // Kiểm tra người dùng
  const userId = user?.id;

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddToCart = async () => {
    const productData = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      quantity,
      id: Math.random().toString(36).substring(2, 9), // Tạo id tạm cho client
    };

    if (!userId) {
      // Guest: lưu vào localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingIndex = guestCart.findIndex((item) => item.name === product.name);
      if (existingIndex !== -1) {
        guestCart[existingIndex].quantity += quantity;
      } else {
        guestCart.push(productData);
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      alert("✅ Đã thêm vào giỏ hàng tạm (chưa đăng nhập)");
      return;
    }

    // Logged in: gửi dữ liệu lên server
    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          productId: productData.id,
        }),
      });
      if (!res.ok) throw new Error("Lỗi khi thêm vào giỏ hàng backend");
      alert("🛒 Đã thêm vào giỏ hàng tài khoản!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Thêm sản phẩm vào giỏ hàng
        </h1>

        <div className="space-y-5">
          {/* Các trường nhập */}
          {["name", "price", "imageUrl", "stock"].map((field, i) => (
            <div key={i}>
              <label className="block mb-1 font-medium">
                {field === "name"
                  ? "Tên sản phẩm"
                  : field === "price"
                  ? "Giá (VND)"
                  : field === "imageUrl"
                  ? "Link hình ảnh"
                  : "Số lượng tồn kho"}
              </label>
              <input
                type={field === "price" || field === "stock" ? "number" : "text"}
                name={field}
                value={product[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </div>
          ))}

          {/* Chọn số lượng */}
          <div>
            <label className="block mb-1 font-medium">Số lượng muốn thêm</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 border rounded hover:bg-gray-100 text-lg"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center border border-gray-300 rounded"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 border rounded hover:bg-gray-100 text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút thêm */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
