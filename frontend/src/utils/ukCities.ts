/**
 * UK cities and major towns
 */
const UK_CITIES_RAW = [
  'Aberdeen', 'Abingdon', 'Accrington', 'Aldershot', 'Andover', 'Aylesbury',
  'Bangor', 'Barnsley', 'Barry', 'Basildon', 'Bath', 'Batley', 'Bedford',
  'Belfast', 'Birkenhead', 'Birmingham', 'Blackburn', 'Blackpool', 'Bolton',
  'Bournemouth', 'Bradford', 'Brighton', 'Bristol', 'Burnley', 'Burton upon Trent',
  'Bury', 'Cambridge', 'Canterbury', 'Cardiff', 'Carlisle', 'Chatham',
  'Chelmsford', 'Cheltenham', 'Chester', 'Chesterfield', 'Colchester', 'Coventry',
  'Crawley', 'Crewe', 'Croydon', 'Darlington', 'Derby', 'Doncaster', 'Dudley',
  'Dundee', 'Dunfermline', 'Durham', 'Eastbourne', 'Edinburgh', 'Exeter',
  'Falkirk', 'Gateshead', 'Glasgow', 'Gloucester', 'Grimsby', 'Guildford',
  'Halifax', 'Hamilton', 'Hartlepool', 'Hastings', 'Hemel Hempstead', 'High Wycombe',
  'Huddersfield', 'Ipswich', 'Inverness', 'Kingston upon Hull', 'Kirkcaldy',
  'Lancaster', 'Leeds', 'Leicester', 'Lincoln', 'Liverpool', 'London', 'Luton',
  'Maidstone', 'Manchester', 'Mansfield', 'Middlesbrough', 'Milton Keynes',
  'Newcastle upon Tyne', 'Newport', 'Northampton', 'Norwich', 'Nottingham',
  'Oldham', 'Oxford', 'Paisley', 'Peterborough', 'Plymouth', 'Poole', 'Portsmouth',
  'Preston', 'Reading', 'Redditch', 'Rochdale', 'Rotherham', 'Salford', 'Salisbury',
  'Scunthorpe', 'Sheffield', 'Shrewsbury', 'Slough', 'Solihull', 'Southampton',
  'Southend-on-Sea', 'Southport', 'St Albans', 'St Helens', 'Stafford', 'Stevenage',
  'Stockport', 'Stockton-on-Tees', 'Stoke-on-Trent', 'Sunderland', 'Swansea',
  'Swindon', 'Telford', 'Torbay', 'Torquay', 'Truro', 'Wakefield', 'Warrington',
  'Warwick', 'Watford', 'Wigan', 'Winchester', 'Wolverhampton', 'Worcester',
  'Worthing', 'York',
];

/** UK city names only (canonical stored form) */
export const UK_CITIES_PLAIN: string[] = [...UK_CITIES_RAW];

/** UK cities with "*/
export const UK_CITIES_WITH_COUNTRY: string[] = UK_CITIES_PLAIN.map((city) =>
  `${city}, United Kingdom`
);

/**
 * Normalize a location string to plain city name (strip ", United Kingdom" or " | United Kingdom" if present).
 * Use when comparing or storing from API/UI that may include country.
 */
export function getCityPlain(location: string): string {
  if (!location || typeof location !== 'string') return location || '';
  const trimmed = location.trim();
  const withoutComma = trimmed.replace(/,\s*United Kingdom$/i, '').trim();
  const withoutPipe = withoutComma.replace(/\s*\|\s*United Kingdom$/i, '').trim();
  return withoutPipe || trimmed;
}

/**
 * Display label for a city: "City, United Kingdom".
 * Handles plain city, "City, United Kingdom", and legacy "City | United Kingdom" without doubling the country.
 */
export function formatCityDisplay(city: string): string {
  if (!city || typeof city !== 'string') return city || '';
  const plain = getCityPlain(city);
  if (!plain) return '';
  return `${plain}, United Kingdom`;
}

/** Options for dropdowns: value = slug, label = plain city name (store label) */
export const UK_CITIES_OPTIONS: Array<{ value: string; label: string }> =
  UK_CITIES_PLAIN.map((city) => ({
    value: city.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
    label: city,
  }));
