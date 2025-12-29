import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import earthIcon from '../assets/images/pre/earth.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import buyerIcon from '../assets/images/pre/buyer.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import moneyIcon from '../assets/images/pre/money.svg';
import bellIcon from '../assets/images/pre/bm.svg';

import { apiClient } from '../services';
import { getProductCountry } from '../utils/countryHelpers';
import { format } from 'date-fns';

interface ProductRequest {
  id: string;
  productName: string;
  description: string;
  origin: string;
  sellerLocation: string;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED' | string;
  createdAt: string;
  userId: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

const Requests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProductRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ProductRequest[]>([]);
  const [nearYouRequests, setNearYouRequests] = useState<ProductRequest[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [goToPage, setGoToPage] = useState<number>(1);
  const [isManagingRequest, setIsManagingRequest] = useState(false);

  // check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // fetch requests
  useEffect(() => {
    fetchMyRequests();
  }, []);

  useEffect(() => {
    setFilteredRequests(paginate(requests, currentPage, 9));
    setTotalPages(Math.max(1, Math.ceil(requests.length / 9)));
    setPendingRequests(
      requests.filter((r) => r.status && r.status.toLowerCase() === 'pending')
    );
    if (user && user.location) {
      setNearYouRequests(
        requests.filter(
          (r) =>
            user && user.location && r.sellerLocation &&
            r.sellerLocation.toLowerCase().includes(user.location.toLowerCase())
        )
      );
    } else {
      setNearYouRequests([]);
    }
  }, [requests, currentPage, user]);

  function paginate(array: ProductRequest[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    return array.slice(start, start + pageSize);
  }

  const handleManageRequest = async (request: ProductRequest) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      // If current user is the request creator, navigate to request details
      if (request.userId === user.id) {
        navigate(`/requests/${request.id}`);
        return;
      }

      setIsManagingRequest(true);
      const token = localStorage.getItem('accessToken');

      // Create product data from request
      const productData = {
        id: request.id,
        name: request.productName,
        description: request.description,
        origin: request.origin,
        sellerLocation: request.sellerLocation,
        price: request.minPrice || 0,
        currency: request.currency || 'USD',
        isRequest: true,
        requestData: {
          minPrice: request.minPrice,
          maxPrice: request.maxPrice,
          status: request.status
        },
        seller: request.user ? {
          id: request.user.id,
          email: request.user.email,
          name: `${request.user.firstName} ${request.user.lastName}`.trim(),
          profileImage: request.user.profileImage
        } : null
      };

      // Start a conversation with the request creator using the contact-request endpoint
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/contact-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId: request.id,
            message: `Hi, I have this product you requested for: ${request.productName}`,
            productData: productData
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start conversation');
      }

      // Navigate to messages with the new conversation
      navigate('/messages', {
        state: {
          conversationId: result.data.conversation.id,
          productData: productData,
          preFilledMessage: `Hi, I have this product you requested for: ${request.productName}`,
          isProductInquiry: true,
          shouldOpenConversation: true
        },
        replace: false
      });

    } catch (error: any) {
      console.error('Error managing request:', error);
      // Show error toast or alert
      alert(error.message || 'Failed to manage request. Please try again.');
    } finally {
      setIsManagingRequest(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<any>('/request');
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    try {
      await apiClient.delete(`/request/${requestToDelete}`);
      setRequests(requests.filter(req => req.id !== requestToDelete));
      setShowDeleteModal(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    // Generate pagination numbers
    const paginationNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      paginationNumbers.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        paginationNumbers.push(i);
      }
    }

    // Delete Confirmation Modal
    const DeleteConfirmationModal = () => {
      if (!showDeleteModal) return null;
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete Request</h3>
            <p className="mb-6">Are you sure you want to delete this request? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRequestToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDelete();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    };

    // Pagination Component
    const Pagination = () => {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      );
    };

    if (loading && requests.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col ${isMobile ? 'items-center gap-4' : 'lg:flex-row items-center gap-6'} mt-12 ${isMobile ? 'mb-16' : 'mb-32'} w-full`}>
        <div className={`flex-1 flex justify-center w-full`}>
          <div className={`flex items-center gap-4`} style={isMobile ? {} : { marginLeft: '80px' }}>
            <button
              aria-label="Previous page"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: '28px',
                height: '28px',
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
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    fontSize: '14px',
                    color: page === currentPage ? '#212121' : '#B0B0B0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {page}
                </button>
              ))}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span style={{ color: '#B0B0B0' }}>…</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '14px',
                      color: '#B0B0B0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              aria-label="Next page"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: '28px',
                height: '28px',
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={currentPage === totalPages ? '#8C8C8C' : '#212121'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Go to section - directly under pagination on mobile */}
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
          <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>Go to :</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={goToPage}
            onChange={(e) => setGoToPage(parseInt(e.target.value) || 1)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = Math.min(Math.max(1, goToPage), totalPages);
                handlePageChange(page);
                setGoToPage(page);
              }
            }}
            placeholder="e.g 40"
            style={{
              border: '1px solid #BABABA',
              borderRadius: '8px',
              padding: '6px 10px',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: '12px',
              color: '#212121',
              width: '64px',
              textAlign: 'center'
            }}
          />
          <button
            onClick={() => {
              const page = Math.min(Math.max(1, goToPage), totalPages);
              handlePageChange(page);
              setGoToPage(page);
            }}
            style={{
              backgroundColor: '#212121',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '6px 14px',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Go
          </button>
        </div>
      </div>
    );
  };

  const renderRequestCard = (isPending: boolean = false, req?: ProductRequest) => (
    <div
      className="bg-white rounded-xl hover:shadow-md transition-shadow"
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        height: 'auto',
        width: isMobile ? '260px' : 'auto',
        flexShrink: isMobile ? 0 : 'initial',
        padding: isMobile ? '10px' : '16px'
      }}
    >
      {/* Product Name Label and Button - Desktop only */}
      {!isMobile && (
        <div className="flex items-center justify-between mb-0">
          <span style={{ fontSize: '12px', color: '#9C9C9C' }}>Request</span>
          {isPending ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
              <span style={{ fontSize: '12px', color: '#6A6A6A', fontWeight: 'normal' }}>Pending</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded-lg border flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#F9A825',
                  color: '#F9A825',
                  fontWeight: 'normal',
                  fontSize: '12px',
                  minWidth: '110px',
                  opacity: isManagingRequest ? 0.7 : 1,
                  cursor: isManagingRequest ? 'not-allowed' : 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isManagingRequest && req) {
                    handleManageRequest(req);
                  }
                }}
                disabled={isManagingRequest}
              >
                {isManagingRequest ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Manage request'}
              </button>
              <img src={bellIcon} alt="Bell" style={{ width: '16px', height: '16px' }} />
            </div>
          )}
        </div>
      )}

      {/* Product Name Label Only - Mobile */}
      {isMobile && (
        <div className="mb-1">
          <span style={{ fontSize: '9px', color: '#9C9C9C' }}>Request</span>
        </div>
      )}

      {/* Product Title */}
      <h3 className="mb-2 sm:mb-3" style={{ fontSize: isMobile ? '11px' : '14px', fontWeight: '500', color: '#212121' }}>
        {req ? req.productName : ''}
      </h3>

      {/* Description */}
      <p className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '7px' : '10px', color: '#6A6A6A', lineHeight: '1.5', fontWeight: 'normal' }}>
        {req ? req.description : ''}
      </p>

      {/* Tags and User Info Row - Desktop/Tablet */}
      {!isMobile && (
        <div className="flex items-end justify-between">
          {/* Tags - Stacked Layout */}
          <div className="flex flex-col gap-2">
            {/* First Row - Location */}
            <div
              className="flex items-center gap-1 px-2 py-1"
              style={{ backgroundColor: '#F0F8FE', borderRadius: '6px', width: 'fit-content' }}
            >
              <img
                src={locationIcon}
                alt="Location"
                className="w-3 h-3"
                style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
              />
              <span style={{ fontSize: '12px', color: '#64B5F6' }}>{req ? req.sellerLocation : ''}</span>
            </div>

            {/* Second Row - Price and Country */}
            <div className="flex gap-2">
              {/* Price Tag */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5"
                style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
              >
                <img
                  src={moneyIcon}
                  alt="Money"
                  className="w-3 h-3"
                  style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)' }}
                />
                <span style={{ fontSize: '12px', color: '#64B5F6' }}>{req ? `${req.minPrice ?? ''} - ${req.maxPrice ?? ''} ${req.currency ?? ''}` : ''}</span>
              </div>

              {/* Country Tag */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5"
                style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
              >
                {(() => {
                  const country = getProductCountry(req?.origin);
                  return (
                    <>
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-4 h-3 object-cover rounded-sm"
                      />
                      <span style={{ fontSize: '12px', color: '#64B5F6' }}>{country.name}</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center mt-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: '#F7C9B0' }}
            >
              {req && req.user && req.user.profileImage ? (
                <img
                  src={req.user.profileImage}
                  alt={req.user.firstName || 'User'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                </svg>
              )}
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
            className="flex items-center gap-1 px-2 py-1"
            style={{ backgroundColor: '#F0F8FE', borderRadius: '6px', width: 'fit-content' }}
          >
            <img
              src={locationIcon}
              alt="Location"
              style={{
                width: '9px',
                height: '9px',
                filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
              }}
            />
            <span style={{ fontSize: '8px', color: '#64B5F6', fontWeight: '300' }}>London, United Kingdom</span>
          </div>

          {/* Second Row - Price and Country */}
          <div className="flex gap-2">
            {/* Price Tag */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5"
              style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
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
              <span style={{ fontSize: '8px', color: '#64B5F6', fontWeight: '300' }}>50 ~ 100 USD</span>
            </div>

            {/* Country Tag */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5"
              style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}
            >
              <img
                src={req && req.origin ? `https://flagcdn.com/w20/${req.origin.slice(0, 2).toLowerCase()}.png` : ''}
                alt={req && req.origin ? req.origin : ''}
                style={{
                  width: '11px',
                  height: '8px',
                  objectFit: 'cover',
                  borderRadius: '2px'
                }}
              />
              <span style={{ fontSize: '8px', color: '#64B5F6', fontWeight: '300' }}>South Africa</span>
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
                  height: '24px'
                }}
              >
                <svg
                  style={{ width: '14px', height: '14px' }}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#8B5E3C" />
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#8B5E3C" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span style={{ fontSize: '7px', color: '#BABABA', fontWeight: 'normal' }}>User profile</span>
                <span style={{ fontSize: '8px', color: '#212121', fontWeight: '500' }}>{req && req.user ? `${req.user.firstName ?? ''} ${req.user.lastName ?? ''}` : ''}</span>
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
          className="w-full mt-3 text-white flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#F9A825',
            fontWeight: 'normal',
            fontSize: '9px',
            padding: '6px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: isManagingRequest ? 'not-allowed' : 'pointer',
            opacity: isManagingRequest ? 0.7 : 1
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isManagingRequest && req) {
              handleManageRequest(req);
            }
          }}
          disabled={isManagingRequest}
        >
          {isManagingRequest ? (
            <>
              <svg className="animate-spin h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Respond to the request'}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Breadcrumbs */}
      <div className="hidden lg:block bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="py-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={isMobile ? "flex flex-col mb-6 sm:mb-8" : "flex items-start justify-between mb-6 sm:mb-8"}>
            <div className="flex-1">
              <h2 className="mb-3 sm:mb-4" style={{ fontSize: isMobile ? '20px' : '44px', fontWeight: '600', lineHeight: '1.2' }}>
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
                    filter: 'brightness(0) saturate(100%) invert(64%) sepia(52%) saturate(555%) hue-rotate(176deg) brightness(97%) contrast(92%)'
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
                    color: '#6A6A6A',
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
                fontSize: isMobile ? '18px' : '24px',
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
                    padding: isMobile ? '5px 7px' : '8px 10px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <img src={earthIcon} alt="Globe" style={{ width: isMobile ? '16px' : '22px', height: isMobile ? '16px' : '22px' }} />
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>Africa</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
                <button
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 8px' : '8px 14px',
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
            <div
              className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
              style={isMobile ? {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              } : {}}
            >
              {nearYouRequests.slice(0, isMobile ? 3 : 9).map((req, idx) => (
                <React.Fragment key={req.id || idx}>
                  {renderRequestCard(false, req)}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Pending requests Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: isMobile ? '18px' : '24px',
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
                    padding: isMobile ? '5px 7px' : '8px 10px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <img src={earthIcon} alt="Globe" style={{ width: isMobile ? '16px' : '22px', height: isMobile ? '16px' : '22px' }} />
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>Africa</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
                <button
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 8px' : '8px 14px',
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
            <div
              className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
              style={isMobile ? {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              } : {}}
            >
              {pendingRequests.slice(0, isMobile ? 3 : 9).map((req, idx) => (
                <React.Fragment key={req.id || idx}>
                  {renderRequestCard(true, req)}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* All requests Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: isMobile ? '18px' : '24px',
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
                    padding: isMobile ? '5px 7px' : '8px 10px',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    gap: isMobile ? '4px' : '6px'
                  }}
                >
                  <img src={earthIcon} alt="Globe" style={{ width: isMobile ? '16px' : '22px', height: isMobile ? '16px' : '22px' }} />
                  <span style={{ color: '#6A6A6A', fontSize: isMobile ? '10px' : '14px' }}>Africa</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '12px' : '16px' }} />
                </button>
                <button
                  className="flex items-center border transition-colors hover:bg-gray-50"
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderColor: '#E4E4E4',
                    padding: isMobile ? '5px 8px' : '8px 14px',
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
            <div
              className={isMobile ? "flex gap-4 mb-6 overflow-x-auto scrollbar-hide" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6"}
              style={isMobile ? {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              } : {}}
            >
              {filteredRequests.map((req, idx) => (
                <React.Fragment key={req.id || idx}>
                  {renderRequestCard(false, req)}
                </React.Fragment>
              ))}
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