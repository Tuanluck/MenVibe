const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-serif text-center mb-16 text-gray-800">Browse Our Suits</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-3 rounded-lg border-2 ${
            selectedCategory === null
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:bg-gray-50'
          } transition duration-300 font-medium`}
        >
          All Collections
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-lg border-2 ${
              selectedCategory === category.id
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            } transition duration-300 font-medium`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  </section>
);
export default CategoryFilter;