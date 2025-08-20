import React from 'react';
import { Link } from 'react-router-dom';
import footerLogo from '../../assets/images/logos/text.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <img 
                src={footerLogo} 
                alt="bao Afrik" 
                className="h-8 mb-4"
              />
              <p className="text-gray-600 text-sm leading-relaxed">
                Come to the meeting of African treasures
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Products</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/category/food-spices" className="hover:text-gray-900">Food & Spices</Link></li>
              <li><Link to="/category/fashion-textiles" className="hover:text-gray-900">Fashion & Textiles</Link></li>
              <li><Link to="/category/beauty-wellness" className="hover:text-gray-900">Beauty & Wellness</Link></li>
              <li><Link to="/category/home-decor" className="hover:text-gray-900">Home & Decor</Link></li>
              <li><Link to="/category/books-media" className="hover:text-gray-900">Books & Media</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About Us</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/contact" className="hover:text-gray-900">Contact us</Link></li>
              <li><Link to="/about" className="hover:text-gray-900">Bao Technologies</Link></li>
              <li><Link to="/network" className="hover:text-gray-900">Our network</Link></li>
              <li><Link to="/partnership" className="hover:text-gray-900">Partnership</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/help" className="hover:text-gray-900">Help center</Link></li>
              <li><Link to="/blog" className="hover:text-gray-900">Blog</Link></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Get in touch</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>Questions or feedback?</li>
              <li>We'd love to hear from you</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            <Link to="/terms" className="hover:text-gray-700 mr-6">Terms of use and privacy policies</Link>
          </div>
          <div className="text-sm text-gray-500">
            © All rights reserved - Bao Technologies and travels
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
