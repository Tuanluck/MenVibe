import { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Banner from '../Components/Banner';
import Collections from '../Components/Collections';
import ProductFilter from '../Components/ProductFilter';
import ProductList from '../Components/ProductList';
import TailoringServices from '../Components/TailoringServices';
import Footer from '../Components/Footer';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const banners = [
    { id: 1, title: "Bespoke Tailoring Collection", subtitle: "Craftsmanship Perfected", imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", cta: "Shop Now" },
    { id: 2, title: "Executive Luxury", subtitle: "Elevate Your Professional Wardrobe", imageUrl: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", cta: "Discover" },
    { id: 3, title: "Black Tie Essentials", subtitle: "For Your Most Important Occasions", imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", cta: "Explore" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/categories');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/products/all');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filters) => {
    try {
      setLoading(true);
      // Tạo query string từ filters
      const queryParams = new URLSearchParams();
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
      if (filters.minPrice !== null && filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice !== null && filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.inStock) queryParams.append('inStock', 'true');
      
      const res = await fetch(`http://localhost:8080/api/products/filter?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error filtering products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 bg-black min-h-screen flex flex-col justify-center">
        <p className="text-white">Error loading data: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header cartItems={cartItems} />
      <Banner currentBanner={currentBanner} setCurrentBanner={setCurrentBanner} banners={banners} />
      <Collections />
      
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Product Filter - bên trái */}
        <div className="md:w-1/4 md:pr-4 mb-6 md:mb-0">
          <ProductFilter 
            categories={categories} 
            onSearch={handleSearch}
            onFilter={handleFilter}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onReset={fetchAllProducts}
          />
        </div>
        
        {/* Product List - bên phải */}
        <div className="md:w-3/4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory 
                ? `Products in ${categories.find(c => c.id === selectedCategory)?.name || 'this category'}`
                : 'All Products'}
              <span className="text-sm text-gray-500 ml-2">({products.length} items)</span>
            </h2>
          </div>
          <ProductList products={products} loading={loading} addToCart={addToCart} />
        </div>
      </div>
      
      <TailoringServices />
      <Footer />
    </div>
  );
}