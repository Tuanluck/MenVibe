import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Header = ({ cartItems }) => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim()) {
        fetch(
          `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(
            searchTerm
          )}`
        )
          .then((res) => res.json())
          .then((data) => setSuggestions(data))
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSuggestions([]);
      setShowSearch(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm("");
    setSuggestions([]);
    setShowSearch(false);
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

        <div className="flex items-center space-x-6 relative">
          {/* Search with suggestions */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="p-2 hover:text-gray-200 transition duration-300"
              aria-label="Tìm kiếm"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {showSearch && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-3 w-72 z-50">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center mb-2"
                >
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </form>

                {suggestions.length > 0 && (
                  <ul className="max-h-60 overflow-y-auto space-y-1">
                    {suggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSuggestionClick(item.id)}
                        className="px-3 py-1 text-sm cursor-pointer text-gray-800 hover:bg-gray-100 rounded"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}

                {searchTerm && suggestions.length === 0 && (
                  <p className="text-sm text-gray-500 px-2">
                    Không tìm thấy sản phẩm.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative group">
            <ShoppingCartIcon className="h-6 w-6 text-white group-hover:text-gray-300 transition duration-200 ease-in-out" />

            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User */}
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
            <Link to="/login">
              <UserIcon className="h-6 w-6 hover:text-gray-200 transition" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
