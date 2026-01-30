import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import tickIcon from '../assets/images/pre/tick.svg';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1920&q=80';

const CommunityGuidelines: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const guidelines = [
    {
      title: 'Provide accurate information in listings and requests',
      description: 'Describe your items honestly, use clear photos, and communicate clearly with buyers and sellers so everyone can trust the marketplace.',
    },
    {
      title: 'Treat other users with respect',
      description: 'Be courteous in messages and reviews. Harassment, hate speech, or abusive behaviour is not tolerated and harms our community.',
    },
    {
      title: 'Avoid posting illegal or prohibited items',
      description: 'Only list items that are allowed in your region and that comply with our policies. Prohibited or restricted goods will be removed.',
    },
    {
      title: 'Use the platform responsibly',
      description: 'Do not spam, manipulate reviews, or misuse features. Responsible use keeps BaoAfrik safe and useful for everyone.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width hero with HD background image */}
      <section className="w-full relative overflow-hidden bg-[#212121] min-h-[320px] sm:min-h-[380px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-black/80"
            style={{ pointerEvents: 'none' }}
            aria-hidden
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white animate-fade-in-up"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Community <span className="gradient-brand-text" style={{ background: 'linear-gradient(135deg, #F9A825 0%, #E55325 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Guidelines</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200 animate-fade-in-up animation-delay-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            BaoAfrik is a community-driven platform where buyers and sellers connect. These guidelines help keep our marketplace <span className="font-medium" style={{ background: 'linear-gradient(135deg, #F9A825 0%, #E55325 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>safe, fair, and welcoming</span> for everyone.
          </p>
        </div>
      </section>

      {/* Full-width content area */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div style={{ fontFamily: "'Poppins', sans-serif", color: '#6A6A6A' }} className="space-y-8 text-base leading-relaxed">
          <p className="text-lg max-w-4xl animate-fade-in-up animation-delay-200">
            All users are expected to follow these guidelines. They apply to <span className="font-medium gradient-brand-text">listings, messages, reviews</span>, and all other use of the platform.
          </p>

          <p className="font-semibold text-[#212121] animate-fade-in-up animation-delay-300" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            All users are expected to:
          </p>

          <ul className="list-none space-y-6 pl-0 max-w-5xl">
            {guidelines.map((item, index) => (
              <li
                key={index}
                className={`flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up opacity-0`}
                style={{ animationDelay: `${0.35 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <img src={tickIcon} alt="" className="mt-1 shrink-0 w-6 h-6 opacity-90" aria-hidden style={{ minWidth: 24, minHeight: 24 }} />
                <div>
                  <p className="font-medium text-[#212121]">{item.title}</p>
                  <p className="mt-1 text-[#6A6A6A] text-sm leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-6 rounded-xl bg-[#212121] text-white max-w-5xl animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <p className="font-medium mb-2 gradient-brand-text" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Consequences
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Violation of these guidelines may result in content removal, account suspension, or account deactivation. We may also report serious or repeated breaches to the relevant authorities. By using BaoAfrik, you agree to follow these guidelines and our Terms of Use.
            </p>
            <p className="mt-3" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9375rem' }}>
              For any questions, visit our{' '}
              <Link to="/help-centre" className="underline hover:opacity-90 transition-opacity" style={{ color: '#64B5F6' }}>
                Help Centre
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityGuidelines;
