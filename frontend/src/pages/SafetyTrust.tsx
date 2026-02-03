import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import tickIcon from '../assets/images/pre/tick.svg';

const SafetyTrust: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const practices = [
    {
      title: 'Communicate clearly and respectfully',
      description: 'Use our messaging system to discuss items, prices, and delivery arrangements directly with the other user. Be honest and courteous so both parties have a smooth, trustworthy experience.',
    },
    {
    title: 'Verify product details before agreeing to a transaction',
      description: 'Ask for clear photos, descriptions, and condition details. Confirm price, quantity, and any other terms before you commit to a deal. Note that BaoAfrik does not verify listings, so sellers are responsible for compliance.',
    },
    {
      title: 'Arrange exchanges safely',
      description: 'Agree on how payment and delivery will be handled between you and the other user in advance. Meet in safe, public places when possible, and keep records of your arrangements. BaoAfrik does not handle the money or the shipping.',
    },
    {
      title: 'Report suspicious or inappropriate behaviour',
      description: 'If you see listings or messages that break our rules or seem unsafe, report them so we can help keep the community secure.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero - same style as Community Guidelines / Contact Support */}
      <section
        className="relative overflow-hidden py-8 sm:py-10 lg:py-12"
        style={{
          background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)',
          boxShadow: '0 4px 20px rgba(229, 83, 37, 0.2)',
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight animate-fade-in-up animation-delay-100"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Safety & Trust
          </h1>
          <p className="mt-3 text-white/95 text-lg max-w-4xl mx-auto animate-fade-in-up animation-delay-200" style={{ fontFamily: "'Poppins', sans-serif" }}>
            BaoAfrik is built on trust, transparency, and community responsibility.
            <br />
            Here’s how we work together to keep the marketplace safe for everyone.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div style={{ fontFamily: "'Poppins', sans-serif", color: '#6A6A6A' }} className="space-y-10 text-base leading-relaxed">
          {/* Intro with left accent */}
          <div className="relative pl-5 animate-fade-in-up animation-delay-200">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full hidden sm:block" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} />
            <p className="text-lg max-w-4xl" style={{ color: '#6A6A6A' }}>
              A safe marketplace depends on everyone playing their part. We encourage all users to follow the practices below so that buying and selling on BaoAfrik remains positive and secure.
            </p>
          </div>

          <h2 className="font-bold text-[#212121] animate-fade-in-up animation-delay-300 text-xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            We encourage all users to:
          </h2>

          <ul className="list-none space-y-6 pl-0 max-w-5xl">
            {practices.map((item, index) => (
              <li
                key={index}
                className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.35 + index * 0.1}s`, animationFillMode: 'forwards', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)' }}>
                  <img src={tickIcon} alt="" className="w-4 h-4 opacity-95" aria-hidden style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <div>
                  <p className="font-medium text-[#212121]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{item.title}</p>
                  <p className="mt-1 text-[#6A6A6A] text-sm leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Gradient divider */}
          <div className="max-w-5xl h-px rounded-full opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #E55325, #F9A825, transparent)' }} />

          {/* Important notice - centred */}
          <div className="flex justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.85s', animationFillMode: 'forwards' }}>
            <div
              className="w-full max-w-6xl p-4 sm:p-5 rounded-2xl relative overflow-hidden text-center"
              style={{
                background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                boxShadow: '0 4px 20px rgba(229, 83, 37, 0.08), 0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1.5 rounded-r-2xl" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} />
              <h2 className="text-lg font-bold mb-2 text-[#212121] relative" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Important notice
              </h2>
              <p className="text-[#6A6A6A] text-sm leading-snug mb-2 relative">
                BaoAfrik does not verify users and does not guarantee transactions. We are a peer-to-peer marketplace that connects buyers and sellers; we are not responsible for product quality, delivery arrangements or payments agreed between users.
              </p>
              <p className="text-[#6A6A6A] text-sm leading-snug relative">
                By using BaoAfrik, you agree to take responsibility for your own transactions and to follow our{' '}
                <Link to="/community-guidelines" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>
                  Community Guidelines
                </Link>
                {' '}and{' '}
                <Link to="/terms" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>
                  Terms of Use
                </Link>
                . For more information, visit our{' '}
                <Link to="/help-centre" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>
                  Help Centre
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyTrust;
