import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      }
      
      /// Không tự đăng nhập, chỉ thông báo và điều hướng đến login
      alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Header cartItems={[]} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <div className="md:flex">
            {/* Sidebar Left */}
            <div className="hidden md:block md:w-1/3 bg-black rounded-l-xl p-10 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-light tracking-wider mb-4">
                    TRỞ THÀNH THÀNH VIÊN
                  </h2>
                  <div className="w-16 h-0.5 bg-gray-400 mb-6"></div>
                  <p className="text-gray-300 text-sm tracking-wide leading-relaxed">
                    Tham gia cùng chúng tôi để trải nghiệm những dịch vụ cao cấp
                    và độc quyền
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs tracking-wider mb-2">
                    ĐÃ CÓ TÀI KHOẢN?
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="flex items-center text-white text-sm tracking-wider hover:underline transition duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    ĐĂNG NHẬP NGAY
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-full md:w-2/3 p-8 md:p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-normal text-gray-900 tracking-wider mb-3">
                  ĐĂNG KÝ
                </h2>
                <div className="w-20 h-0.5 bg-gray-300 mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "HỌ", name: "firstName", placeholder: "Nhập họ của bạn" },
                  { label: "TÊN", name: "lastName", placeholder: "Nhập tên của bạn" },
                ].map(({ label, name, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none text-sm"
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">MẬT KHẨU</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2"
                      aria-label="Toggle Password"
                    >
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411L21 21" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">ĐIỆN THOẠI</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none text-sm"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">NGÀY SINH</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">GIỚI TÍNH</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-3 border-b border-gray-300 focus:border-black bg-transparent outline-none text-sm"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-10 py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition duration-300 uppercase text-xs tracking-widest font-medium"
              >
                Đăng Ký
              </button>

              <div className="mt-8 text-center md:hidden">
                <p className="text-xs text-gray-600 tracking-wider">
                  ĐÃ CÓ TÀI KHOẢN?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-black hover:underline"
                  >
                    ĐĂNG NHẬP NGAY
                  </button>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
