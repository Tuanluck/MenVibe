import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Header = ({ cartItems }) => {
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin user
    window.location.reload(); // Tải lại trang để cập nhật giao diện
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-3xl font-serif tracking-widest hover:scale-105 transition-transform duration-300">
          <span className="text-white">ELEGANCE</span>
          <span className="text-gray-300">SUITS</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          {[
            { name: "Home", path: "/" },
            { name: "Collections", path: "#Collections" },
            { name: "Tailoring", path: "/tailoring" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:text-gray-200 transition duration-300 font-medium text-lg"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-6">
          <button className="p-2 hover:text-gray-200 transition duration-300">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
          <button className="p-2 hover:text-gray-200 transition duration-300 relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>
          {user ? (
            <div className="relative group">
              <button className="p-2 flex items-center space-x-2 text-gray-200 hover:text-white transition duration-300">
                <span className="text-sm font-medium">{user.firstName}</span>
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-black">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Hồ sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/Login">
              <button className="p-2 hover:text-gray-200 transition duration-300">
                <UserIcon className="h-6 w-6" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;