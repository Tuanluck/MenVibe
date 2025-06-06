import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Đăng nhập thất bại");
      }

      const data = await response.json();
      // Lưu toàn bộ thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(data));
      alert(`Đăng nhập thành công! Xin chào ${data.firstName}`);
      navigate("/");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <>
      <Header cartItems={[]} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md px-10 py-12 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-normal text-gray-900 mb-3 tracking-tight">
              ĐĂNG NHẬP
            </h2>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto"></div>
          </div>
          <div className="mb-7">
            <label
              htmlFor="email"
              className="block text-xs font-normal tracking-wide text-gray-600 mb-2"
            >
              EMAIL
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none transition duration-300 text-gray-800 placeholder-gray-400 text-sm"
              />
            </div>
          </div>
          <div className="mb-10">
            <label
              htmlFor="password"
              className="block text-xs font-normal tracking-wide text-gray-600 mb-2"
            >
              MẬT KHẨU
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none transition duration-300 text-gray-800 placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-black rounded-xl text-white hover:bg-gray-800 transition duration-300 uppercase text-xs tracking-widest font-medium"
          >
            Đăng Nhập
          </button>
          <div className="mt-8 text-center">
            <a
              href="./forgot-password"
              className="text-xs text-gray-500 hover:text-black transition duration-200 tracking-wide"
            >
              QUÊN MẬT KHẨU?
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 tracking-wide">
              CHƯA CÓ TÀI KHOẢN?{" "}
              <a
                href="./register"
                className="text-black hover:underline transition duration-200"
              >
                ĐĂNG KÝ NGAY
              </a>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}