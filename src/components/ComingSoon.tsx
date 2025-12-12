import React, { useState, useEffect } from 'react';
import LogoContainer from '../assets/images/Logo Container.svg';
import MobileLogo from '../assets/images/logos/ba-brand-icon-colored.png';
import MainProductImage from '../assets/images/Main Product Image.svg';
import ProductImage from '../assets/images/Product Image.svg';
import SellerAvatar from '../assets/images/Seller Avatar Container.svg';
import ProductIcon from '../assets/images/Product Icon.svg';
import PriceIcon from '../assets/images/Price Icon.svg';
import LocationIcon from '../assets/images/Location Icon.svg';
import NotifyIcon from '../assets/images/Notify Me Icon.svg';
import LinkedInIcon from '../assets/images/linkedin--network-linkedin-professional.svg';
import FacebookIcon from '../assets/images/facebook.svg';
import InstagramIcon from '../assets/images/instagram.svg';
import TikTokIcon from '../assets/images/Social.svg';
import VerificationBadge from '../assets/images/Seller Verification.svg';
import RatingStars from '../assets/images/Rating Stars.svg';
import ProductTitleContainer from '../assets/images/Product Title Container.svg';

// Slide 1 imports
import Slide1MainProduct from '../assets/images/slide1/Main Product Image (1).svg';
import Slide1ProductTitle from '../assets/images/slide1/Product Title Container (3).svg';
import Slide1LocationImage from '../assets/images/slide1/Product Image.png';

// Slide 2 imports
import Slide2MainProduct from '../assets/images/slide2/Frame 930 (2).svg';
import Slide2ProductTitle from '../assets/images/slide2/Product Title Container (4).svg';
import Slide2LocationImage from '../assets/images/slide2/Frame 940 (4).svg';
import Slide2CountryBadge from '../assets/images/slide2/Product Location (1).svg';
import Slide2NigeriaFlag from '../assets/images/slide2/nigeria.svg';
import Slide2SellerBadge from '../assets/images/slide2/Seller Avatar Container (1).svg';

// Slide 3 imports
import Slide3MainProduct from '../assets/images/slide3/Main Product Image (2).svg';
import Slide3ProductTitle from '../assets/images/slide3/Product Title Container (5).svg';
import Slide3LocationImage from '../assets/images/slide3/Frame 940 (1).png';
import Slide3LocationDetails from '../assets/images/slide3/Location Details.svg';
import Slide3SellerAvatar from '../assets/images/slide3/Seller Avatar (2).svg';
import Slide3IvoryCoastFlag from '../assets/images/slide3/ivory coast.svg';

// Slide 4 imports
import Slide4MainProduct from '../assets/images/slide4/Main Product Image (2).png';
import Slide4ProductTitle from '../assets/images/slide4/Product Title and Price Details.jpg';
import Slide4LocationImage from '../assets/images/slide4/Frame 940 (2).svg';
import Slide4SellerBadge from '../assets/images/slide4/Seller Avatar Container (2).svg';
import Slide4SenegalFlag from '../assets/images/slide4/senegal.svg';
import Slide4ExtraDetail from '../assets/images/slide4/29 23.svg';

// Slide 5 imports
import Slide5MainProduct from '../assets/images/slide5/Main Product Image (3).png';
import Slide5ProductTitle from '../assets/images/slide5/Product Title and Price Details.svg';
import Slide5LocationImage from '../assets/images/slide5/Frame 940 (3).svg';
import Slide5SellerBadge from '../assets/images/slide5/Seller Avatar Container (3).svg';
import Slide5GabonFlag from '../assets/images/slide5/gabon.svg';

