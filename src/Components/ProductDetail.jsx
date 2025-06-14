import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProduct(data);
        fetchRelatedProducts(data.category.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (categoryId) => {
      try {
        const res = await fetch(`http://localhost:8080/api/products?categoryId=${categoryId}`);
        const data = await res.json();
        setRelatedProducts(data.filter((p) => p.id !== parseInt(id)));
      } catch (err) {
        console.warn("Related product error:", err.message);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > 0) addToCart({ ...product, quantity });
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
          <div className="h-6 w-80 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center mt-24 text-red-600 text-lg font-semibold">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800">
      <Header cartItems={[]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="rounded-lg shadow-lg overflow-hidden">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600x700'}
            alt={product.name}
            className="w-full h-[500px] object-cover transition duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.19 3.675a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.127 2.272a1 1 0 00-.364 1.118l1.19 3.675c.3.921-.755 1.688-1.538 1.118l-3.127-2.272a1 1 0 00-1.176 0l-3.127 2.272c-.783.57-1.838-.197-1.538-1.118l1.19-3.675a1 1 0 00-.364-1.118L2.49 9.102c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.19-3.675z" />
                </svg>
              ))}
              <span className="text-sm text-gray-500 ml-2">(2,814 đánh giá)</span>
            </div>

            {/* Price */}
            <div className="mb-6 space-y-1">
              <p className="text-gray-500 line-through text-xl">{(product.price * 1.1).toLocaleString()}đ</p>
              <p className="text-3xl font-semibold text-red-600">{product.price.toLocaleString()}đ</p>
              <p className="text-sm text-orange-500 font-medium">-10% giảm giá</p>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={decreaseQty}
                  className="w-10 h-10 text-xl hover:bg-gray-100 transition"
                  aria-label="Giảm số lượng"
                >−</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-14 text-center border-x border-gray-300 outline-none"
                />
                <button
                  onClick={increaseQty}
                  className="w-10 h-10 text-xl hover:bg-gray-100 transition"
                  aria-label="Tăng số lượng"
                >+</button>
              </div>
              <span className="text-sm text-gray-500">Còn {product.stock} sản phẩm</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md shadow transition"
              >
                Mua ngay
              </button>
              <button
                onClick={handleAddToCart}
                className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-md transition"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Review Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">Viết đánh giá của bạn</h2>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md p-4 focus:outline-blue-500 resize-none"
          placeholder="Chia sẻ cảm nhận thật lòng của bạn về sản phẩm này..."
        />
        <button
          onClick={() => alert('Đánh giá đã gửi (demo).')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Gửi đánh giá
        </button>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-semibold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={p.imageUrl || 'https://via.placeholder.com/300'}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-medium">{p.name}</h3>
                  <p className="text-red-600 font-bold">{p.price.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
