import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import searchNormalIcon from '../assets/images/pre/search-normal.svg';
import sendIcon from '../assets/images/admin/send.svg';
import requestIcon from '../assets/images/admin/requesticon.svg';
import perfomanceIcon from '../assets/images/admin/perfomance.svg';
import cultureImg from '../assets/images/logos/culture.png';
import decorImg from '../assets/images/logos/decor.png';

const steps = [
  {
    icon: searchNormalIcon,
    title: 'Browse or search',
    description: 'Use search and filters to find products by category, origin, and location.',
  },
  {
    icon: sendIcon,
    title: 'Message the seller',
    description: 'Contact sellers directly on BaoAfrik to ask questions and confirm availability.',
  },
  {
    icon: perfomanceIcon,
    title: 'Agree the details',
    description: 'Buyers and sellers agree on price, pickup location, and delivery (if needed) directly in chat.',
  },
  {
    icon: requestIcon,
    title: "Make a request if you can't find it",
    description: 'Post a request so sellers who have the item can message you.',
  },
];

const HowItWorks: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-8 sm:py-10 lg:py-12"
        style={{
          background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)',
          boxShadow: '0 4px 20px rgba(229, 83, 37, 0.2)',
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight animate-fade-in-up animation-delay-100"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How It Works
          </h1>
          <p className="mt-3 text-white/95 text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-200" style={{ fontFamily: "'Poppins', sans-serif" }}>
            BaoAfrik is a peer-to-peer marketplace where buyers and sellers connect directly over authentic African products.
          </p>
        </div>
      </section>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Steps Section */}
        <section className="mb-16">
          <h2
            className="text-xl font-bold text-[#212121] mb-8 animate-fade-in-up opacity-0"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            Here's how it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up opacity-0 w-full"
                style={{
                  animationDelay: `${0.15 + index * 0.08}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-200">
                  <img src={step.icon} alt="" className="w-5 h-5 opacity-90" aria-hidden style={{ filter: 'brightness(0) opacity(0.7)' }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#212121] text-base" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-1.5 text-sm text-[#4b5563] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Note - Full Width */}
        <section 
          className="mb-16 animate-fade-in-up opacity-0 -mx-4 sm:-mx-6 lg:-mx-8 px-0"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}
        >
          <div
            className="relative p-6 sm:p-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fffbf8 0%, #fff9f0 100%)',
              borderTop: '1px solid rgba(249, 168, 34, 0.25)',
              borderBottom: '1px solid rgba(249, 168, 34, 0.25)',
              boxShadow: '0 2px 12px rgba(249, 168, 34, 0.08)',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} aria-hidden />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pl-4">
                <h3
                  className="text-lg font-bold text-[#212121] mb-2"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Important note
                </h3>
                <p className="text-[#4b5563] text-base leading-relaxed">
                  BaoAfrik is a community marketplace. We do not handle payments or delivery. Transactions are agreed directly between users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What we provide + Image */}
        <section className="mb-16">
          <h2
            className="text-xl font-bold text-[#212121] mb-6 animate-fade-in-up opacity-0"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.55s', animationFillMode: 'forwards' }}
          >
            What we provide
          </h2>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <img src={cultureImg} alt="BaoAfrik connects communities" className="w-full h-56 sm:h-64 object-cover object-center" />
                <p className="p-3 text-center text-sm text-[#4b5563] bg-gray-50">
                  Connecting communities through authentic African products.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.65s', animationFillMode: 'forwards' }}>
              <p className="text-[#4b5563] text-base leading-relaxed mb-4">
                BaoAfrik provides a digital space where you can discover products, post requests, and connect with other users. We focus on building a trusted community for buying and selling authentic African goods.
              </p>
              <p className="text-[#4b5563] text-base leading-relaxed">
                All payments and delivery arrangements are made directly between buyer and seller. We encourage everyone to communicate clearly and follow our{' '}
                <Link to="/safety-trust" className="text-[#E55325] hover:underline font-medium">Safety &amp; Trust</Link> and{' '}
                <Link to="/community-guidelines" className="text-[#E55325] hover:underline font-medium">Community Guidelines</Link>{' '}
                to keep the marketplace safe and positive.
              </p>
            </div>
          </div>
        </section>

        {/* Your responsibility + Image */}
        <section>
          <h2
            className="text-xl font-bold text-[#212121] mb-6 animate-fade-in-up opacity-0"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.7s', animationFillMode: 'forwards' }}
          >
            Your responsibility
          </h2>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 animate-fade-in-up opacity-0" style={{ animationDelay: '0.75s', animationFillMode: 'forwards' }}>
              <p className="text-[#4b5563] text-base leading-relaxed mb-4">
                When you buy or sell on BaoAfrik, you are dealing directly with another person. You agree on price, payment method, and delivery between yourselves. We recommend keeping records of your arrangements and communicating through the platform.
              </p>
              <p className="text-[#4b5563] text-base leading-relaxed">
                Whether you're listing spices, cultural crafts, or other African products, you're part of a peer-to-peer community. BaoAfrik provides the place to connect; the rest is up to you and your counterpart.
              </p>
            </div>
            <div className="lg:col-span-5 animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <img src={decorImg} alt="African crafts and artisan products" className="w-full h-56 sm:h-64 object-cover object-center" />
                <p className="p-3 text-center text-sm text-[#4b5563] bg-gray-50">
                  African crafts, decor, and artisan products—traded directly between users.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
