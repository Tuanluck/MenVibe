const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-serif text-2xl mb-4">ELEGANCE SUITS</h3>
          <p className="text-gray-400">
            Crafting premium men's suits since 1985. Timeless elegance for the modern gentleman.
          </p>
        </div>
        <div>
          <h4 className="font-serif mb-4">Shop</h4>
          <ul className="space-y-2 text-gray-400">
            {['New Arrivals', 'Best Sellers', 'Tailoring Services', 'Accessories'].map((item) => (
              <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-serif mb-4">Information</h4>
          <ul className="space-y-2 text-gray-400">
            {['About Us', 'Size Guide', 'Fabric Care', 'Privacy Policy'].map((item) => (
              <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-serif mb-4">Contact</h4>
          <address className="not-italic text-gray-400">
            <p>123 Tailor Street</p>
            <p>Fashion District, 10001</p>
            <p>New York, USA</p>
            <p className="mt-2">info@elegancesuits.com</p>
            <p>+1 (212) 555-0182</p>
          </address>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Elegance Suits. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
export default Footer;