import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    id: 'account',
    question: 'How do I create and manage my account?',
    answer: (
      <>
        <p className="mb-3">
          To use BaoAfrik, create an account by <a href="/register" style={{ color: '#64B5F6' }}>signing up</a> with your email. You’ll be asked to verify your email before you can list items or message other users. You can add a profile photo, bio, and location in your profile so buyers and sellers know who they’re dealing with.
        </p>
        <p className="mb-3">
          To manage your account, go to your profile or account settings. From there you can update your details, change your password, and turn on two-factor authentication for extra security. Keep your login details private and tell us straight away if you think someone else has used your account.
        </p>
      </>
    ),
  },
  {
    id: 'listing',
    question: 'How do I list products?',
    answer: (
      <>
        <p className="mb-3">
          To list a product on BaoAfrik, go to <a href="/create-listing" style={{ color: '#64B5F6' }}>Create listing</a> and add a clear title, description, and photos. Choose the right category (e.g. Food & Spices, Fashion & Textiles) and set your price. Use honest descriptions and good-quality photos so buyers know exactly what they’re getting.
        </p>
        <p className="mb-3">
          You can edit or remove your listings at any time from My Listings. Only list items that you’re allowed to sell in your area and that follow our Community Guidelines. Prohibited or restricted items will be removed.
        </p>
      </>
    ),
  },
  {
    id: 'requests',
    question: 'How do I make and manage requests?',
    answer: (
      <>
        <p className="mb-3">
          If you’re looking for something that isn’t listed yet, you can create a request. Describe what you want, and sellers can respond with offers. You can manage your requests from the Requests section, where you’ll see incoming offers and can accept, decline, or message sellers.
        </p>
        <p className="mb-3">
          Sellers can also browse requests and reply to buyers. Once you agree on price and delivery, use messaging to finalise the details. Keep track of open and closed requests so you don’t miss offers.
        </p>
      </>
    ),
  },
  {
    id: 'messaging',
    question: 'How do I message other users?',
    answer: (
      <>
        <p className="mb-3">
          <ul>
            <li>You can message a seller by opening a listing and choosing “Contact seller” or “Message”.</li>
            <li>For requests, you can message buyers who have posted requests you can fulfil.</li>
            <li>All messages go through BaoAfrik’s messaging system so you have a record of your conversations.</li>
          </ul>
        </p>
        <p className="mb-3">
          <ul>
            <li>Use messaging to agree on price, delivery, and how payment will be handled between you and the other user.</li>
            <li>Be clear and respectful.</li>
            <li>We don’t read your private messages, but we may act on reports of abuse, fraud, or rule-breaking.</li>
            <li>Don’t share personal payment details outside the platform before you’re sure the other party is trustworthy.</li>
          </ul>
        </p>
      </>
    ),
  },
  {
    id: 'responsibilities',
    question: 'What are my responsibilities on the platform?',
    answer: (
      <>
        <p className="mb-3">
          As a user of BaoAfrik, you’re responsible for giving accurate information in your profile and listings, dealing fairly with other users, and only listing items that are allowed. You must not harass others, mislead buyers or sellers, or use the platform for anything illegal.
        </p>
        <p className="mb-3">
          BaoAfrik is a peer-to-peer marketplace: we connect buyers and sellers but don’t verify users or guarantee transactions. You’re responsible for your own deals, including payment and delivery. BaoAfrik does not verify listings, so sellers are responsible for compliance. For full details, see our{' '}
          <Link to="/community-guidelines" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>Community Guidelines</Link>,{' '}
          <Link to="/terms" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>Terms of Use</Link>, and{' '}
          <Link to="/safety-trust" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>Safety & Trust</Link> pages.
        </p>
      </>
    ),
  },
];

const HelpCentre: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero - updated styling */}
      <header
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #E55325 0%, #F9A825 50%, #F9A825 100%)',
          boxShadow: '0 4px 20px rgba(229, 83, 37, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 text-center">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-sm"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Help Centre
          </h1>
          <p className="mt-3 text-white/95 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about using BaoAfrik. Browse the topics below or get in touch if you need more help.
          </p>
        </div>
      </header>

      {/* FAQ - full width, no box */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="w-full max-w-6xl mx-auto">
          <p className="text-[#6A6A6A] text-base sm:text-lg leading-relaxed mb-8 animate-fade-in-up opacity-0 max-w-4xl" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', fontFamily: "'Poppins', sans-serif" }}>
            Here you’ll find answers to the most common questions about using BaoAfrik — from creating your account to listing products, making requests, messaging other users, and understanding your responsibilities. Click a question to expand the answer.
          </p>

          <div className="divide-y divide-gray-200 animate-fade-in-up opacity-0" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            {faqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className={`py-5 sm:py-6 transition-colors ${isOpen ? 'rounded-xl px-4 sm:px-5' : ''}`} style={{ backgroundColor: isOpen ? 'rgba(249, 168, 37, 0.05)' : 'transparent' }}>
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E55325]/30 focus-visible:ring-offset-2 rounded-lg py-1"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-question-${faq.id}`}
                  >
                    <span
                      className="font-semibold text-[#212121] text-base sm:text-lg pr-2"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      {faq.question}
                    </span>
                    <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#E55325] transition-all duration-200" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${faq.id}`}
                    className="overflow-hidden transition-all duration-200"
                    style={{ maxHeight: isOpen ? 1200 : 0 }}
                  >
                    <div className="pt-3 pb-2">
                      <div className="pl-4 border-l-2 text-[#6A6A6A] text-sm sm:text-base leading-relaxed" style={{ borderColor: '#E55325', fontFamily: "'Poppins', sans-serif" }}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-[#6A6A6A] text-sm leading-relaxed animate-fade-in-up opacity-0 max-w-3xl" style={{ animationDelay: '0.35s', animationFillMode: 'forwards', fontFamily: "'Poppins', sans-serif" }}>
            For more details on how we expect users to behave and what we’re responsible for, see our{' '}
            <Link to="/community-guidelines" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>Community Guidelines</Link>,{' '}
            <Link to="/terms" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>Terms of Use</Link>, and{' '}
            <Link to="/safety-trust" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>Safety & Trust</Link> pages.
          </p>

          {/* CTA */}
          <div className="mt-10 pt-8 border-t border-gray-200 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <p className="text-[#6A6A6A] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Can’t find what you need?{' '}
              <Link to="/contact-support" className="font-medium underline hover:opacity-90" style={{ color: '#64B5F6' }}>
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpCentre;
