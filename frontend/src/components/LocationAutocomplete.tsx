import React, { useState, useRef, useEffect } from 'react';

// UK cities and areas – used for client-side autocomplete (no backend required)
const UK_LOCATIONS = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Sheffield',
  'Edinburgh', 'Cardiff', 'Belfast', 'Newcastle upon Tyne', 'Nottingham', 'Southampton', 'Brighton',
  'Leicester', 'Coventry', 'Hull', 'Bradford', 'Stoke-on-Trent', 'Wolverhampton', 'Derby', 'Plymouth',
  'Reading', 'Swansea', 'Portsmouth', 'Milton Keynes', 'Northampton', 'Luton', 'Aberdeen', 'Dundee',
  'York', 'Oxford', 'Cambridge', 'Ipswich', 'Norwich', 'Exeter', 'Cheltenham', 'Gloucester', 'Bath',
  'Bournemouth', 'Poole', 'Swindon', 'Peterborough', 'Lincoln', 'Chester', 'Warrington', 'Preston',
  'Blackpool', 'Lancaster', 'Carlisle', 'Sunderland', 'Middlesbrough', 'Durham', 'Newcastle',
  'South Shields', 'Gateshead', 'Hartlepool', 'Darlington', 'Doncaster', 'Rotherham', 'Barnsley',
  'Huddersfield', 'Wakefield', 'Halifax', 'Blackburn', 'Burnley', 'Rochdale', 'Oldham', 'Bolton',
  'Wigan', 'Warrington', 'St Helens', 'Southport', 'Birkenhead', 'Chester', 'Crewe', 'Shrewsbury',
  'Worcester', 'Hereford', 'Truro', 'Falmouth', 'Penzance', 'Torquay', 'Paignton', 'Taunton',
  'Yeovil', 'Bridgwater', 'Weston-super-Mare', 'Bristol', 'Bath', 'Salisbury', 'Winchester',
  'Basingstoke', 'Andover', 'Southampton', 'Portsmouth', 'Chichester', 'Worthing', 'Eastbourne',
  'Hastings', 'Canterbury', 'Maidstone', 'Rochester', 'Dartford', 'Southend-on-Sea', 'Colchester',
  'Chelmsford', 'Cambridge', 'Ely', 'King\'s Lynn', 'Great Yarmouth', 'Lowestoft', 'Bury St Edmunds',
  'London, United Kingdom', 'Manchester, United Kingdom', 'Birmingham, United Kingdom',
  'Leeds, United Kingdom', 'Glasgow, United Kingdom', 'Liverpool, United Kingdom',
  'Edinburgh, United Kingdom', 'Cardiff, United Kingdom', 'Belfast, United Kingdom',
];

export interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  /** Optional: custom input styles (e.g. for search bar vs form) */
  inputStyle?: React.CSSProperties;
  /** Optional: show label row (icon + "Your location" style) */
  showLabel?: boolean;
  labelText?: string;
  /** Max suggestions to show */
  maxSuggestions?: number;
  /** Called when user selects a suggestion from the list (receives selected value) */
  onSelect?: (selectedValue: string) => void;
  /** Use 'filter' to match search bar filter dropdowns (Categories, Place of Origin) */
  dropdownVariant?: 'default' | 'filter';
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Type area or city',
  id,
  className = '',
  disabled = false,
  inputStyle,
  showLabel = false,
  labelText = 'Your location',
  maxSuggestions = 8,
  onSelect,
  dropdownVariant = 'default',
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = normalizedQuery
    ? UK_LOCATIONS.filter(
        (loc) =>
          loc.toLowerCase().startsWith(normalizedQuery) ||
          loc.toLowerCase().includes(normalizedQuery)
      )
    : UK_LOCATIONS;
  const showList = suggestions.slice(0, maxSuggestions);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: string) => {
    onChange(loc);
    setQuery(loc);
    setIsOpen(false);
    setHighlightIndex(-1);
    onSelect?.(loc);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    setIsOpen(true);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || showList.length === 0) {
      if (e.key === 'Escape') setIsOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i < showList.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : showList.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < showList.length) {
        handleSelect(showList[highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  const handleFocus = () => {
    if (query.trim()) setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>{labelText}</span>
        </div>
      )}
      <input
        type="text"
        id={id}
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className="w-full border rounded-lg focus:outline-none"
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          fontFamily: "'Poppins', sans-serif",
          color: query ? '#212121' : undefined,
          borderColor: isOpen ? '#97CDF9' : '#E4E4E4',
          ...inputStyle,
        }}
      />
      {isOpen && showList.length > 0 && (
        <>
          <style>{`
            .location-autocomplete-list::-webkit-scrollbar {
              display: none;
            }
            .location-autocomplete-list {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <ul
            className="location-autocomplete-list absolute z-50 w-full mt-1 bg-white overflow-y-auto"
            style={
              dropdownVariant === 'filter'
                ? {
                    borderRadius: '28px',
                    boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                    fontFamily: "'Poppins', sans-serif",
                    maxHeight: '280px',
                  }
                : {
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    maxHeight: '220px',
                  }
            }
          >
          {showList.map((loc, i) => (
            <li key={loc}>
              <button
                type="button"
                onClick={() => handleSelect(loc)}
                className={`w-full text-left transition-colors ${dropdownVariant === 'filter' ? 'px-4 py-1.5 hover:bg-gray-50' : 'px-3 py-2.5'}`}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: dropdownVariant === 'filter' ? '11px' : undefined,
                  color: '#6A6A6A',
                  backgroundColor: i === highlightIndex ? '#F0F8FE' : 'transparent',
                }}
              >
                {loc}
              </button>
            </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default LocationAutocomplete;
