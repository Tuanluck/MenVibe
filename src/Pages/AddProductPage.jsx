import { useState } from 'react';

const AddProductPage = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    imageUrl: '',
    stock: '',
  });

  const [quantity, setQuantity] = useState(1);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex((item) => item.name === product.name);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, price: Number(product.price), stock: Number(product.stock), quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Thêm sản phẩm vào giỏ hàng</h1>

        <div className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Tên sản phẩm</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-blue-500"
              placeholder="Ví dụ: Áo thun unisex"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Giá (VND)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="Ví dụ: 249000"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Link hình ảnh</label>
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Số lượng tồn kho</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="Ví dụ: 10"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Số lượng muốn thêm</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 border rounded hover:bg-gray-100 text-lg"
              >−</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border border-gray-300 rounded"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 border rounded hover:bg-gray-100 text-lg"
              >+</button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition"
          >
            Thêm vào giỏ hàng tạm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
