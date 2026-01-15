import { Request } from 'express';

interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName: string;
}

/**
 * Parse user agent string to extract browser, OS, and device information
 */
export function parseUserAgent(userAgent: string | undefined): ParsedUserAgent {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      browserVersion: '',
      os: 'Unknown',
      osVersion: '',
      deviceType: 'desktop',
      deviceName: 'Unknown Device'
    };
  }

  const ua = userAgent.toLowerCase();
  let browser = 'Unknown';
  let browserVersion = '';
  let os = 'Unknown';
  let osVersion = '';
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  let deviceName = 'Unknown Device';

  // Detect Browser
  if (ua.includes('chrome') && !ua.includes('edg') && !ua.includes('opr')) {
    browser = 'Chrome';
    const match = ua.match(/chrome\/([\d.]+)/);
    browserVersion = match && match[1] ? match[1] : '';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
    const match = ua.match(/version\/([\d.]+)/);
    browserVersion = match && match[1] ? match[1] : '';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
    const match = ua.match(/firefox\/([\d.]+)/);
    browserVersion = match && match[1] ? match[1] : '';
  } else if (ua.includes('edg')) {
    browser = 'Edge';
    const match = ua.match(/edg\/([\d.]+)/);
    browserVersion = match && match[1] ? match[1] : '';
  } else if (ua.includes('opr') || ua.includes('opera')) {
    browser = 'Opera';
    const match = ua.match(/(?:opr|opera)\/([\d.]+)/);
    browserVersion = match && match[1] ? match[1] : '';
  } else if (ua.includes('brave')) {
    browser = 'Brave';
    const match = ua.match(/brave\/([\d.]+)/);
    browserVersion = match && match[1] ? match[1] : '';
  }

  // Detect OS
  if (ua.includes('windows')) {
    os = 'Windows';
    if (ua.includes('windows nt 10.0')) osVersion = '10';
    else if (ua.includes('windows nt 6.3')) osVersion = '8.1';
    else if (ua.includes('windows nt 6.2')) osVersion = '8';
    else if (ua.includes('windows nt 6.1')) osVersion = '7';
  } else if (ua.includes('mac os x') || ua.includes('macintosh')) {
    os = 'macOS';
    const match = ua.match(/mac os x ([\d_]+)/);
    if (match && match[1]) osVersion = match[1].replace(/_/g, '.');
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
    const match = ua.match(/android ([\d.]+)/);
    osVersion = match && match[1] ? match[1] : '';
    deviceType = 'mobile';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'iOS';
    const match = ua.match(/os ([\d_]+)/);
    if (match && match[1]) osVersion = match[1].replace(/_/g, '.');
    if (ua.includes('ipad')) {
      deviceType = 'tablet';
      deviceName = 'iPad';
    } else {
      deviceType = 'mobile';
      // Try to detect iPhone model
      if (ua.includes('iphone')) {
        const modelMatch = ua.match(/iphone\s*(\w+)/);
        deviceName = modelMatch ? `iPhone ${modelMatch[1]}` : 'iPhone';
      } else {
        deviceName = 'iOS Device';
      }
    }
  }

  // Detect device name for desktop
  if (deviceType === 'desktop') {
    if (os === 'Windows') {
      // Try to extract computer name from user agent if available
      deviceName = 'Windows PC';
    } else if (os === 'macOS') {
      deviceName = 'Mac';
    } else if (os === 'Linux') {
      deviceName = 'Linux PC';
    }
  } else if (deviceType === 'mobile' && os === 'Android') {
    // Try to detect Android device model
    const modelMatch = ua.match(/android.*;\s*([^)]+)\)/);
    if (modelMatch && modelMatch[1]) {
      deviceName = modelMatch[1].trim();
    } else {
      deviceName = 'Android Device';
    }
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    deviceName
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const firstIp = forwarded.split(',')[0];
    return firstIp ? firstIp.trim() : 'unknown';
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Get location information from IP address
 * Note: This is a placeholder. In production, you'd use a service like ipapi.co, ip-api.com, or MaxMind GeoIP
 */
export async function getLocationFromIp(ip: string): Promise<{
  location: string;
  country: string;
  city: string;
}> {
  // Skip for localhost/private IPs
  if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      location: 'Local',
      country: '',
      city: 'Local'
    };
  }

  try {
    // Using ip-api.com (free tier: 45 requests/minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName`);
    const data = await response.json() as {
      status?: string;
      country?: string;
      countryCode?: string;
      city?: string;
      regionName?: string;
    };

    if (data.status === 'success') {
      const city = data.city || '';
      const region = data.regionName || '';
      const country = data.country || '';
      const location = [city, region, country].filter(Boolean).join(', ') || 'Unknown Location';

      return {
        location,
        country: data.countryCode || '',
        city: city || ''
      };
    }
  } catch (error) {
    console.error('Failed to get location from IP:', error);
  }

  return {
    location: 'Unknown Location',
    country: '',
    city: ''
  };
}
