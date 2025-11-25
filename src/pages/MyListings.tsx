import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import bagIcon from '../assets/images/pre/bag.svg';
import listIcon from '../assets/images/pre/list.svg';
import gridIcon from '../assets/images/pre/grid.svg';
import lilLogo from '../assets/images/pre/lil.png';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';

type ViewMode = 'list' | 'grid';
interface Listing {
  id: string;
  title: string;
}

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data until listings are connected to backend
  const listings = useMemo<Listing[]>(() => [], []);
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const query = searchQuery.toLowerCase();
    return listings.filter((listing: { title: string }) =>
      listing.title.toLowerCase().includes(query)
    );
  }, [listings, searchQuery]);

  const hasResults = filteredListings.length > 0;
  const isSearchActive = searchQuery.trim().length > 0;
  const shouldShowEmptyState = !hasResults;
  const isSearchNoResultsState = shouldShowEmptyState && isSearchActive;

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
            : "You don’t have any listings yet. Start showcasing your products to millions of buyers!"}
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
                    backgroundColor: '#F1F1F1',
                    color: '#1E1E1E',
                    borderRadius: '8px',
                    border: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px'
                  }}
                  className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CFE8FC] placeholder-[#B2B2B2]"
                />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-0">
            {shouldShowEmptyState ? renderEmptyState() : null}
          </div>
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

