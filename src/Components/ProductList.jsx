import { useNavigate } from "react-router-dom";

const ProductList = ({ products, loading, addToCart }) => {
  const navigate = useNavigate();

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="relative max-h-[80vh] overflow-y-auto px-4 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="group bg-white relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  onClick={() => navigate(`/product/${product.id}`)}
                  src={product.imageUrl || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
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
                  {product.description || "No description available"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    {typeof product.price === "number"
                      ? product.price.toLocaleString()
                      : "0"}
                    đ
                  </span>
                  <span className="text-xs text-gray-500">Free Tailoring</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 text-xl col-span-full">
            No products found in this collection
          </div>
        )}
      </div>

      {/* Hiệu ứng mờ đáy */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default ProductList;
