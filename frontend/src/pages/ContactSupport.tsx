import React, { useEffect, useState, useCallback } from 'react';
import sendIcon from '../assets/images/admin/send.svg';

const ContactSupport: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !message.trim()) return;
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowConfirmation(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 800);
    },
    [name, email, message]
  );

  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
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
        <div className="absolute inset-0 opacity-10" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight animate-fade-in-up animation-delay-100"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Contact Support
          </h1>
          <p className="mt-3 text-white/95 text-lg max-w-2xl animate-fade-in-up animation-delay-200">
            Get in touch with our team. We're here to help with any questions about BaoAfrik.
          </p>
        </div>
      </section>

      {/* Content - full width, no border or shadow */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div
          className="animate-fade-in-up opacity-0 w-full"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <div className="w-full">
            <p style={{ color: '#6A6A6A', fontFamily: "'Poppins', sans-serif" }} className="text-base lg:text-lg leading-relaxed w-full">
              If you have questions, feedback, or need help using BaoAfrik, our support team is here to assist. We're committed to making our marketplace safe, transparent, and easy to use for buyers and sellers alike.
            </p>
            <p style={{ color: '#6A6A6A', fontFamily: "'Poppins', sans-serif" }} className="mt-4 text-base leading-relaxed w-full">
              Whether you're new to the platform or an existing user, we want your experience to be smooth and secure. Below you'll find what we can help with, how we handle your messages, and how to reach us.
            </p>

            <h2
              className="mt-10 mb-4 text-xl font-bold tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
            >
              What we can help with
            </h2>
            <p style={{ color: '#6A6A6A', fontFamily: "'Poppins', sans-serif" }} className="mb-4 text-base">
              You can contact us regarding:
            </p>
            <ul className="space-y-3 w-full">
              {[
                'Account-related issues — login, email verification, two-factor authentication, profile updates, and account settings.',
                'Reported content or safety concerns — listings, messages, or behaviour that may violate our Community Guidelines or Terms of Use.',
                'General platform enquiries — how to list items, how to buy or request products, how payments and deliveries are agreed between buyers and sellers, and how to get the most out of BaoAfrik.',
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)' }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: '#6A6A6A', fontFamily: "'Poppins', sans-serif" }} className="text-base leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <h2
              className="mt-10 mb-4 text-xl font-bold tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
            >
              Response times
            </h2>
            <p style={{ color: '#6A6A6A', fontFamily: "'Poppins', sans-serif" }} className="text-base leading-relaxed w-full">
              We aim to respond as quickly as possible. Most enquiries are answered within <strong style={{ color: '#212121' }}>24–48 hours</strong> on business days (Monday–Friday). For urgent safety or account issues, we prioritise those messages and may respond sooner. Please include as much detail as you can so we can help you faster.
            </p>

            <h2
              className="mt-10 mb-4 text-xl font-bold tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
            >
              Before you contact us
            </h2>
            <p style={{ color: '#6A6A6A', fontFamily: "'Poppins', sans-serif" }} className="text-base leading-relaxed w-full">
              Many common questions are covered in our <a href="/help-centre" className="underline hover:opacity-90 font-medium" style={{ color: '#64B5F6' }}>Help Centre</a> — including how to create a listing, how to message sellers, and how we handle disputes. Checking there first can save you time. If you still need to talk to us, use the form below.
            </p>

            <div className="mt-10 p-5 rounded-xl bg-gray-100/60">
              <p className="text-sm font-semibold" style={{ color: '#212121', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Need quick answers?
              </p>
              <p className="text-sm mt-1" style={{ color: '#6A6A6A', fontFamily: "'Poppins', sans-serif" }}>
                Check our <a href="/help-centre" className="underline hover:opacity-90 font-medium" style={{ color: '#64B5F6' }}>Help Centre</a> for FAQs, guides, and step-by-step help. You can also review our <a href="/terms" className="underline hover:opacity-90 font-medium" style={{ color: '#64B5F6' }}>Terms of Use</a> and <a href="/community-guidelines" className="underline hover:opacity-90 font-medium" style={{ color: '#64B5F6' }}>Community Guidelines</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form - below content, centred */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div
          className="animate-fade-in-up opacity-0 max-w-2xl mx-auto"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
          >
            <div className="h-1.5 gradient-brand" style={{ background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)' }} />
            <div className="p-6 sm:p-8">
              <h2
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
              >
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: '#212121' }}
                    >
                      Name <span style={{ color: '#E55325' }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55325]/30 focus:border-[#E55325] transition-all duration-200"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: '#212121' }}
                    >
                      Email <span style={{ color: '#E55325' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55325]/30 focus:border-[#E55325] transition-all duration-200"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: '#212121' }}
                    >
                      Phone number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55325]/30 focus:border-[#E55325] transition-all duration-200"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: '#212121' }}
                    >
                      Message <span style={{ color: '#E55325' }}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help? Include as much detail as you can."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E55325]/30 focus:border-[#E55325] transition-all duration-200 resize-y min-h-[120px]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)',
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: '0 4px 14px rgba(229, 83, 37, 0.35)',
                    }}
                  >
                    <img src={sendIcon} alt="" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} aria-hidden />
                    {isSubmitting ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      {/* Confirmation popup */}
      {showConfirmation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-confirmation-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', fontFamily: "'Poppins', sans-serif" }}
          onClick={handleCloseConfirmation}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)' }}
            >
              ✓
            </div>
            <h2
              id="contact-confirmation-title"
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
            >
              Message sent
            </h2>
            <p className="text-base mb-6" style={{ color: '#6A6A6A' }}>
              Thank you. We've received your message and will get back to you as soon as possible.
            </p>
            <button
              type="button"
              onClick={handleCloseConfirmation}
              className="py-2.5 px-6 rounded-2xl font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#212121', fontFamily: "'Poppins', sans-serif" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSupport;
