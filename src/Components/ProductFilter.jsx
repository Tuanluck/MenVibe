import { useState, useEffect } from 'react';
import { FiSearch, FiX, FiFilter, FiDollarSign, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProductFilter = ({ 
  categories, 
  onFilter, 
  onSearch,
  onReset,
  selectedCategory,
  setSelectedCategory 
}) => {
  const [keyword, setKeyword] = useState('');
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });
  const [inStock, setInStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    category: true,
    price: true,
    status: true
  });

  useEffect(() => {
    if (keyword.trim().length > 1) {
      const mockSuggestions = [
        `Áo ${keyword}`,
        `Quần ${keyword}`,
        `Váy ${keyword}`,
        `Phụ kiện ${keyword}`
      ];
      setSearchSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [keyword]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleFilter = () => {
    const filters = {
      categoryId: selectedCategory,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : null,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : null,
      inStock: inStock || null
    };
    onFilter(filters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setKeyword('');
    setPriceRange({ min: '', max: '' });
    setInStock(false);
    setSelectedCategory(null);
    onReset();
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center justify-center"
        >
          <FiFilter size={24} />
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block fixed inset-0 md:static z-10 md:z-auto bg-black bg-opacity-50 md:bg-transparent`}>
        <div 
          className={`w-4/5 md:w-80 bg-white h-full p-6 shadow-xl md:shadow-md transform transition-all duration-300 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Bộ lọc</h2>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          {/* Search Section */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('search')}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tìm kiếm</h3>
              {expandedSections.search ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSections.search && (
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bg-black text-white p-1 rounded-md hover:bg-gray-800 transition"
                  >
                    <FiSearch size={16} />
                  </button>
                </form>
                
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-gray-100 cursor-pointer transition"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center">
                          <FiSearch className="mr-2 text-gray-400" />
                          <span>{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('category')}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Danh mục</h3>
              {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSections.category && (
              <div className="space-y-2">
                <button
                  className={`w-full text-left p-3 rounded-lg ${!selectedCategory ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Tất cả danh mục
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left p-3 rounded-lg ${selectedCategory === category.id ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('price')}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Mức giá</h3>
              {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiDollarSign className="text-gray-400" />
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Từ"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      min="0"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Đến"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      min="0"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Để trống nếu không muốn giới hạn
                </div>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('status')}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tình trạng</h3>
              {expandedSections.status ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSections.status && (
              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${inStock ? 'bg-black border-black' : 'border-gray-300'}`}>
                  {inStock && <FiCheckCircle className="text-white" size={16} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span className="text-gray-700">Chỉ hiển thị còn hàng</span>
              </label>
            )}
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2">
            <div className="flex space-x-4">
              <button
                onClick={resetFilters}
                className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition font-medium border border-gray-300"
              >
                Đặt lại
              </button>
              <button
                onClick={handleFilter}
                className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition font-medium"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;