// Modal assets
import SuccessIcon from '../assets/images/Group 911.svg';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UserSubmission {
  fullName: string;
  email: string;
  userType: string;
  timestamp: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3001/api';

const ComingSoon: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    weeklyCount: 0,
    totalCount: 0,
    weekStart: ''
  });

  // Calculate initial countdown to December 31st
  const calculateTimeLeft = (): CountdownTime => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59); // December 31st, 11:59:59 PM
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft());
  const [showModal, setShowModal] = useState(false);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [lastExportDate, setLastExportDate] = useState<string>('');

  // formatTimestamp to normal human readable format
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  };

  // admin panel toggle (hidden by default)
  useEffect(() => {
    // keyboard shortcut to show admin panel: ctrl + shift + q
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
        e.preventDefault();
        setShowAdminPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const slides = [
    {
      mainProduct: Slide1MainProduct,
      productTitle: Slide1ProductTitle,
      locationImage: Slide1LocationImage,
      sellerName: 'Joaquin EDMO',
      sellerAvatar: SellerAvatar,
      useSellerContainer: false,
      country: 'Cameroon',
      locationText: 'London, United Kingdom',
      locationSubtext: 'map.google.com',
      showPriceCard: true,
      showLocationCard: true,
      showCountryBadge: true,
      countryIcon: LocationIcon
    },
    {
      mainProduct: Slide2MainProduct,
      productTitle: Slide2ProductTitle,
      locationImage: Slide2LocationImage,
      sellerName: 'Abayomi Salomon',
      sellerBadgeContainer: Slide2SellerBadge,
      useSellerContainer: true,
      country: 'Nigeria',
      countryIcon: Slide2NigeriaFlag,
      locationText: 'Birmingham, United Kingdom',
      locationSubtext: 'map.google.com',
      showPriceCard: true,
      showLocationCard: true,
      showCountryBadge: true
    },
    {
      mainProduct: Slide3MainProduct,
      productTitle: Slide3ProductTitle,
      locationImage: Slide3LocationImage,
      sellerName: 'Amani Mariam',
      sellerAvatar: Slide3SellerAvatar,
      useSellerContainer: false,
      country: 'Ivory Coast',
      countryIcon: Slide3IvoryCoastFlag,
      locationText: 'Plymouth, United Kingdom',
      locationSubtext: 'map.google.com',
      locationDetails: Slide3LocationDetails,
      showPriceCard: true,
      showLocationCard: true,
      showCountryBadge: true
    },
    {
      mainProduct: Slide4MainProduct,
      productTitle: Slide4ProductTitle,
      locationImage: Slide4LocationImage,
      sellerName: 'Aissatou Khady',
      sellerBadgeContainer: Slide4SellerBadge,
      useSellerContainer: true,
      country: 'Senegal',
      countryIcon: Slide4SenegalFlag,
      locationText: 'Vancouver, Canada',
      locationSubtext: 'map.google.com',
      locationDetails: Slide4ExtraDetail,
      showPriceCard: true,
      showLocationCard: true,
      showCountryBadge: true
    },
    {
      mainProduct: Slide5MainProduct,
      productTitle: Slide5ProductTitle,
      locationImage: Slide5LocationImage,
      sellerName: 'Ovono Warren',
      sellerBadgeContainer: Slide5SellerBadge,
      useSellerContainer: true,
      country: 'Gabon',
      countryIcon: Slide5GabonFlag,
      locationText: 'Novgorod, Russia',
      locationSubtext: 'map.google.com',
      showPriceCard: true,
      showLocationCard: true,
      showCountryBadge: true
    }
  ];

  // Countdown timer - recalculates to December 31st every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-slider for products
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideTimer);
  }, [slides.length]);

  // get submissions count from backend
  const fetchSubmissionsCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/submissions`);
      if (response.ok) {
        const data = await response.json();
        setSubmissionsCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching submissions count:', error);
    }
  };

  // get weekly stats from backend
  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/weekly-stats`);
      if (response.ok) {
        const data = await response.json();
        setWeeklyStats(data);
      }
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  };

  // When admin panel opens
  useEffect(() => {
    if (showAdminPanel) {
      fetchWeeklyStats();
      fetchSubmissionsCount();
    }
  }, [showAdminPanel]);

  // check if email already exists
  const isEmailRegistered = (email: string): boolean => {
    return submissions.some(sub => sub.email.toLowerCase() === email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!fullName.trim() || !email.trim() || !userType) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (isEmailRegistered(email)) {
      setShowDuplicateModal(true);
      return;
    }

    setIsSubmitting(true)

    try {
      // create new submission
      const submissionData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        userType,
        timestamp: formatTimestamp(new Date()),
      };

      const response = await fetch(`${API_BASE_URL}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.status === 409) {
        // duplicate email
        setShowDuplicateModal(true);
      } else if (result.success) {
        // reset form
        setFullName('');
        setEmail('');
        setUserType('');

        // Show success modal after a brief delay
        setTimeout(() => {
          setShowModal(true);
        }, 100);

        // refresh count
        fetchSubmissionsCount();
        fetchWeeklyStats();
      } else {
        throw new Error(result.message || 'submission failed');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportDataNow = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/export-now`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        alert('Export completed and email sent to marketing team!');
      } else {
        alert('Export failed: ' + result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to trigger export');
    }
  };

  const fetchAllSubmissions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/submissions`);
      if (response.ok) {
        const data = await response.json();

        // Convert to CSV and download
        const headers = ['ID', 'Full Name', 'Email', 'User Type', 'Submission Date', 'Submission Time'];
        const csvRows = data.map((row: any) => {
          // Format the date and time properly
          const submissionDate = new Date(row.created_at).toISOString().split('T')[0];
          const submissionTime = new Date(row.created_at).toTimeString().split(' ')[0];

          return [
            row.id,
            `"${row.full_name.replace(/"/g, '""')}"`,
            row.email,
            row.user_type,
            submissionDate,
            submissionTime
          ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `bao-afrik-leads-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const isFormComplete = fullName.trim() !== '' && email.trim() !== '' && userType !== '';

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-white lg:bg-warm-gradient flex flex-col relative">
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full mx-4 p-8 z-10">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <img src={SuccessIcon} alt="Success" className="w-20 h-20" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              You have been registered
            </h2>

            {/* Message */}
            <p className="text-gray-500 text-center mb-8 leading-relaxed">
              Thank you for committing to be one of the first users of BAO Afrik and its community. We will keep you informed once the platform is operational.
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-4 rounded-xl font-semibold text-white transition-colors"
              style={{ backgroundColor: '#F9A825' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E89515'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9A825'}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Duplicate Email Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setShowDuplicateModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full mx-4 p-8 z-10">
            {/* Close button */}
            <button
              onClick={() => setShowDuplicateModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Info Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Already Waitlisted
            </h2>

            {/* Message */}
            <p className="text-gray-500 text-center mb-8 leading-relaxed">
              This email is already registered in our waitlist. You will be notified once the platform is operational.
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowDuplicateModal(false)}
              className="w-full py-4 rounded-xl font-semibold text-white transition-colors"
              style={{ backgroundColor: '#F9A825' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E89515'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9A825'}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Admin panel (hidden by default) */}
      {showAdminPanel && (
        <div className="fixed top-4 right-4 z-40 bg-white p-4 rounded-lg shadow-lg border min-w-[200px]">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-semibold">Admin Panel</div>
            <button onClick={() => setShowAdminPanel(false)} className="text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {/* Stats */}
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total Leads:</span>
                <span className="font-semibold">{submissionsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>This Week:</span>
                <span className="font-semibold text-green-600">{weeklyStats.weeklyCount}</span>
              </div>
            </div>

            <div className="border-t pt-2 space-y-2">
              <button
                onClick={fetchAllSubmissions}
                className="w-full bg-green-500 text-white px-3 py-1.5 rounded text-xs hover:bg-green-600 transition-colors"
              >
                Download Full CSV
              </button>
              <button
                onClick={exportDataNow}
                className="w-full bg-blue-500 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Send Weekly Export Now
              </button>
              <button
                onClick={fetchWeeklyStats}
                className="w-full bg-gray-500 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-600 transition-colors"
              >
                Refresh Stats
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center border-t pt-2">
              Auto-export: Weekly (Mon 8AM)
            </div>
          </div>
        </div>
      )}

      <header className="px-6 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <img src={LogoContainer} alt="bao'Afrik" className="h-12" />
              <p className="text-sm text-gray-400 mt-1">
                Bringing home closer to Africans abroad
              </p>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  <span>Days</span>
                  <span className="mx-4">Hours</span>
                  <span className="mx-2">Minutes</span>
                  <span className="ml-2">Seconds</span>
                </p>
                <div className="flex items-center gap-2 text-3xl lg:text-4xl font-bold">
                  <span style={{ color: '#F9A825' }}>{formatTime(timeLeft.days)}</span>
                  <span className="text-gray-300">:</span>
                  <span className="text-gray-900">{formatTime(timeLeft.hours)}</span>
                  <span className="text-gray-300">:</span>
                  <span className="text-gray-900">{formatTime(timeLeft.minutes)}</span>
                  <span className="text-gray-300">:</span>
                  <span className="text-gray-900">{formatTime(timeLeft.seconds)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center text-center">
            <img src={MobileLogo} alt="bao'Afrik" className="h-12 w-12 mb-2" />
            <p className="text-xs text-gray-400">
              Bringing home closer to Africans abroad
            </p>

            {/* Mobile Countdown */}
            <div className="mt-10">
              <div className="flex items-center justify-center gap-2">
                {/* Days */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">Day</span>
                  <span className="text-3xl font-bold" style={{ color: '#F9A825' }}>{formatTime(timeLeft.days)}</span>
                </div>
                <span className="text-3xl font-bold text-gray-300 mt-6">:</span>

                {/* Hours */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">Hours</span>
                  <span className="text-3xl font-bold text-gray-900">{formatTime(timeLeft.hours)}</span>
                </div>
                <span className="text-3xl font-bold text-gray-300 mt-6">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">Minutes</span>
                  <span className="text-3xl font-bold text-gray-900">{formatTime(timeLeft.minutes)}</span>
                </div>
                <span className="text-3xl font-bold text-gray-300 mt-6">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">Seconds</span>
                  <span className="text-3xl font-bold text-gray-900">{formatTime(timeLeft.seconds)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="h-4 lg:h-16"></div>

      <main className="px-6 lg:px-16 py-4 pb-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 max-w-md mx-auto lg:mx-0 w-full">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-6xl font-bold font-bricolage text-gray-900 mb-1">
                We are
              </h1>
              <h1 className="text-3xl lg:text-6xl font-bold font-bricolage mb-3" style={{ color: '#F9A825' }}>
                coming soon
              </h1>
              <p className="text-gray-400 text-sm lg:text-base">
                Stay tuned and be notified once the platform is available
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="name"
                id="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
              />
              <input
                type="email"
                id="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
              />

              <div>
                <p className="text-sm text-gray-700 mb-3">I'm :</p>
                <div className="flex flex-wrap items-center gap-4">
                  {['Buyer', 'Seller', 'Investor', 'Curious'].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value={type}
                        checked={userType === type}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700 text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormComplete || isSubmitting}
                className={`w-full flex items-center justify-center gap-1.5 rounded-xl transition-all py-3 ${isFormComplete && !isSubmitting
                  ? 'text-white cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                style={{
                  ...(isFormComplete && !isSubmitting && { backgroundColor: '#F9A825' })
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="inline-block h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-sm">Submitting...</span>
                  </>
                ) : (
                  <>
                    <img
                      src={NotifyIcon}
                      alt="Notify"
                      className="w-5 h-5"
                      style={{ filter: isFormComplete ? 'brightness(0) invert(1)' : 'none' }}
                    />
                    <span className="font-medium text-sm">Notify me</span>
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Mobile & Desktop Product Section */}
          <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[530px] mt-8 lg:mt-0">

            {/* Central Product with Fade Transition */}
            <div className="relative z-10 transition-opacity duration-700" style={{ width: '100%', maxWidth: '518px', height: '400px' }}>
              <img
                key={currentSlide}
                src={slides[currentSlide].mainProduct}
                alt="Product"
                className="w-full h-full object-contain animate-fadeIn"
              />
            </div>

            {/* 1. Product Price Card - Position changes per slide */}
            <div key={`price-${currentSlide}`} className={`absolute z-20 animate-float-2 ${currentSlide === 1 ? 'top-2 left-2 lg:top-4 lg:left-8' : 'top-0 right-2 lg:right-0'}`}>
              <div className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2 pl-3 lg:p-4 lg:pl-5 min-w-[120px] lg:min-w-[200px]">
                {/* Floating yellow price icon at the edge */}
                <div className="absolute -left-2.5 lg:-left-3 top-2 lg:top-3 bg-[#F9A825] p-1 lg:p-2 rounded-full shadow-lg z-10">
                  <img src={PriceIcon} alt="Price" className="w-2.5 h-2.5 lg:w-4 lg:h-4" />
                </div>

                <div className="pl-3 lg:pl-5">
                  <img src={slides[currentSlide].productTitle} alt="Product Price" className="w-full max-w-[85px] lg:max-w-[160px]" />
                </div>
              </div>
            </div>

            {/* 2. Location Image Card - Position changes per slide */}
            <div key={`location-${currentSlide}`} className={`absolute z-20 animate-float-1 ${currentSlide === 0 || currentSlide === 3 || currentSlide === 4 ? 'top-16 left-2 lg:top-20 lg:left-8' : currentSlide === 1 ? 'bottom-20 right-2 lg:bottom-24 lg:right-12' : 'top-8 left-2 lg:left-8'}`}>
              <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5 lg:p-2.5 max-w-[95px] lg:max-w-[150px]">
                {/* Yellow camera icon floating at edge */}
                <div className={`absolute bg-[#F9A825] p-1 lg:p-2 rounded-full shadow-lg z-10 ${currentSlide === 1 ? '-top-1.5 lg:-top-2 -right-1.5 lg:-right-2' : '-top-1.5 lg:-top-2 -left-1.5 lg:-left-2'}`}>
                  <img src={ProductIcon} alt="Location" className="w-2.5 h-2.5 lg:w-4 lg:h-4" />
                </div>

                <img
                  src={slides[currentSlide].locationImage}
                  alt="Location"
                  className="w-full h-16 lg:h-32 object-cover rounded-xl"
                />
                <p className="text-[9px] lg:text-[11px] text-gray-900 font-medium mt-1 lg:mt-2 leading-tight">{slides[currentSlide].locationText}</p>
                <p className="text-[7px] lg:text-[9px] text-gray-400 leading-tight">{slides[currentSlide].locationSubtext}</p>
                <button className="mt-1 lg:mt-2 text-white text-[8px] lg:text-[10px] font-medium px-1.5 lg:px-3 py-0.5 lg:py-1 rounded-full transition-colors inline-block" style={{ backgroundColor: '#F9A825' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E89515'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9A825'}>
                  Go to
                </button>
              </div>
            </div>

            {/* 3. Bottom-Left Seller Badge */}
            <div key={`seller-${currentSlide}`} className="absolute bottom-20 left-2 lg:bottom-28 lg:left-16 z-20 animate-float-3">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-1.5 py-1 lg:px-2.5 lg:py-1.5 flex items-center gap-1 lg:gap-2 min-w-[100px] lg:min-w-[160px]">
                <img
                  src={slides[currentSlide].useSellerContainer ? slides[currentSlide].sellerBadgeContainer : slides[currentSlide].sellerAvatar}
                  alt="Seller"
                  className="w-6 h-6 lg:w-9 lg:h-9 rounded-full flex-shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-gray-900 text-[9px] lg:text-[11px] leading-tight whitespace-nowrap">{slides[currentSlide].sellerName}</p>
                  <img src={VerificationBadge} alt="Verified Seller" className="h-2.5 lg:h-3.5" />
                </div>
              </div>
              {/* Slide 3: Dimension badge */}
              {currentSlide === 2 && slides[currentSlide].locationDetails && (
                <div className="mt-1.5 flex justify-center">
                  <img src={slides[currentSlide].locationDetails} alt="Dimensions" className="h-5 lg:h-6" />
                </div>
              )}
            </div>

            {/* 4. Country Tag/Badge - Same styling for all slides */}
            <div key={`country-${currentSlide}`} className={`absolute z-20 animate-float-4 ${currentSlide === 1 ? 'top-2 right-2 lg:top-4 lg:right-12' : 'bottom-16 right-2 lg:bottom-20 lg:right-16'}`}>
              <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-1.5 py-1 lg:px-3 lg:py-1.5 flex items-center gap-1 lg:gap-1.5">
                <img src={slides[currentSlide].countryIcon} alt={`${slides[currentSlide].country} Flag`} className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                <div>
                  <p className="text-[7px] lg:text-[9px] text-gray-400">From</p>
                  <p className="text-[9px] lg:text-[11px] font-semibold text-gray-900">{slides[currentSlide].country}</p>
                </div>
              </div>
              {/* Slide 4: Dimension badge */}
              {currentSlide === 3 && slides[currentSlide].locationDetails && (
                <div className="mt-1.5 flex justify-center">
                  <img src={slides[currentSlide].locationDetails} alt="Dimensions" className="h-5 lg:h-6" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Want to know more link - Mobile */}
      <div className="lg:hidden text-center px-6 py-6">
        <a
          href="#"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Want to <span className="underline">know more about BAO Afrik ?</span>
        </a>
      </div>

      <footer className="px-6 lg:px-16 py-8 lg:py-3">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Footer */}
          <div className="lg:hidden flex flex-col items-center text-center gap-6">
            {/* Social */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-light">
                FOLLOW US
              </p>
              <div className="flex items-center justify-center gap-4">
                <a href="https://www.linkedin.com/company/baoafrik/" className="hover:opacity-70 transition-opacity" target='_blank'>
                  <img src={LinkedInIcon} alt="LinkedIn" className="w-7 h-7 opacity-60" />
                </a>
                <a href="https://www.facebook.com/share/1BUhVwdrDZ/?mibextid=wwXIfr" className="hover:opacity-70 transition-opacity" target='_blank'>
                  <img src={FacebookIcon} alt="Facebook" className="w-7 h-7 opacity-60" />
                </a>
                <a href="https://www.instagram.com/baoafrik?igsh=MWFiamFzenNiaGZ4bQ%3D%3D&utm_source=qr" className="hover:opacity-70 transition-opacity" target='_blank'>
                  <img src={InstagramIcon} alt="Instagram" className="w-7 h-7 opacity-60" />
                </a>
                <a href="https://www.tiktok.com/@baoafrik?_r=1&_t=ZN-91fAWXYNOEB" className="hover:opacity-70 transition-opacity" target='_blank'>
                  <img src={TikTokIcon} alt="TikTok" className="w-7 h-7 opacity-60" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center gap-3 text-sm text-gray-400 font-light">
              <a href="#" className="hover:text-gray-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                Terms and conditions of use
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                Get in touch
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-400 font-light">
              © All rights reserved Bao Afrik 2025
            </p>
          </div>

          {/* Desktop Footer */}
          <div className="hidden lg:flex items-center justify-between gap-6">
            {/* Left Side - Social */}
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-light">
                FOLLOW US
              </p>
              <div className="flex items-center gap-3">
                <a href="https://www.linkedin.com/company/baoafrik/" className="hover:opacity-70 transition-opacity" target="_blank">
                  <img src={LinkedInIcon} alt="LinkedIn" className="w-7 h-7 opacity-60" />
                </a>
                <a href="https://www.facebook.com/share/1BUhVwdrDZ/?mibextid=wwXIfr" className="hover:opacity-70 transition-opacity" target="_blank">
                  <img src={FacebookIcon} alt="Facebook" className="w-7 h-7 opacity-60" />
                </a>
                <a href="https://www.instagram.com/baoafrik?igsh=MWFiamFzenNiaGZ4bQ%3D%3D&utm_source=qr" className="hover:opacity-70 transition-opacity" target="_blank">
                  <img src={InstagramIcon} alt="Instagram" className="w-7 h-7 opacity-60" />
                </a>
                <a href="https://www.tiktok.com/@baoafrik?_r=1&_t=ZN-91fAWXYNOEB" className="hover:opacity-70 transition-opacity" target="_blank">
                  <img src={TikTokIcon} alt="TikTok" className="w-7 h-7 opacity-60" />
                </a>
              </div>
            </div>

            {/* Right Side - Links & Copyright */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 text-xs text-gray-400 font-light">
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Privacy Policy
                </a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Terms and conditions of use
                </a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Get in touch
                </a>
              </div>
              <p className="text-xs text-gray-400 font-light">
                © All rights reserved Bao Afrik 2025
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComingSoon;
