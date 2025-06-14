import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchByFirstLetter() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");

  // Giả định bạn fetch sản phẩm từ API
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = query.trim().toLowerCase();

    if (keyword.length === 0) {
      setFiltered([]);
      return;
    }

    const result = products.filter((p) =>
      p.name?.toLowerCase().startsWith(keyword[0])
    );

    setFiltered(result);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
      >
        <input
          type="text"
          placeholder="Nhập chữ cái đầu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 outline-none text-gray-800"
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </form>

      {/* Result */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <img
              src={p.imageUrl || "https://via.placeholder.com/150"}
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-sm font-semibold">{p.name}</h3>
            <p className="text-red-600 font-bold">{p.price.toLocaleString()}đ</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && query && (
        <p className="text-center text-gray-500 mt-6">Không có sản phẩm phù hợp.</p>
      )}
    </div>
  );
}
