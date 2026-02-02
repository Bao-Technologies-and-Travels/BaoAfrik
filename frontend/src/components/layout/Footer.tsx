import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import footerLogo from '../../assets/images/logos/text.png';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <div className="mb-6">
              <img
                src={footerLogo}
                alt="BaoAfrik - African Marketplace Logo"
                className="h-8 mb-4 mx-auto md:mx-0 cursor-pointer"
                onClick={() => {
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
              <p className="text-sm leading-relaxed" style={{ color: '#BABABA' }}>
              Bringing home closer to Africans abroad
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>Marketplace</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
              <li><Link to="/?category=Food%20%26%20Spices" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Food & Spices</Link></li>
              <li><Link to="/?category=Fashion%20%26%20Textiles" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Fashion & Textiles</Link></li>
              <li><Link to="/?category=Beauty%20%26%20Wellness" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Beauty & Wellness</Link></li>
              <li><Link to="/?category=Home%20%26%20Decor" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Home & Decor</Link></li>
              <li><Link to="/?category=Books%20%26%20Media" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Books & Media</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>About BaoAfrik</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
              <li><Link to="/our-story" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Our Story</Link></li>
              <li><Link to="/how-it-works" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">How It Works</Link></li>
              <li><Link to="/partnerships" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Partnerships</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>Support</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
              <li><Link to="/help-center" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Help center</Link></li>
              <li><Link to="/safety-trust" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Safety & Trust</Link></li>
              <li><Link to="/contact-support" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>Legal</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
            <li><Link to="/terms" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Terms Of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Cookie Policy</Link></li>
              <li><Link to="/community-guidelines" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center text-center md:text-left">
          <div className="text-sm" style={{ color: '#BABABA' }}>
            © {new Date().getFullYear()} BaoAfrik. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
