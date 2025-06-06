import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Banner = ({ currentBanner, setCurrentBanner, banners }) => {
  return (
    <div className="relative h-96 md:h-[80vh] max-h-[80vh] overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 md:px-12">
            <div className="text-white max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-serif mb-6 animate-fadeIn">{banner.title}</h1>
              <p className="text-xl md:text-2xl mb-8 font-light tracking-wider animate-fadeIn delay-100">{banner.subtitle}</p>
              <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition duration-300 animate-fadeIn delay-200">
                {banner.cta}
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-scroll bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-40 transition duration-300"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-scroll bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-40 transition duration-300"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`h-2 w-10 rounded-full ${index === currentBanner ? 'bg-white' : 'bg-gray-400'} transition-all duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
export default Banner;