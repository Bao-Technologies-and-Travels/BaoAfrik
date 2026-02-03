export interface CountryInfo {
  name: string;
  code: string; // 2-letter (lowercase)
  flag: string;
  abbreviation: string;
}

// Standardized country names 
const countries: CountryInfo[] = [
  { name: 'Algeria', code: 'dz', flag: 'https://flagcdn.com/w20/dz.png', abbreviation: 'DZA' },
  { name: 'Angola', code: 'ao', flag: 'https://flagcdn.com/w20/ao.png', abbreviation: 'AGO' },
  { name: 'Benin', code: 'bj', flag: 'https://flagcdn.com/w20/bj.png', abbreviation: 'BEN' },
  { name: 'Botswana', code: 'bw', flag: 'https://flagcdn.com/w20/bw.png', abbreviation: 'BWA' },
  { name: 'Burkina Faso', code: 'bf', flag: 'https://flagcdn.com/w20/bf.png', abbreviation: 'BFA' },
  { name: 'Burundi', code: 'bi', flag: 'https://flagcdn.com/w20/bi.png', abbreviation: 'BDI' },
  { name: 'Cabo Verde', code: 'cv', flag: 'https://flagcdn.com/w20/cv.png', abbreviation: 'CPV' },
  { name: 'Cameroon', code: 'cm', flag: 'https://flagcdn.com/w20/cm.png', abbreviation: 'CMR' },
  { name: 'Central African Republic', code: 'cf', flag: 'https://flagcdn.com/w20/cf.png', abbreviation: 'CAF' },
  { name: 'Chad', code: 'td', flag: 'https://flagcdn.com/w20/td.png', abbreviation: 'TCD' },
  { name: 'Comoros', code: 'km', flag: 'https://flagcdn.com/w20/km.png', abbreviation: 'COM' },
  { name: 'Congo', code: 'cg', flag: 'https://flagcdn.com/w20/cg.png', abbreviation: 'COG' },
  { name: 'Côte d\'Ivoire', code: 'ci', flag: 'https://flagcdn.com/w20/ci.png', abbreviation: 'CIV' },
  { name: 'Democratic Republic of the Congo', code: 'cd', flag: 'https://flagcdn.com/w20/cd.png', abbreviation: 'COD' },
  { name: 'Djibouti', code: 'dj', flag: 'https://flagcdn.com/w20/dj.png', abbreviation: 'DJI' },
  { name: 'Egypt', code: 'eg', flag: 'https://flagcdn.com/w20/eg.png', abbreviation: 'EGY' },
  { name: 'Equatorial Guinea', code: 'gq', flag: 'https://flagcdn.com/w20/gq.png', abbreviation: 'GNQ' },
  { name: 'Eritrea', code: 'er', flag: 'https://flagcdn.com/w20/er.png', abbreviation: 'ERI' },
  { name: 'Eswatini', code: 'sz', flag: 'https://flagcdn.com/w20/sz.png', abbreviation: 'SWZ' },
  { name: 'Ethiopia', code: 'et', flag: 'https://flagcdn.com/w20/et.png', abbreviation: 'ETH' },
  { name: 'Gabon', code: 'ga', flag: 'https://flagcdn.com/w20/ga.png', abbreviation: 'GAB' },
  { name: 'Gambia', code: 'gm', flag: 'https://flagcdn.com/w20/gm.png', abbreviation: 'GMB' },
  { name: 'Ghana', code: 'gh', flag: 'https://flagcdn.com/w20/gh.png', abbreviation: 'GHA' },
  { name: 'Guinea', code: 'gn', flag: 'https://flagcdn.com/w20/gn.png', abbreviation: 'GIN' },
  { name: 'Guinea-Bissau', code: 'gw', flag: 'https://flagcdn.com/w20/gw.png', abbreviation: 'GNB' },
  { name: 'Kenya', code: 'ke', flag: 'https://flagcdn.com/w20/ke.png', abbreviation: 'KEN' },
  { name: 'Lesotho', code: 'ls', flag: 'https://flagcdn.com/w20/ls.png', abbreviation: 'LSO' },
  { name: 'Liberia', code: 'lr', flag: 'https://flagcdn.com/w20/lr.png', abbreviation: 'LBR' },
  { name: 'Libya', code: 'ly', flag: 'https://flagcdn.com/w20/ly.png', abbreviation: 'LBY' },
  { name: 'Madagascar', code: 'mg', flag: 'https://flagcdn.com/w20/mg.png', abbreviation: 'MDG' },
  { name: 'Malawi', code: 'mw', flag: 'https://flagcdn.com/w20/mw.png', abbreviation: 'MWI' },
  { name: 'Mali', code: 'ml', flag: 'https://flagcdn.com/w20/ml.png', abbreviation: 'MLI' },
  { name: 'Mauritania', code: 'mr', flag: 'https://flagcdn.com/w20/mr.png', abbreviation: 'MRT' },
  { name: 'Mauritius', code: 'mu', flag: 'https://flagcdn.com/w20/mu.png', abbreviation: 'MUS' },
  { name: 'Morocco', code: 'ma', flag: 'https://flagcdn.com/w20/ma.png', abbreviation: 'MAR' },
  { name: 'Mozambique', code: 'mz', flag: 'https://flagcdn.com/w20/mz.png', abbreviation: 'MOZ' },
  { name: 'Namibia', code: 'na', flag: 'https://flagcdn.com/w20/na.png', abbreviation: 'NAM' },
  { name: 'Niger', code: 'ne', flag: 'https://flagcdn.com/w20/ne.png', abbreviation: 'NER' },
  { name: 'Nigeria', code: 'ng', flag: 'https://flagcdn.com/w20/ng.png', abbreviation: 'NGA' },
  { name: 'Rwanda', code: 'rw', flag: 'https://flagcdn.com/w20/rw.png', abbreviation: 'RWA' },
  { name: 'Sao Tome and Principe', code: 'st', flag: 'https://flagcdn.com/w20/st.png', abbreviation: 'STP' },
  { name: 'Senegal', code: 'sn', flag: 'https://flagcdn.com/w20/sn.png', abbreviation: 'SEN' },
  { name: 'Seychelles', code: 'sc', flag: 'https://flagcdn.com/w20/sc.png', abbreviation: 'SYC' },
  { name: 'Sierra Leone', code: 'sl', flag: 'https://flagcdn.com/w20/sl.png', abbreviation: 'SLE' },
  { name: 'Somalia', code: 'so', flag: 'https://flagcdn.com/w20/so.png', abbreviation: 'SOM' },
  { name: 'South Africa', code: 'za', flag: 'https://flagcdn.com/w20/za.png', abbreviation: 'ZAF' },
  { name: 'South Sudan', code: 'ss', flag: 'https://flagcdn.com/w20/ss.png', abbreviation: 'SSD' },
  { name: 'Sudan', code: 'sd', flag: 'https://flagcdn.com/w20/sd.png', abbreviation: 'SDN' },
  { name: 'Tanzania', code: 'tz', flag: 'https://flagcdn.com/w20/tz.png', abbreviation: 'TZA' },
  { name: 'Togo', code: 'tg', flag: 'https://flagcdn.com/w20/tg.png', abbreviation: 'TGO' },
  { name: 'Tunisia', code: 'tn', flag: 'https://flagcdn.com/w20/tn.png', abbreviation: 'TUN' },
  { name: 'Uganda', code: 'ug', flag: 'https://flagcdn.com/w20/ug.png', abbreviation: 'UGA' },
  { name: 'Zambia', code: 'zm', flag: 'https://flagcdn.com/w20/zm.png', abbreviation: 'ZMB' },
  { name: 'Zimbabwe', code: 'zw', flag: 'https://flagcdn.com/w20/zw.png', abbreviation: 'ZWE' },
];

