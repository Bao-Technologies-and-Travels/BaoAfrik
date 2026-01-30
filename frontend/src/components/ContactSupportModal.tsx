import React, { useState, useCallback } from 'react';
import { useContactSupport } from '../contexts/ContactSupportContext';

const ContactSupportModal: React.FC = () => {
  const { isOpen, closeContactSupport } = useContactSupport();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !showConfirmation) closeContactSupport();
    },
    [closeContactSupport, showConfirmation]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || !email.trim()) return;
      setIsSubmitting(true);
      // Simulate send - in production would POST to your API
      setTimeout(() => {
        setIsSubmitting(false);
        setShowConfirmation(true);
      }, 600);
    },
    [message, email]
  );

  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
    setMessage('');
    setEmail('');
    setPhone('');
    closeContactSupport();
  }, [closeContactSupport]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-support-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0000001A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Poppins', sans-serif",
        padding: '16px',
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <h2
            id="contact-support-title"
            style={{
              color: '#212121',
              fontSize: '20px',
              fontWeight: 700,
              margin: 0,
              flex: 1,
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Contact Support
          </h2>
          <button
            type="button"
            onClick={showConfirmation ? handleCloseConfirmation : closeContactSupport}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#212121',
              fontSize: '24px',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '12px',
              lineHeight: 1,
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {!showConfirmation ? (
          <>
            {/* Content */}
            <div style={{ marginBottom: '20px' }}>
              <p
                style={{
                  color: '#6A6A6A',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                If you have questions, feedback, or need help using BaoAfrik, our support team is here to assist.
              </p>
              <p
                style={{
                  color: '#212121',
                  fontSize: '13px',
                  fontWeight: 600,
                  margin: '0 0 6px 0',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                You can contact us regarding:
              </p>
              <ul
                style={{
                  color: '#6A6A6A',
                  fontSize: '13px',
                  lineHeight: 1.7,
                  margin: '0 0 12px 0',
                  paddingLeft: '20px',
                }}
              >
                <li>Account-related issues</li>
                <li>Reported content</li>
                <li>General platform enquiries</li>
              </ul>
              <p
                style={{
                  color: '#6A6A6A',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                We aim to respond as quickly as possible.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="contact-message"
                style={{
                  display: 'block',
                  color: '#212121',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '6px',
                }}
              >
                Message <span style={{ color: '#E55325' }}>*</span>
              </label>
              <textarea
                id="contact-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  color: '#212121',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  marginBottom: '14px',
                }}
              />

              <label
                htmlFor="contact-email"
                style={{
                  display: 'block',
                  color: '#212121',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '6px',
                }}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  color: '#212121',
                  boxSizing: 'border-box',
                  marginBottom: '14px',
                }}
              />

              <label
                htmlFor="contact-phone"
                style={{
                  display: 'block',
                  color: '#212121',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '6px',
                }}
              >
                Phone number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  color: '#212121',
                  boxSizing: 'border-box',
                  marginBottom: '20px',
                }}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#F9A825',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  width: '100%',
                  opacity: isSubmitting ? 0.8 : 1,
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#E55325';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9A825';
                }}
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation */
          <div
            style={{
              textAlign: 'center',
              padding: '24px 0 8px 0',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E55325 0%, #F9A825 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px',
                color: '#fff',
              }}
            >
              ✓
            </div>
            <p
              style={{
                color: '#212121',
                fontSize: '18px',
                fontWeight: 600,
                margin: '0 0 8px 0',
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Message sent
            </p>
            <p
              style={{
                color: '#6A6A6A',
                fontSize: '14px',
                lineHeight: 1.5,
                margin: '0 0 24px 0',
              }}
            >
              Thank you. We've received your message and will get back to you as soon as possible.
            </p>
            <button
              type="button"
              onClick={handleCloseConfirmation}
              style={{
                backgroundColor: '#212121',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#212121';
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSupportModal;
