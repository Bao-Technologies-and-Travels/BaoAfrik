import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContactSupport } from '../contexts/ContactSupportContext';

const TermsOfUse: React.FC = () => {
  const { openContactSupport } = useContactSupport();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in-up opacity-0" style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' }}>
          <div className="h-1.5 rounded-t-2xl gradient-brand" style={{ background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)' }} />
          <div className="px-6 sm:px-10 py-8 sm:py-12">
            <h1
              className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
            >
              Terms <span className="gradient-brand-text">of</span> Use
            </h1>

            <div style={{ fontFamily: "'Poppins', sans-serif", color: '#6A6A6A' }} className="space-y-6 text-base leading-relaxed">
              <p>
                Welcome to BaoAfrik. By accessing or using our platform, you agree to be bound by these Terms of Use. Please read them carefully before using our services.
              </p>

              <h2
                className="text-xl font-semibold mt-10 mb-3 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
              >
                Your responsibilities
              </h2>
              <p>As a user of BaoAfrik, you agree to:</p>
              <ul className="list-disc pl-6 space-y-3 text-[#6A6A6A]">
                <li>Provide accurate and complete information when creating an account or listing items.</li>
                <li>Use the platform only for lawful purposes and in accordance with these terms.</li>
                <li>Respect other users and refrain from harassment, fraud, or misleading conduct.</li>
                <li>Not list prohibited items or content that violates applicable laws or our Community Guidelines.</li>
                <li>Honour commitments made in transactions (e.g. payment and delivery within agreed terms).</li>
                <li>Keep your account credentials secure and notify us of any unauthorised use.</li>
              </ul>

              <p className="mt-6">
                BaoAfrik provides a marketplace that connects buyers and sellers. We do not take ownership of items listed, nor do we guarantee the quality, safety, or legality of listings. Transactions are between users, and you use the platform at your own risk.
              </p>

              <p>
                These Terms of Use are governed by the laws of the jurisdiction in which BaoAfrik operates. Any disputes arising from your use of the platform shall be resolved in accordance with those laws and our dispute resolution process.
              </p>

              <p className="text-sm mt-8" style={{ color: '#BABABA' }}>
                Last updated: January 2026. For questions about these terms, please contact us through our <Link to="/help-centre" className="underline hover:opacity-90" style={{ color: '#64B5F6' }}>Help Centre</Link> or <button type="button" onClick={openContactSupport} className="underline hover:opacity-90 bg-transparent border-none p-0 cursor-pointer font-inherit text-inherit" style={{ color: '#64B5F6' }}>Contact Support</button>.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TermsOfUse;