// Country name aliases - maps alternative names to canonical names
const countryAliases: Record<string, string> = {
  'ivory coast': 'Côte d\'Ivoire',
  'cote d\'ivoire': 'Côte d\'Ivoire',
  'cape verde': 'Cabo Verde',
  'cabo verde': 'Cabo Verde',
  'congo (congo-brazzaville)': 'Congo',
  'republic of the congo': 'Congo',
  'democratic republic of congo': 'Democratic Republic of the Congo',
  'dr congo': 'Democratic Republic of the Congo',
  'drc': 'Democratic Republic of the Congo',
};

export function getProductCountry(
  productOrigin?: string, 
  productOriginCode?: string 
): CountryInfo {
  if (productOriginCode) {
    const c = countries.find(c =>
      c.abbreviation.toLowerCase() === productOriginCode.toLowerCase() ||
      c.code === productOriginCode.toLowerCase()
    );
    if (c) return c;
  }
  if (productOrigin) {
    const normalized = productOrigin.toLowerCase().trim();
    
    // First check aliases
    const canonicalName = countryAliases[normalized];
    if (canonicalName) {
      const c = countries.find(c => c.name === canonicalName);
      if (c) return c;
    }
    
    // Then check direct match
    const c = countries.find(c =>
      c.name.toLowerCase() === normalized ||
      c.code === normalized
    );
    if (c) return c;
    
    // Try partial match for hyphenated names (e.g., "Guinea-Bissau" matches "guinea bissau")
    const partialMatch = countries.find(c => {
      const countryNameLower = c.name.toLowerCase().replace(/[-\s]/g, '');
      const searchLower = normalized.replace(/[-\s]/g, '');
      return countryNameLower === searchLower;
    });
    if (partialMatch) return partialMatch;
  }
  return { name: productOrigin || 'Unknown', code: '', flag: '', abbreviation: '' };
}

// Export all countries for use in dropdowns, etc.
export { countries };

