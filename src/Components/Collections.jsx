import custum from '../css/custum.css'
const Collections = () => {
  const collections = [
    { name: "Business Attire", image: "../img/Attire.jpg" },
    { name: "Evening Wear", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
    { name: "Accessories", image: "../img/clock.jpg" },
  ];

  return (
    <section className="Featured py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-center mb-16 text-gray-800">Our Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {collections.map((collection, index) => (
            <div key={index} className="group relative overflow-hidden h-80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="Collections absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <h3 className="text-white text-2xl font-serif tracking-wider group-hover:text-orange-300 transition duration-300">
                  {collection.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Collections;