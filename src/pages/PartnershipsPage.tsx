import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import groupIcon from '../assets/images/pre/group.svg';
import globeIcon from '../assets/images/admin/globe.svg';
import listingboxIcon from '../assets/images/admin/listingbox.svg';
import users2Icon from '../assets/images/admin/users2.svg';
const partnerTypes = [
  { title: 'Community groups and associations', icon: groupIcon, description: 'Local and diaspora groups that bring people together around shared culture and goals.' },
  { title: 'Cultural organisations', icon: globeIcon, description: 'Organisations that promote African arts, heritage, and cultural exchange.' },
  { title: 'Small businesses', icon: listingboxIcon, description: 'Entrepreneurs and small businesses selling authentic products and services.' },
  { title: 'Diaspora networks', icon: users2Icon, description: 'Networks that connect African diaspora with communities and commerce back home.' },
];

const benefits = [
  { title: 'Visibility', description: 'Reach buyers and sellers who care about authentic African products and community-led trade.' },
  { title: 'Support', description: 'Access to guidance on listing, messaging, and growing your presence on the platform.' },
  { title: 'Trust', description: 'Align with a marketplace built on transparency, safety, and community guidelines.' },
  { title: 'Community', description: 'Join a network of partners working toward the same goals: culture, trade, and entrepreneurship.' },
];

const PartnershipsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero - custom gradient + pattern + dim overlay */}
      <section
        className="relative overflow-hidden py-8 sm:py-10 lg:py-12"
        style={{
          background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)',
          boxShadow: '0 4px 20px rgba(229, 83, 37, 0.2)',
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="absolute inset-0 bg-black/25 z-[1]" aria-hidden />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight animate-fade-in-up animation-delay-100"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Partnerships
          </h1>
          <p className="mt-3 text-white/95 text-lg max-w-2xl animate-fade-in-up animation-delay-200" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We work with communities, associations, and organisations that support African culture, trade, and entrepreneurship.
            <br />
            Together we grow reach, trust, and community-led commerce.
          </p>
        </div>
      </section>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Intro with left accent - brand gradient */}
        <div className="relative pl-5 mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full hidden sm:block" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} />
          <p className="text-[#374151] text-base lg:text-lg leading-relaxed max-w-4xl">
            BaoAfrik is a marketplace where buyers and sellers connect over authentic African products and culture. Partnerships help us extend that reach, strengthen trust, and support entrepreneurs and communities. We are open to working with groups and organisations that share these goals.
          </p>
        </div>

        <h2
          className="text-xl font-bold mb-6 animate-fade-in-up opacity-0"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.2s', animationFillMode: 'forwards', color: '#212121' }}
        >
          We are open to partnerships with:
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          {partnerTypes.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${0.25 + index * 0.08}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)' }}>
                <img src={item.icon} alt="" className="w-4 h-4 opacity-95" aria-hidden style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-[#212121] text-base" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-[#374151] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <h2
          className="text-xl font-bold text-[#212121] mb-6 animate-fade-in-up opacity-0"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          What we offer partners
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${0.65 + index * 0.06}s`,
                animationFillMode: 'forwards',
                background: 'linear-gradient(145deg, #ffffff 0%, #fffbf8 100%)',
                borderColor: 'rgba(229, 83, 37, 0.12)',
              }}
            >
              <h3 className="font-semibold text-sm" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#1f2937' }}>
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[#374151] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <p className="text-[#374151] text-base leading-relaxed max-w-3xl mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          Partnerships help us grow awareness, build trust, and support community-led commerce. If you represent a group or organisation and would like to explore working with BaoAfrik, we would like to hear from you.
        </p>

        {/* CTA - clean card, single accent on button */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto animate-fade-in-up opacity-0 bg-white border border-gray-200 shadow-sm"
          style={{
            animationDelay: '1s',
            animationFillMode: 'forwards',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          }}
        >
          <h3 className="text-lg font-bold text-[#212121] mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Interested in partnering with BaoAfrik?
          </h3>
          <p className="text-[#374151] text-sm mb-6 max-w-md mx-auto">
            Tell us about your organisation and how you would like to work together. We will get back to you as soon as we can.
          </p>
          <Link
            to="/contact-support"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            style={{
              backgroundColor: '#374151',
              boxShadow: '0 2px 8px rgba(55, 65, 81, 0.25)',
            }}
          >
            Become a partner — Contact us
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PartnershipsPage;
