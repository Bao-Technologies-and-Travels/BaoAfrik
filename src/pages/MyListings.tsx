import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import bagIcon from '../assets/images/pre/bag.svg';
import listIcon from '../assets/images/pre/list.svg';
import gridIcon from '../assets/images/pre/grid.svg';
import lilLogo from '../assets/images/pre/lil.png';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import filterIcon from '../assets/images/pre/filter.png';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import activeIcon from '../assets/images/pre/active.svg';
import inactiveIcon from '../assets/images/pre/inactive.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';

// Import product images
import a1 from '../assets/images/pre/a1.png';
import a2 from '../assets/images/pre/a2.png';
import a3 from '../assets/images/pre/a3.png';
import a4 from '../assets/images/pre/a4.png';
import a5 from '../assets/images/pre/a5.png';
import a6 from '../assets/images/pre/a6.png';
import a7 from '../assets/images/pre/a7.png';
import a8 from '../assets/images/pre/a8.png';
import a9 from '../assets/images/pre/a9.png';
import a10 from '../assets/images/pre/a10.png';
import a11 from '../assets/images/pre/a11.png';
import a12 from '../assets/images/pre/a12.png';

type ViewMode = 'list' | 'grid';

interface Listing {
  id: string;
  title: string;
  image: string;
  status: 'active' | 'inactive';
  rating: number;
  reviews: number;
  price: string;
  currency: string;
  daysLeft?: number;
}

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Mock data - replace with actual data from backend
  const listings = useMemo<Listing[]>(() => [
    { id: '1', title: 'Bonga from Togo', image: a1, status: 'active', rating: 4.8, reviews: 88, price: '678', currency: 'USD' },
    { id: '2', title: 'Coconut Oil Ghana', image: a2, status: 'active', rating: 4.5, reviews: 120, price: '45', currency: 'USD' },
    { id: '3', title: 'Pepper from Benin', image: a3, status: 'inactive', rating: 4.2, reviews: 56, price: '32', currency: 'USD' },
    { id: '4', title: 'Shrimps from Lome', image: a4, status: 'active', rating: 4.9, reviews: 200, price: '67.8', currency: 'USD', daysLeft: 12 },
    { id: '5', title: 'Kinky hair Lagos', image: a5, status: 'active', rating: 4.7, reviews: 150, price: '25', currency: 'USD' },
    { id: '6', title: 'Gold neck Accra', image: a6, status: 'active', rating: 4.6, reviews: 95, price: '38', currency: 'USD', daysLeft: 11 },
    { id: '7', title: 'Baobab nuts Kano', image: a7, status: 'inactive', rating: 4.3, reviews: 78, price: '42', currency: 'USD' },
    { id: '8', title: 'Cowrie bracelets', image: a8, status: 'active', rating: 4.8, reviews: 165, price: '55', currency: 'USD' },
    { id: '9', title: 'Ebony tribal masks', image: a9, status: 'active', rating: 4.9, reviews: 210, price: '89', currency: 'USD' },
    { id: '10', title: 'River pepper Addis', image: a10, status: 'active', rating: 4.7, reviews: 140, price: '72', currency: 'USD' },
    { id: '11', title: 'Desert salt Dakar', image: a11, status: 'active', rating: 4.6, reviews: 110, price: '48', currency: 'USD' },
    { id: '12', title: 'Market mix Cairo', image: a12, status: 'inactive', rating: 4.4, reviews: 85, price: '35', currency: 'USD' },
  ], []);

  const filteredListings = useMemo(() => {
    let filtered = listings;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((listing) =>
        listing.title.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'All Status') {
      filtered = filtered.filter((listing) => {
        if (statusFilter === 'Active') return listing.status === 'active';
        if (statusFilter === 'Inactive') return listing.status === 'inactive';
        return true;
      });
    }

    return filtered;
  }, [listings, searchQuery, statusFilter]);

  const hasResults = filteredListings.length > 0;
  const isSearchActive = searchQuery.trim().length > 0;
  const shouldShowEmptyState = !hasResults;
  const isSearchNoResultsState = shouldShowEmptyState && isSearchActive;
  const totalListings = listings.length;
  const draftCount = 3;
  const currentPage = 1;
  const totalPages = 48;
  const paginationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handlePrimaryCta = () => {
    if (isSearchNoResultsState) {
      setSearchQuery('');
      return;
    }
    navigate('/create-listing');
  };

  const primaryButtonLabel = isSearchNoResultsState ? 'Clear search' : 'Add listing';

  const renderEmptyState = () => (
    <div className="text-center py-6">
      <img
        src={bagIcon}
        alt="Empty listings"
        className="mx-auto mb-4"
        style={{ width: '40px', height: '40px' }}
      />
      <div style={{ maxWidth: '360px' }} className="mx-auto space-y-3">
        <p
          className="text-xs sm:text-sm leading-relaxed"
          style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}
        >
          {isSearchNoResultsState
            ? "We couldn't find any listings that match your search. Try adjusting your keywords or filters."
            : "You don't have any listings yet. Start showcasing your products to millions of buyers!"}
        </p>
        <button
          onClick={handlePrimaryCta}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-normal transition-colors text-sm"
          style={{
            backgroundColor: '#64B5F6',
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {primaryButtonLabel}
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderListingsGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
      {filteredListings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-lg overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden mb-1 sm:mb-2" style={{ borderRadius: '12px' }}>
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
              style={{ borderRadius: '12px' }}
            />
          </div>

          {/* Product Content */}
          <div className="px-2 sm:px-3 pb-2 sm:pb-3">
            {/* Status Badge and More Options */}
            <div className="flex items-center justify-between mb-2">
              {/* Status Badge */}
              <div>
                {listing.daysLeft ? (
                  <div
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: '#FEF6E9',
                      fontSize: '10px'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#FAB951" />
                      <path d="M12 7v5l3 2" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span
                      style={{
                        color: '#FAB951',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {listing.daysLeft} Day left
                    </span>
                  </div>
                ) : (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: listing.status === 'active' ? '#EDFBF0' : '#FFF5F5',
                      fontSize: '10px'
                    }}
                  >
                    <img
                      src={listing.status === 'active' ? activeIcon : inactiveIcon}
                      alt={listing.status}
                      className="w-3 h-3"
                    />
                    <span
                      style={{
                        color: listing.status === 'active' ? '#70E183' : '#FF5151',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {listing.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
              </div>

              {/* More Options Button */}
              <button
                className="w-5 h-5 rounded-full border flex items-center justify-center"
                style={{
                  borderColor: '#B0B0B0',
                  borderWidth: '1.5px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                  <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                  <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                </svg>
              </button>
            </div>

            {/* Product Name */}
            <h3
              className="font-medium mb-1 text-[12px] truncate"
              style={{
                color: '#212121',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {listing.title}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1 mb-2" style={{ alignItems: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FBBC05" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '1px' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style={{ color: '#939393', fontSize: '10px', fontFamily: 'Poppins, sans-serif', lineHeight: '1.2' }}>
                {listing.rating}
              </span>
              <span style={{ color: '#B0B0B0', fontSize: '10px', fontFamily: 'Poppins, sans-serif', lineHeight: '1.2' }}>
                ({listing.reviews} Reviews)
              </span>
            </div>

            {/* Price and Edit Button */}
            <div className="flex items-center justify-between">
              <span
                className="font-semibold"
                style={{
                  color: '#212121',
                  fontSize: '14px',
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}
              >
                {listing.currency} {listing.price}
              </span>
              <button
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: '#F4F4F4',
                  color: '#939393',
                  fontSize: '10px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <img src={pencilIcon} alt="Edit" className="w-2.5 h-2.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => (
    <div className="flex flex-col lg:flex-row items-center gap-6 mt-12 mb-32 w-full">
      <div className="flex-1 flex justify-center w-full">
        <div className="flex items-center gap-3">
          <button
            aria-label="Previous page"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#F0F0F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center" style={{ gap: '20px' }}>
            {paginationNumbers.map((page) => (
              <span
                key={page}
                style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: '20px',
                  color: page === currentPage ? '#212121' : '#B0B0B0'
                }}
              >
                {page}
              </span>
            ))}

            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '20px' }}>…</span>
            <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '20px' }}>{totalPages}</span>
          </div>

          <button
            aria-label="Next page"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#F0F0F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
            fontSize: '12px'
          }}
        >
          Go
        </button>
      </div>
    </div>
  );

  const breadcrumbStyle = { color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' };
  const toggleIconFilters = {
    active: 'brightness(0) saturate(100%) invert(64%) sepia(21%) saturate(900%) hue-rotate(173deg) brightness(96%) contrast(96%)',
    inactive: 'brightness(0) saturate(100%) invert(84%) sepia(9%) saturate(644%) hue-rotate(177deg) brightness(104%) contrast(91%)'
  };

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex-1">
          <div className="max-w-6xl mx-auto w-full pl-0 pr-0 py-8 flex flex-col lg:flex-row lg:justify-between gap-8">
            <div className="flex-1 lg:pl-0 lg:-ml-16">
              <nav className="flex items-center space-x-2 text-xs sm:text-sm mb-8" style={breadcrumbStyle}>
                <img
                  src={arrowLeftIcon}
                  alt="Back"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => navigate('/')}
                />
                <span
                  className="hover:text-[#64B5F6] cursor-pointer"
                  onClick={() => navigate('/')}
                >
                  Homepage
                </span>
                <span style={{ color: '#BABABA' }}>·</span>
                <span>Menu</span>
                <span style={{ color: '#BABABA' }}>·</span>
                <span style={{ color: '#4D4D4D' }}>My listings</span>
              </nav>

              <div>
                <h1
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: '#1E1E1E', fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                  Manage your listings
                </h1>
                <p
                  className="text-[11px] sm:text-xs mt-2 max-w-3xl leading-relaxed"
                  style={{ color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' }}
                >
                  Manage product listings easily. Add items, update details, and track metrics
                  <span className="block">
                    to improve sales. Start by adding a listing or auditing inventory.
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full lg:w-80 flex flex-col items-end gap-3 lg:pr-0 lg:-mr-6">
              <div
                className="inline-flex items-center border mb-4 overflow-hidden"
                style={{ borderColor: '#B8DDFB', backgroundColor: '#FFFFFF', borderRadius: '8px' }}
              >
                {(['list', 'grid'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className="flex items-center justify-center px-3 py-2 transition-colors flex-1"
                    style={{
                      backgroundColor: viewMode === mode ? '#CFE8FC' : 'transparent'
                    }}
                  >
                    <img
                      src={mode === 'list' ? listIcon : gridIcon}
                      alt={`${mode} view`}
                      style={{
                        filter: viewMode === mode ? toggleIconFilters.active : toggleIconFilters.inactive
                      }}
                    />
                  </button>
                ))}
              </div>

              <div className="w-[90%]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search a listing ?"
                  style={{
                    backgroundColor: isSearchFocused ? '#FFFFFF' : '#F1F1F1',
                    color: '#1E1E1E',
                    borderRadius: '8px',
                    border: isSearchFocused ? '1px solid #CFE8FC' : '1px solid transparent',
                    caretColor: '#64B5F6',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    transition: 'all 0.2s ease'
                  }}
                  className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CFE8FC] placeholder-[#B2B2B2]"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>
          </div>

          {/* Filters and Action Buttons Bar */}
          {!shouldShowEmptyState && (
            <div className="max-w-6xl mx-auto w-full pl-0 pr-0 mt-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-0 lg:pl-0 lg:-ml-16 w-full">
                {/* Left Side - Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* All Listings Badge */}
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#B0B0B0', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
                      All listings
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: '#F1F1F1',
                        color: '#939393',
                        fontSize: '12px',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {totalListings}
                    </span>
                  </div>

                  {/* Sort By Filter */}
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: '#FAFAFA',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <img src={filterIcon} alt="Filter" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(70%)' }} />
                    <span style={{ color: '#939393', fontSize: '13px' }}>Sort by</span>
                    <img src={arrowDownIcon} alt="Arrow" className="w-3 h-3" style={{ filter: 'brightness(0) saturate(100%) invert(40%)' }} />
                  </button>

                  {/* Status Filter */}
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: '#FAFAFA',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <span style={{ color: '#939393', fontSize: '13px' }}>{statusFilter}</span>
                    <img src={arrowDownIcon} alt="Arrow" className="w-3 h-3" style={{ filter: 'brightness(0) saturate(100%) invert(60%)' }} />
                  </button>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto sm:self-center lg:ml-auto lg:pr-0 lg:-mr-10">
                  {/* Drafts Button */}
                  <button
                    className="flex items-center space-x-2 px-3 py-1 rounded-xl border"
                    style={{
                      backgroundColor: '#F0F8FE',
                      borderColor: '#CFE8FC',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <img src={draftsIcon} alt="Drafts" className="w-4 h-4" />
                    <span className="font-medium text-xs" style={{ color: '#64B5F6' }}>
                      Drafts
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: '#CFE8FC', color: '#64B5F6', fontSize: '0.72rem' }}
                    >
                      {draftCount}
                    </span>
                  </button>

                  {/* Add Listing Button */}
                  <button
                    onClick={handlePrimaryCta}
                    className="inline-flex items-center justify-center gap-2 px-5 py-1 rounded-xl font-normal transition-colors text-sm"
                    style={{
                      backgroundColor: '#64B5F6',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Add listing
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listings Grid or Empty State */}
          <div className="max-w-6xl mx-auto w-full pl-0 pr-0 mt-4 mb-6">
            <div className="pl-0 lg:pl-0 lg:-ml-16">
              {shouldShowEmptyState ? renderEmptyState() : renderListingsGrid()}
            </div>
          </div>
          {!shouldShowEmptyState && (
            <div className="max-w-6xl mx-auto w-full pl-0 pr-0">
              <div className="pl-0 lg:pl-0 lg:-ml-16">
                {renderPagination()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs space-y-3 sm:space-y-0" style={{ color: '#BABABA' }}>
              <div className="flex items-center space-x-1.5">
                <img src={lilLogo} alt="Bao Afrik" className="w-5 h-5" />
                <span>©</span>
                <span className="text-[11px]">All rights reserved</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <Link to="/contact" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Contact Us</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/terms" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Terms and conditions of use</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/privacy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Privacy policies</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/cookies" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MyListings;
