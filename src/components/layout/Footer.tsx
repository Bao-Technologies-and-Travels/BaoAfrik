import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import footerLogo from '../../assets/images/logos/text.png';
import { useContactSupport } from '../../contexts/ContactSupportContext';

const Footer: React.FC = () => {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const { openContactSupport } = useContactSupport();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = () => {
    if (logoRef.current) {
      logoRef.current.style.border = '2px solid white';
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      if (logoRef.current) {
        logoRef.current.style.border = 'none';
      }
    }, 150);
  };

  const handleBlur = () => {
    if (logoRef.current) {
      logoRef.current.style.border = 'none';
    }
  };

  return (
    <footer className="bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <div className="mb-6">
              <Link 
                ref={logoRef}
                to="/" 
                onClick={scrollToTop}
                className="inline-block focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded cursor-pointer"
                style={{ 
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onBlur={handleBlur}
              >
                <img 
                  src={footerLogo} 
                  alt="BaoAfrik - African Marketplace Logo" 
                  className="h-8 mb-4 mx-auto md:mx-0"
                />
              </Link>
              <p className="text-sm leading-relaxed" style={{ color: '#BABABA' }}>
                Bringing home closer to Africans abroad.
              </p>
            </div>
          </div>

          {/* Marketplace */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>Marketplace</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
              <li><Link to="/category/food-spices" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Food & Spices</Link></li>
              <li><Link to="/category/fashion-textiles" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Fashion & Textiles</Link></li>
              <li><Link to="/category/beauty-wellness" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Beauty & Wellness</Link></li>
              <li><Link to="/category/home-decor" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Home & Decor</Link></li>
              <li><Link to="/category/books-media" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Books & Media</Link></li>
            </ul>
          </div>

          {/* About BaoAfrik */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>About BaoAfrik</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
              <li><Link to="/our-story" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Our Story</Link></li>
              <li><Link to="/how-it-works" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">How It Works</Link></li>
              <li><Link to="/partnerships" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Partnerships</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>Support</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
              <li><Link to="/help-centre" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Help Centre</Link></li>
              <li><Link to="/safety-trust" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Safety & Trust</Link></li>
              <li>
              <button
                type="button"
                onClick={openContactSupport}
                className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors bg-transparent border-none p-0 cursor-pointer text-sm text-left w-full"
                style={{ color: 'inherit', fontFamily: 'inherit' }}
              >
                Contact Support
              </button>
            </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4" style={{ color: '#212121' }}>Legal</h3>
            <ul className="space-y-3 text-sm" style={{ color: '#BABABA' }}>
              <li><Link to="/terms" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Cookie Policy</Link></li>
              <li><Link to="/community-guidelines" className="hover:text-gray-900 focus:outline-none focus:text-orange-600 focus:underline transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-end items-center text-center md:text-right">
          <div className="text-sm" style={{ color: '#BABABA' }}>
            © 2026 All rights reserved - Baoafrik
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
