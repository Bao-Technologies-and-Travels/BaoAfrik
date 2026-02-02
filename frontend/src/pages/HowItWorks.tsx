import React, { useEffect } from 'react';
import userIcon from '../assets/images/admin/user.svg';
import listingboxIcon from '../assets/images/admin/listingbox.svg';
import requestIcon from '../assets/images/admin/requesticon.svg';
import sendIcon from '../assets/images/admin/send.svg';
import perfomanceIcon from '../assets/images/admin/perfomance.svg';
import warningIcon from '../assets/images/admin/warning.svg';
import cultureImg from '../assets/images/logos/culture.png';
import decorImg from '../assets/images/logos/decor.png';

const steps = [
  {
    icon: userIcon,
    title: 'Create an account and complete your profile',
    description: 'Sign up with your email or social account, then add a profile photo and a short bio. A complete profile helps other users trust you and makes it easier to connect over shared interests in African products and culture.',
  },
  {
    icon: listingboxIcon,
    title: 'List products you have available',
    description: 'Any user can create listings for items they want to sell or offer—whether that’s spices, crafts, textiles, or other authentic products. Add clear photos and descriptions so buyers know exactly what you’re offering.',
  },
  {
    icon: requestIcon,
    title: 'Browse listings or post requests',
    description: 'Look through existing listings to find what you need, or post a request describing the item you’re looking for. Sellers and buyers can find each other through both listings and requests.',
  },
  {
    icon: sendIcon,
    title: 'Contact each other through the platform',
    description: 'Use BaoAfrik’s messaging system to ask questions, negotiate prices, and agree on details. Keeping conversations on the platform helps protect both parties and keeps a record of your agreement.',
  },
  {
    icon: perfomanceIcon,
    title: 'Agree on payment and delivery between you',
    description: 'Payments and delivery are arranged directly between buyer and seller. You decide together how to pay (e.g. bank transfer, cash on delivery) and how items will be sent or collected. BaoAfrik does not handle the money or the shipping.',
  },
];

const doesNot = [
  {
    icon: warningIcon,
    text: 'Process payments',
    detail: 'We do not hold or transfer money. All payment arrangements are made and carried out by users.',
  },
  {
    icon: warningIcon,
    text: 'Deliver products',
    detail: 'We do not ship or deliver items. Delivery is agreed and organised between buyer and seller.',
  },
  {
    icon: warningIcon,
    text: 'Act as a buyer or seller',
    detail: 'BaoAfrik is only the platform. Every transaction is between the users who list, buy, or request.',
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
        {/* Intro */}
        <div className="relative pl-5 mb-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full hidden sm:block" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} />
          <p className="text-[#374151] text-base lg:text-lg leading-relaxed max-w-4xl">
            On BaoAfrik, people list items they have, post requests for what they want, and message each other to agree on price and delivery. The platform connects you; the rest is between you and the other user. Here’s how it works step by step.
          </p>
        </div>

        {/* Section: Here's how it works — 5 steps, side by side (left and right) */}
        <section className="mb-16">
          <h2
            className="text-xl font-bold text-[#212121] mb-8 animate-fade-in-up opacity-0"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.15s', animationFillMode: 'forwards' }}
          >
            Here’s how it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up opacity-0 ${index === 4 ? 'sm:col-span-2 sm:max-w-xl sm:mx-auto sm:w-full' : ''}`}
                style={{
                  animationDelay: `${0.2 + index * 0.07}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-200">
                  <img src={step.icon} alt="" className="w-5 h-5 opacity-90" aria-hidden style={{ filter: 'brightness(0) opacity(0.7)' }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#212121] text-sm sm:text-base" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-1 text-sm text-[#374151] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: BaoAfrik does not + image */}
        <section className="mb-16">
          <h2
            className="text-xl font-bold text-[#212121] mb-8 animate-fade-in-up opacity-0"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            BaoAfrik does not
          </h2>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-5 order-2 lg:order-1 animate-fade-in-up opacity-0" style={{ animationDelay: '0.65s', animationFillMode: 'forwards' }}>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <img src={cultureImg} alt="We connect communities—payments and delivery stay between you and the other user" className="w-full h-56 sm:h-64 object-cover object-center" />
                <p className="p-3 text-center text-sm text-[#374151] bg-gray-50">
                  We connect communities; payments and delivery stay between you and the other user.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              {doesNot.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${0.7 + index * 0.08}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="shrink-0 flex items-center justify-center">
                    <img src={item.icon} alt="" className="w-5 h-5" aria-hidden style={{ filter: 'brightness(0) opacity(0.65)' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212121] text-sm" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                      {item.text}
                    </p>
                    <p className="mt-0.5 text-sm text-[#374151] leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Your responsibility + image */}
        <section>
          <h2
            className="text-xl font-bold text-[#212121] mb-6 animate-fade-in-up opacity-0"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.88s', animationFillMode: 'forwards' }}
          >
            Your responsibility
          </h2>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 animate-fade-in-up opacity-0" style={{ animationDelay: '0.92s', animationFillMode: 'forwards' }}>
              <p className="text-[#374151] text-base leading-relaxed mb-4">
                All transactions and agreements are the responsibility of the users involved. When you buy or sell on BaoAfrik, you are dealing directly with another person: you agree on price, payment method, and delivery. We recommend communicating clearly, keeping records of your arrangements, and following our <a href="/safety-trust" className="text-[#E55325] hover:underline font-medium">Safety & Trust</a> and <a href="/community-guidelines" className="text-[#E55325] hover:underline font-medium">Community Guidelines</a> so the marketplace stays safe and positive for everyone.
              </p>
              <p className="text-[#374151] text-base leading-relaxed">
                Whether you’re listing spices, cultural crafts, or other African products, you’re part of a peer-to-peer community. BaoAfrik provides the place to connect; the rest is up to you and your counterpart.
              </p>
            </div>
            <div className="lg:col-span-5 animate-fade-in-up opacity-0" style={{ animationDelay: '0.96s', animationFillMode: 'forwards' }}>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <img src={decorImg} alt="African crafts and artisan products" className="w-full h-56 sm:h-64 object-cover object-center" />
                <p className="p-3 text-center text-sm text-[#374151] bg-gray-50">
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
