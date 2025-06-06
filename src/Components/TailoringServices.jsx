const TailoringServices = () => (
  <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-serif mb-6">Bespoke Tailoring Services</h2>
          <p className="mb-8 text-gray-300">
            Experience the art of custom tailoring with our master craftsmen. Each suit is meticulously handcrafted to your exact measurements and style preferences.
          </p>
          <button className="border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition duration-300 font-medium">
            Book a Consultation
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Tailoring service"
            className="w-full h-auto rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
);
export default TailoringServices;