import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Left gradient accent + content */}
        <div className="relative sm:pl-5">
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-1 rounded-full gradient-brand" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight animate-fade-in-up" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}>
              Privacy <span className="gradient-brand-text">Policy</span>
            </h1>

            <div style={{ fontFamily: "'Poppins', sans-serif", color: '#6A6A6A' }} className="space-y-8 text-base leading-relaxed">
              <p className="animate-fade-in-up animation-delay-100">
                BaoAfrik is committed to protecting your privacy and handling personal data responsibly in line with UK GDPR and the Data Protection Act 2018.
              </p>

            <section className="bg-white rounded-xl py-5 pl-6 pr-5 sm:pl-7 sm:pr-6 border border-gray-100 animate-fade-in-up animation-delay-200 relative overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 gradient-brand rounded-l-xl" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} />
              <h2
                className="text-lg font-semibold mb-3 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
              >
                We may collect personal information such as:
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[#6A6A6A]">
                <li>Name, email address, phone number</li>
                <li>Location and profile details</li>
                <li>Listings, requests, and messages</li>
                <li>Technical data such as device information and IP address</li>
              </ul>
            </section>

            <section className="bg-white rounded-xl py-5 pl-6 pr-5 sm:pl-7 sm:pr-6 border border-gray-100 animate-fade-in-up animation-delay-300 relative overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 gradient-brand rounded-l-xl" style={{ background: 'linear-gradient(180deg, #E55325 0%, #F9A825 100%)' }} />
              <h2
                className="text-lg font-semibold mb-3 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
              >
                Your data is used to:
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[#6A6A6A]">
                <li>Operate and improve the BaoAfrik platform</li>
                <li>Enable communication between users</li>
                <li>Meet legal and regulatory obligations</li>
              </ul>
            </section>

            <p className="font-medium text-[#212121]">
              We do not sell personal data.
            </p>

            <p>
              You have the right to access, correct, delete, or restrict the use of your personal data. You may also lodge a complaint with the Information Commissioner's Office (ICO).
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
