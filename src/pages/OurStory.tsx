import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import globeIcon from '../assets/images/admin/globe.svg';
import groupIcon from '../assets/images/pre/group.svg';
import listingboxIcon from '../assets/images/admin/listingbox.svg';
import requestIcon from '../assets/images/admin/requesticon.svg';
import sendIcon from '../assets/images/admin/send.svg';
import cultureImg from '../assets/images/logos/culture.png';
import decorImg from '../assets/images/logos/decor.png';

const whatYouCanDo = [
  { icon: globeIcon, title: 'Discover', description: 'Browse listings for authentic African products—from spices and crafts to fashion and home goods.' },
  { icon: listingboxIcon, title: 'List', description: 'Sell or offer items you have. Add clear photos and descriptions so buyers can find you.' },
  { icon: requestIcon, title: 'Request', description: 'Post what you’re looking for. Sellers and travellers can respond when they have it.' },
  { icon: sendIcon, title: 'Connect', description: 'Message directly on the platform to agree on price, payment, and delivery.' },
];

const whoItsFor = [
  { icon: globeIcon, title: 'The diaspora', description: 'Africans living abroad who want easier access to authentic products from home.' },
  { icon: listingboxIcon, title: 'Sellers & travellers', description: 'Travellers and small sellers who have products to offer but need a trusted place to reach buyers.' },
  { icon: groupIcon, title: 'Community-minded', description: 'Anyone who values community-led trade and wants to support small businesses and culture.' },
];

const howWereDifferent = [
  'Peer-to-peer — you deal directly with another person, not with us.',
  'We don’t hold stock or process payments; we only provide the platform.',
  'Community-first — we focus on trust, transparency, and clear guidelines.',
];

