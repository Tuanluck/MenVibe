import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Format birth date if it exists
  const formattedBirthDate = user.birthDate 
    ? new Date(user.birthDate).toLocaleDateString('vi-VN') 
    : "Chưa có thông tin";

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header cartItems={[]} />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-white">
              Hồ Sơ Người Dùng
            </h2>
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
              {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Họ</p>
              <p className="text-lg font-medium text-white">
                {user.firstName || <span className="text-gray-400">Chưa có thông tin</span>}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Tên</p>
              <p className="text-lg font-medium text-white">
                {user.lastName || <span className="text-gray-400">Chưa có thông tin</span>}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-lg font-medium text-white">
                {user.email || <span className="text-gray-400">Chưa có thông tin</span>}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Số điện thoại</p>
              <p className="text-lg font-medium text-white">
                {user.phone || <span className="text-gray-400">Chưa có thông tin</span>}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Ngày sinh</p>
              <p className="text-lg font-medium text-white">
                {formattedBirthDate || <span className="text-gray-400">Chưa có thông tin</span>}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Giới tính</p>
              <p className="text-lg font-medium text-white">
                {user.gender || <span className="text-gray-400">Chưa có thông tin</span>}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200">
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}