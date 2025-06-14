import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { getUser, getToken } from "../utils/auth"; // dùng hàm tiện ích

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser());
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = getToken();
  const userId = user?.id;

  useEffect(() => {
    if (!token || !userId) {
      setError("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/auth/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được dữ liệu người dùng.");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data)); // cập nhật lại user trong localStorage
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          birthDate: data.birthDate?.split("T")[0] || "",
          gender: data.gender || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8080/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại.");
      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data)); // cập nhật lại sau khi chỉnh sửa
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="loader h-16 w-16" />
      </div>
    );

  if (error)
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

  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header cartItems={[]} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-white">
              Hồ Sơ Người Dùng
            </h2>
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleSave} className="space-y-6">
              {["firstName", "lastName", "email", "phone", "birthDate", "gender"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-400 uppercase text-xs mb-1">
                    {field === "birthDate"
                      ? "Ngày sinh"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "gender" ? (
                    <select
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                  ) : (
                    <input
                      type={
                        field === "birthDate"
                          ? "date"
                          : field === "email"
                          ? "email"
                          : "text"
                      }
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                      required
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  {saving ? "Đang lưu..." : "Lưu hồ sơ"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Họ", val: user.firstName },
                  { label: "Tên", val: user.lastName },
                  { label: "Email", val: user.email },
                  { label: "Số điện thoại", val: user.phone },
                  {
                    label: "Ngày sinh",
                    val: user.birthDate
                      ? new Date(user.birthDate).toLocaleDateString("vi-VN")
                      : "Chưa có thông tin",
                  },
                  {
                    label: "Giới tính",
                    val: user.gender || "Chưa có thông tin",
                  },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">{label}</p>
                    <p className="text-lg text-white">{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  Chỉnh sửa hồ sơ
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