const OurStory: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-10 sm:py-12 lg:py-14"
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
            Our Story
          </h1>
          <p className="mt-3 text-white/95 text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-200" style={{ fontFamily: "'Poppins', sans-serif" }}>
            BaoAfrik was created to help Africans living abroad stay connected to the culture, foods, and products they grew up with.
          </p>
        </div>
      </section>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* The gap + bridge */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <h2
              className="text-lg font-bold text-[#1f2937] mb-4"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              The gap we saw
            </h2>
            <p className="text-[#4b5563] text-base leading-relaxed">
              For many people in the diaspora, accessing authentic African products is often difficult, expensive, or unreliable. At the same time, there are individuals, travellers, and small sellers within the community who already have these products but struggle to reach the right audience.
            </p>
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="relative pl-4 py-2 border-l-2 border-slate-400">
              <p className="text-[#1f2937] text-lg font-bold leading-snug" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                BaoAfrik exists to <span style={{ color: '#F9A822' }}>bridge</span> that gap.
              </p>
            </div>
          </div>
        </div>

        {/* Who it's for */}
        <section className="mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.22s', animationFillMode: 'forwards' }}>
          <h2
            className="text-xl font-bold text-[#1f2937] mb-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Who it’s for
          </h2>
          <p className="text-[#4b5563] text-base leading-relaxed mb-8 max-w-2xl">
            BaoAfrik is for anyone who wants to buy, sell, or request authentic African products within a community they trust.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {whoItsFor.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${0.24 + i * 0.05}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-slate-100 border border-slate-200">
                  <img src={item.icon} alt="" className="w-5 h-5 opacity-80" aria-hidden style={{ filter: 'brightness(0) opacity(0.6)' }} />
                </div>
                <h3 className="text-[#1f2937] font-semibold text-sm mb-1.5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-[#4b5563] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full max-w-2xl mx-auto mb-16 bg-slate-200" />

        {/* A space where connections happen + image */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 animate-fade-in-up opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <h2
              className="text-xl font-bold text-[#1f2937] mb-4"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              A space where connections happen
            </h2>
            <p className="text-[#4b5563] text-base leading-relaxed max-w-2xl mb-4">
              We provide a digital marketplace where users can discover products, post requests, and connect directly with others in their community. BaoAfrik does not sell products or handle transactions. We simply create the space where connections happen.
            </p>
            <p className="text-[#4b5563] text-sm leading-relaxed max-w-2xl">
              All payments and delivery are agreed between buyer and seller. We encourage everyone to follow our <Link to="/safety-trust" className="text-[#1f2937] font-medium underline hover:no-underline">Safety & Trust</Link> and <Link to="/community-guidelines" className="text-[#1f2937] font-medium underline hover:no-underline">Community Guidelines</Link> so the marketplace stays safe and positive.
            </p>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
              <img src={cultureImg} alt="Community and connection" className="w-full h-56 sm:h-64 object-cover object-center" />
              <p className="p-3 text-center text-sm text-[#4b5563] bg-gray-50">
                Connecting communities and culture.
              </p>
            </div>
          </div>
        </div>

        {/* What you can do on BaoAfrik */}
        <section className="mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.32s', animationFillMode: 'forwards' }}>
          <h2
            className="text-xl font-bold text-[#1f2937] mb-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What you can do on BaoAfrik
          </h2>
          <p className="text-[#4b5563] text-base leading-relaxed mb-8 max-w-2xl">
            Whether you want to buy, sell, or request items, the platform is built around direct connections.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatYouCanDo.map((item, index) => (
              <div
                key={index}
                className="pl-5 pr-5 py-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${0.35 + index * 0.05}s`,
                  animationFillMode: 'forwards',
                  borderLeftWidth: '3px',
                  borderLeftColor: '#cbd5e1',
                }}
              >
                <h3 className="text-[#1f2937] font-semibold text-base mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-[#4b5563] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How we're different — full-width banner */}
        <section className="mb-16 animate-fade-in-up opacity-0 text-center" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <h2
            className="text-xl font-bold text-[#1f2937] mb-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How we’re different
          </h2>
          <p className="text-[#4b5563] text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            We’re not a shop or a payment processor. We’re the place where you and others in the community connect.
          </p>
          <div
            className="relative left-1/2 -translate-x-1/2 w-screen pl-6 pr-4 py-6 sm:pl-8 sm:pr-6 sm:py-8"
            style={{
              background: 'linear-gradient(135deg, #fffbf8 0%, #fff9f0 100%)',
              borderTop: '1px solid rgba(249, 168, 34, 0.2)',
              borderBottom: '1px solid rgba(249, 168, 34, 0.2)',
              boxShadow: '0 2px 12px rgba(249, 168, 34, 0.06)',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} aria-hidden />
            <div className="max-w-6xl mx-auto pl-5 sm:pl-6">
              <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
                <p className="text-[#4b5563] text-base leading-relaxed">
                  <strong style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#F9A822' }}>Peer-to-peer</strong>
                  {' — '}
                  <span className="text-[#4b5563]">you deal directly with another person, not with us.</span>
                </p>
                <p className="text-[#4b5563] text-base leading-relaxed">
                  <strong style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#F9A822' }}>We don’t hold stock or process payments</strong>
                  {' — '}
                  <span className="text-[#4b5563]">we only provide the platform.</span>
                </p>
                <p className="text-[#4b5563] text-base leading-relaxed sm:col-span-1">
                  <strong style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#F9A822' }}>Community-first</strong>
                  {' — '}
                  <span className="text-[#4b5563]">we focus on trust, transparency, and clear guidelines.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full max-w-2xl mx-auto mb-16 bg-slate-200" />

        {/* Our goal — image left, text right */}
        <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.52s', animationFillMode: 'forwards' }}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md">
                <img src={decorImg} alt="Culture, community, and home" className="w-full h-56 sm:h-64 object-cover object-center" />
                <p className="p-4 text-sm text-[#4b5563] text-center border-t border-gray-100">
                  Culture, community, and home—wherever you are.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <h2
                className="text-xl font-bold text-[#1f2937] mb-4"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Our goal
              </h2>
              <p className="text-[#1f2937] text-lg font-medium leading-relaxed mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                We’re here to strengthen community ties, support small sellers, and make home feel a little closer—wherever you are.
              </p>
              <p className="text-[#4b5563] text-base leading-relaxed mb-6">
                Everything we do is about connecting people and keeping culture and community at the centre. BaoAfrik is the space where that happens.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="text-[#1f2937] font-medium" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Strengthen community ties</span>
                <span className="text-slate-300 select-none" aria-hidden>·</span>
                <span className="text-[#1f2937] font-medium" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Support small sellers</span>
                <span className="text-slate-300 select-none" aria-hidden>·</span>
                <span className="text-[#1f2937] font-medium" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Make home feel closer</span>
              </div>
            </div>
          </div>
        </section>

        {/* Learn more — gradient band + CTA */}
        <section className="mt-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.75s', animationFillMode: 'forwards' }}>
          <div
            className="relative overflow-hidden py-3 px-5 sm:px-8 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)',
              boxShadow: '0 8px 32px rgba(229, 83, 37, 0.25)',
            }}
          >
            <div className="absolute inset-0 opacity-[0.07]" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 20V40H20L40 20\'/%3E%3C/g%3E%3C/svg%3E")' }} />
            <div className="relative max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-4">
              <h2
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Learn more
              </h2>
              <span className="hidden sm:inline text-white/50" aria-hidden>·</span>
              <nav className="flex flex-wrap items-center justify-center gap-x-1 sm:gap-x-2" aria-label="Learn more">
                <Link
                  to="/how-it-works"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium text-white/95 hover:text-white hover:bg-white/15 transition-colors"
                >
                  How It Works
                </Link>
                <span className="hidden sm:inline text-white/50" aria-hidden>·</span>
                <Link
                  to="/partnerships"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium text-white/95 hover:text-white hover:bg-white/15 transition-colors"
                >
                  Partnerships
                </Link>
                <span className="hidden sm:inline text-white/50" aria-hidden>·</span>
                <Link
                  to="/safety-trust"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium text-white/95 hover:text-white hover:bg-white/15 transition-colors"
                >
                  Safety & Trust
                </Link>
                <span className="hidden sm:inline text-white/50" aria-hidden>·</span>
                <Link
                  to="/contact-support"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium text-white/95 hover:text-white hover:bg-white/15 transition-colors"
                >
                  Contact Support
                </Link>
              </nav>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-[#4b5563] text-sm mb-3">
              Ready to get started?
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-[#1f2937] bg-white border-2 border-slate-200 text-sm hover:border-[#E55325]/50 hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              How It Works
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OurStory;
