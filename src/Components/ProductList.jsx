import { useNavigate } from 'react-router-dom'; // ✅ THÊM import này

const ProductList = ({ products, loading, addToCart }) => {
  const navigate = useNavigate(); // ✅ THÊM useNavigate()

  // Kiểm tra loading và hiển thị spinner
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  // Render danh sách sản phẩm
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 pb-20">
      {products && products.length > 0 ? (
        products.map((product) => {
          // Kiểm tra dữ liệu sản phẩm có hợp lệ không
          if (!product || !product.id || !product.name || !product.price) {
            console.warn('Product data is incomplete:', product);
            return null; // Bỏ qua sản phẩm không hợp lệ
          }

          return (
            <div
              key={product.id}
              className="group bg-white relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  onClick={() => navigate(`/product/${product.id}`)} // ✅ THÊM chức năng click để điều hướng
                  src={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" // ✅ THÊM cursor-pointer
                />
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 right-4 bg-black text-white px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-800"
                >
                  Add to Cart
                </button>
              </div>
              <div className="p-4 border-t border-gray-200">
                <h3 className="font-serif text-xl mb-2 group-hover:text-gray-800 transition duration-300">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    {typeof product.price === 'number' ? product.price.toLocaleString() : '0'}đ
                  </span>
                  <span className="text-xs text-gray-500">Free Tailoring</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-20 text-gray-500 text-xl">No products found in this collection</div>
      )}
    </div>
  );
};

export default ProductList;
