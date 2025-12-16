import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import earthIcon from '../assets/images/pre/earth.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import buyerIcon from '../assets/images/pre/buyer.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import bellIcon from '../assets/images/pre/bm.svg';
import shareIcon from '../assets/images/pre/Share.svg';
import requestIcon from '../assets/images/pre/request.svg';

const Requests: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 48;
  const paginationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [moreOptionsOpenFor, setMoreOptionsOpenFor] = useState<string | null>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setMoreOptionsOpenFor(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderPagination = () => (
    <div className={`flex flex-col ${isMobile ? 'items-center gap-4' : 'lg:flex-row items-center gap-6'} mt-12 ${isMobile ? 'mb-8' : 'mb-16'} w-full`}>
      <div className={`flex-1 flex justify-center w-full ${isMobile ? '' : ''}`}>
        <div className={`flex items-center gap-4 ${isMobile ? '' : ''}`} style={isMobile ? {} : { marginLeft: '80px' }}>
          <button
            aria-label="Previous page"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F0F0F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center" style={{ gap: '24px' }}>
            {paginationNumbers.map((page) => (
              <span
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: '16px',
                  color: page === currentPage ? '#212121' : '#B0B0B0',
                  cursor: 'pointer'
                }}
              >
                {page}
              </span>
            ))}

            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '16px' }}>…</span>
            <span 
              onClick={() => setCurrentPage(totalPages)}
              style={{ 
                color: '#B0B0B0', 
                fontFamily: 'Bricolage Grotesque, sans-serif', 
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              {totalPages}
            </span>
          </div>

          <button
            aria-label="Next page"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F0F0F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Go to section */}
      <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
        <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>Go to :</span>
        <input
          type="text"
          placeholder="e.g 40"
          style={{
            border: '1px solid #BABABA',
            borderRadius: '8px',
            padding: '6px 10px',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: '12px',
            color: '#D9D9D9',
            width: '64px',
            textAlign: 'center'
          }}
        />
        <button
          style={{
            backgroundColor: '#212121',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '6px 14px',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: '12px',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          Go
        </button>
      </div>
    </div>
  );

  const renderRequestCard = (isPending: boolean = false, cardId: string = '', productData?: { title: string; country: string; flag: string; location: string; isPending?: boolean }) => {
    const defaultProduct = {
      title: 'Snails from South Africa',
      country: 'South Africa',
      flag: 'https://flagcdn.com/w20/za.png',
      location: 'London, United Kingdom'
    };
    const product = productData || defaultProduct;
    const cardIsPending = productData?.isPending !== undefined ? productData.isPending : isPending;
    
    return (
    <div 
      className="bg-white hover:shadow-md transition-shadow"
      style={{ 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
        height: 'auto',
        width: isMobile ? '260px' : 'auto',
        flexShrink: isMobile ? 0 : 'initial',
        padding: isMobile ? '10px' : '16px',
        borderRadius: '20px'
      }}
    >
      {/* Product Name Label and Button - Desktop only */}
      {!isMobile && (
        <div className="flex items-center justify-between mb-2">
          <span 
            style={{ 
              fontSize: '10px', 
              color: '#BABABA',
              border: '1px solid #E1E1E1',
              borderRadius: '999px',
              padding: '2px 8px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Request
          </span>
          {cardIsPending ? (
            <div className="flex items-center gap-2">
              <div 
                className="px-2 py-0.5 rounded-md"
                style={{ 
                  backgroundColor: '#F4F4F4',
                  fontSize: '10px',
                  color: '#6A6A6A',
                  fontWeight: 'normal',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Pending
              </div>
              <div style={{ position: 'relative' }} ref={moreOptionsRef}>
                <button
                  type="button"
                  className="w-5 h-5 rounded-full border flex items-center justify-center"
                  style={{
                    borderColor: '#B0B0B0',
                    borderWidth: '1.5px',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreOptionsOpenFor(moreOptionsOpenFor === cardId ? null : cardId);
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                    <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                    <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                  </svg>
                </button>
                {moreOptionsOpenFor === cardId && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '26px',
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E9E9E9',
                      boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                      padding: '6px',
                      minWidth: '150px',
                      zIndex: 1000
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        color: '#212121'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#F9A825',
                  color: '#F9A825',
                  fontWeight: 'normal', 
                  fontSize: '11px',
                  fontFamily: 'Poppins, sans-serif',
                  height: '26px',
                  width: 'auto'
                }}
              >
                <img src={requestIcon} alt="Request" style={{ width: '12px', height: '12px' }} />
                Manage request
              </button>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#F4F4F4',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <img 
                  src={shareIcon} 
                  alt="Share" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                  }} 
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Name Label Only - Mobile */}
      {isMobile && (
        <div className="mb-1">
          <span 
            style={{ 
              fontSize: '9px', 
              color: '#BABABA',
              border: '1px solid #E1E1E1',
              borderRadius: '999px',
              padding: '2px 6px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Request
          </span>
        </div>
      )}

      {/* Product Title */}
      <h3 className="mb-2 sm:mb-3" style={{ fontSize: isMobile ? '11px' : '14px', fontWeight: '500', color: '#212121' }}>
        {product.title}
      </h3>

      {/* Description */}
      <p className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '7px' : '10px', color: '#6A6A6A', lineHeight: '1.5', fontWeight: 'normal' }}>
        Premium white pepper sourced from the fertile soils of Africa. Known for its mild aromatic heat and rich flavour, it adds an authentic touch of home to your dishes, perfect for the diaspora seeking a taste.
      </p>

      {/* Tags and User Info Row - Desktop/Tablet */}
      {!isMobile && (
        <div className="flex items-end justify-between">
          {/* Tags - Stacked Layout */}
          <div className="flex flex-col gap-2">
            {/* First Row - Location */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1"
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '999px', 
                width: 'fit-content',
                border: '1px solid #E1E1E1'
              }}
            >
              <img 
                src={locationIcon} 
                alt="Location"
                className="w-3 h-3"
                style={{ filter: 'brightness(0) saturate(100%) invert(70%) sepia(99%) saturate(1352%) hue-rotate(349deg) brightness(102%) contrast(97%)' }}
              />
              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{product.location}</span>
            </div>

            {/* Second Row - Price and Country */}
            <div className="flex gap-2">
              {/* Price Tag */}
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '999px',
                  border: '1px solid #E1E1E1'
                }}
              >
                <img 
                  src={moneyIcon} 
                  alt="Money"
                  className="w-3 h-3"
                  style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                />
                <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>50 - 100 USD</span>
              </div>

              {/* Country Tag */}
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '999px',
                  border: '1px solid #E1E1E1'
                }}
              >
                <img 
                  src={product.flag} 
                  alt={product.country}
                  className="w-4 h-4 object-cover rounded-full"
                />
                <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{product.country}</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center mt-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
              style={{ 
                backgroundColor: '#F7C9B0',
                border: '2px solid #939393'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C"/>
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C"/>
              </svg>
            </div>
            <div 
              className="flex items-center justify-center gap-0.5 px-1.5 py-0.5 border -mt-2"
              style={{ borderColor: '#F4F4F4', backgroundColor: '#FFFFFF', borderRadius: '12px' }}
            >
              <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span style={{ fontSize: '10px', color: '#212121', fontWeight: '500' }}>4.3</span>
            </div>
          </div>
        </div>
      )}

      {/* Tags - Mobile Only */}
      {isMobile && (
        <div className="flex flex-col gap-2 mb-3">
          {/* First Row - Location */}
          <div 
            className="flex items-center gap-1.5 px-2 py-0.5"
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '999px', 
              width: 'fit-content',
              border: '1px solid #E1E1E1'
            }}
          >
            <img 
              src={locationIcon} 
              alt="Location"
              style={{ 
                width: '9px',
                height: '9px',
                filter: 'brightness(0) saturate(100%) invert(70%) sepia(99%) saturate(1352%) hue-rotate(349deg) brightness(102%) contrast(97%)'
              }}
            />
            <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{product.location}</span>
          </div>

          {/* Second Row - Price and Country */}
          <div className="flex gap-2">
            {/* Price Tag */}
            <div 
              className="flex items-center gap-1.5 px-2 py-0.5"
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '999px',
                border: '1px solid #E1E1E1'
              }}
            >
              <img 
                src={moneyIcon} 
                alt="Money"
                style={{ 
                  width: '9px',
                  height: '9px',
                  filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
                }}
              />
              <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>50 ~ 100 USD</span>
            </div>

            {/* Country Tag */}
            <div 
              className="flex items-center gap-1.5 px-2 py-0.5"
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '999px',
                border: '1px solid #E1E1E1'
              }}
            >
              <img 
                src={product.flag} 
                alt={product.country}
                style={{ 
                  width: '11px',
                  height: '11px',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
              <span style={{ fontSize: '8px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>{product.country}</span>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Section - Mobile (New Layout) */}
      {isMobile && (
        <>
          {/* Gray Divider */}
          <div style={{ width: '100%', height: '0.5px', backgroundColor: '#E4E4E4', marginBottom: '8px' }}></div>
          
          <div className="flex items-center justify-between">
            {/* Left: Avatar and User Info */}
            <div className="flex items-center gap-2">
              <div 
                className="rounded-full flex items-center justify-center overflow-hidden"
                style={{ 
                  backgroundColor: '#F7C9B0',
                  width: '24px',
                  height: '24px',
                  border: '2px solid #939393'
                }}
              >
                <svg 
                  style={{ width: '14px', height: '14px' }} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C"/>
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span style={{ fontSize: '7px', color: '#BABABA', fontWeight: 'normal' }}>User profile</span>
                <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500' }}>Seraphin DIKOUM</span>
              </div>
            </div>

            {/* Right: Rating */}
            <div className="flex items-center gap-0.5">
              <svg 
                className="text-yellow-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                style={{ width: '8px', height: '8px' }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500' }}>4.3</span>
            </div>
          </div>
        </>
      )}

      {/* Respond to the request button - Mobile only */}
      {isMobile && (
        <button 
          className="w-full mt-3 text-white"
          style={{ 
            backgroundColor: '#F9A825', 
            fontWeight: 'normal', 
            fontSize: '9px',
            padding: '6px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Respond to the request
        </button>
      )}
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Breadcrumbs */}
      <div className="hidden lg:block bg-white" style={{ paddingTop: '24px', paddingBottom: '4px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginLeft: '-4px' }}>
          <nav className="flex items-center space-x-2" style={{ fontSize: '13px' }}>
            <img 
              src={arrowLeftIcon} 
              alt="Back" 
              className="cursor-pointer hover:opacity-80 transition-opacity" 
              style={{ width: '14px', height: '14px' }}
              onClick={() => navigate('/')}
            />
            <Link to="/" className="hover:opacity-80 transition-opacity" style={{ color: '#BABABA' }}>
              Homepage
            </Link>
            <span style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
            <span 
              className="hover:opacity-80 transition-opacity cursor-pointer" 
              style={{ color: '#BABABA' }}
              onClick={() => navigate('/', { state: { openMenu: true } })}
            >
              Menu
            </span>
            <span style={{ color: '#BABABA', fontSize: '17px', lineHeight: 1 }}>·</span>
            <span className="font-medium" style={{ color: '#212121' }}>
              Requests
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 px-6 sm:px-8 lg:px-16" style={{ paddingBottom: isMobile ? '32px' : '48px' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={isMobile ? "flex flex-col mb-6 sm:mb-8" : "flex items-start justify-between mb-6 sm:mb-8"}>
            <div className="flex-1">
              <h2 className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '20px' : '44px', fontWeight: '500', lineHeight: '1.2' }}>
                <span style={{ color: '#212121' }}>Buy & Sell </span>
                <span style={{ 
                  background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Instantly
                </span>
              </h2>
              <p style={{ fontSize: isMobile ? '9px' : '16px', color: '#9C9C9C', maxWidth: isMobile ? '220px' : '600px', lineHeight: '1.6' }}>
                Turn unmet needs into instant deals, discover what people are looking for, grab it, and sell it right where demand begins
              </p>
            </div>
            {/* Search Bar */}
            <div style={{ width: isMobile ? '100%' : '380px', marginTop: isMobile ? '16px' : '0' }}>
              <div className="relative flex items-center">
                <img 
                  src={locationIcon} 
                  alt="Location"
                  className="absolute left-3"
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Buyer location ?"
                  className="w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E4E4',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: isMobile ? '10px' : '14px',
                    color: '#D9D9D9',
                    padding: isMobile ? '6px 50px 6px 32px' : '10px 112px 10px 40px'
                  }}
                />
                <div 
                  className="absolute right-2 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#F9A825',
                    height: isMobile ? '20px' : '28px',
                    paddingLeft: isMobile ? '10px' : '18px',
                    paddingRight: isMobile ? '10px' : '18px',
                    borderRadius: '8px'
                  }}
                >
                  <img src={buyerIcon} alt="Search" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Requests near you Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ 
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: isMobile ? '14px' : '18px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Requests near you
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{ 
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 7px' : '7px 10px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <span style={{ color: '#BABABA', fontSize: isMobile ? '10px' : '14px', fontWeight: 'normal' }}>Filter :</span>
                  <img src={earthIcon} alt="Globe" style={{ width: isMobile ? '16px' : '22px', height: isMobile ? '16px' : '22px' }} />
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>Africa</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
                <button 
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{ 
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 8px' : '7px 14px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <span style={{ color: '#BABABA', fontSize: isMobile ? '10px' : '14px', fontWeight: 'normal' }}>Price :</span>
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>All</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
              </div>
            </div>
            <div className="relative">
              {/* Fade effect on the right - Desktop only */}
              {!isMobile && (
                <div 
                  className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                    height: 'calc(100% - 4rem)'
                  }}
                />
              )}
              <div 
                className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                style={isMobile ? { 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                } : {}}
              >
                {[
                  { title: 'Premium Coffee Beans', country: 'Ethiopia', flag: 'https://flagcdn.com/w20/et.png', location: 'New York, USA' },
                  { title: 'Traditional Kente Fabric', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Paris, France' },
                  { title: 'Shea Butter Products', country: 'Nigeria', flag: 'https://flagcdn.com/w20/ng.png', location: 'Toronto, Canada' }
                ].map((product, index) => (
                  <React.Fragment key={index}>
                    {renderRequestCard(false, `near-${index}`, product)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Pending requests Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ 
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: isMobile ? '14px' : '18px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Pending requests
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{ 
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 7px' : '7px 10px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <span style={{ color: '#BABABA', fontSize: isMobile ? '10px' : '14px', fontWeight: 'normal' }}>Filter :</span>
                  <img src={earthIcon} alt="Globe" style={{ width: isMobile ? '16px' : '22px', height: isMobile ? '16px' : '22px' }} />
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>Africa</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
                <button 
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{ 
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 8px' : '7px 14px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <span style={{ color: '#BABABA', fontSize: isMobile ? '10px' : '14px', fontWeight: 'normal' }}>Price :</span>
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>All</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
              </div>
            </div>
            <div className="relative">
              {/* Fade effect on the right - Desktop only */}
              {!isMobile && (
                <div 
                  className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                    height: 'calc(100% - 4rem)'
                  }}
                />
              )}
              <div 
                className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                style={isMobile ? { 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                } : {}}
              >
                {[
                  { title: 'African Black Soap', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Berlin, Germany' },
                  { title: 'Baobab Powder', country: 'Senegal', flag: 'https://flagcdn.com/w20/sn.png', location: 'Sydney, Australia' },
                  { title: 'Moroccan Argan Oil', country: 'Morocco', flag: 'https://flagcdn.com/w20/ma.png', location: 'Dubai, UAE' }
                ].map((product, index) => (
                  <React.Fragment key={index}>
                    {renderRequestCard(true, `pending-${index}`, product)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* All requests Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ 
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: isMobile ? '14px' : '18px',
                fontWeight: '500',
                color: '#000000'
              }}>
                All requests
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{ 
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 7px' : '7px 10px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <span style={{ color: '#BABABA', fontSize: isMobile ? '10px' : '14px', fontWeight: 'normal' }}>Filter :</span>
                  <img src={earthIcon} alt="Globe" style={{ width: isMobile ? '16px' : '22px', height: isMobile ? '16px' : '22px' }} />
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>Africa</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
                <button 
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{ 
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 8px' : '7px 14px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <span style={{ color: '#BABABA', fontSize: isMobile ? '10px' : '14px', fontWeight: 'normal' }}>Price :</span>
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>All</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
              </div>
            </div>
            <div className="relative">
              {/* Fade effect on the right - Desktop only */}
              {!isMobile && (
                <div 
                  className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to left, white 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)',
                    height: 'calc(100% - 4rem)'
                  }}
                />
              )}
              <div 
                className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
                style={isMobile ? { 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                } : {}}
              >
                {[
                  { title: 'Premium Coffee Beans', country: 'Ethiopia', flag: 'https://flagcdn.com/w20/et.png', location: 'New York, USA', isPending: false },
                  { title: 'African Black Soap', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Berlin, Germany', isPending: true },
                  { title: 'Traditional Kente Fabric', country: 'Ghana', flag: 'https://flagcdn.com/w20/gh.png', location: 'Paris, France', isPending: false },
                  { title: 'Baobab Powder', country: 'Senegal', flag: 'https://flagcdn.com/w20/sn.png', location: 'Sydney, Australia', isPending: true },
                  { title: 'Shea Butter Products', country: 'Nigeria', flag: 'https://flagcdn.com/w20/ng.png', location: 'Toronto, Canada', isPending: false },
                  { title: 'Moroccan Argan Oil', country: 'Morocco', flag: 'https://flagcdn.com/w20/ma.png', location: 'Dubai, UAE', isPending: true }
                ].map((product, index) => (
                  <React.Fragment key={index}>
                    {renderRequestCard(product.isPending || false, `all-${index}`, { ...product, isPending: product.isPending })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>
      </section>
    </div>
  );
};

export default Requests;

