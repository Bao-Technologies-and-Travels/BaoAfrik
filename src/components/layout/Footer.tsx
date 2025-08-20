import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-display font-bold text-xl">BaoAfrik</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting the African diaspora with authentic African products. 
              Discover, buy, and sell authentic goods from across Africa.
            </p>
            <div className="flex space-x-4">
              <span className="text-sm text-gray-400">🇬🇭 🇳🇬 🇰🇪 🇿🇦 🇪🇹</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/listings" className="hover:text-white">Browse Products</a></li>
              <li><a href="/create-listing" className="hover:text-white">Start Selling</a></li>
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/safety" className="hover:text-white">Safety Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BaoAfrik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
