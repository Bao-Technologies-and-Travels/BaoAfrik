import { Request, Response } from 'express';
import prisma from '@/config/database';

export const getCountries = async (req: Request, res: Response) => {
    try {
        const countries = await prisma.country.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, code: true, flag: true }
        });
        return res.json({ success: true, data: countries });
    } catch (err) {
        console.error('getCountries error', err);
        return res.status(500).json({ success: false, message: 'Failed to load countries' });
    }
};

export const reverseGeocode = async (req: Request, res: Response) => {
    const lat = req.query.lat as string;
    const lng = req.query.lng as string;

    if (!lat || !lng) return res.status(400).json({ success: false, message: 'Missing lat/lng' });

    try {
        const nominatimUrl = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/reverse';
        const url = `${nominatimUrl}?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=5&addressdetails=1`;

        const response = await fetch(url, {
            headers: { 'User-Agent': process.env.NOMINATIM_USER_AGENT || 'BaoAfrik/1.0 (dev)' }
        });
        if (!response.ok) throw new Error('Reverse geocode failed');

        const data: any = await response.json();
        const address = data?.address ?? {};
        const countryName = address?.country;
        const countryCode = (address?.country_code || '').toUpperCase();

        if (!countryName) {
            return res.status(404).json({ success: false, message: 'Country not found' });
        }

        const country = await prisma.country.findFirst({
            where: { OR: [{ code: countryCode }, { name: countryName }] },
            select: { id: true, name: true, code: true, flag: true }
        });

        if (country) {
            return res.json({ success: true, data: country });
        }
        
        return res.json({ success: true, data: { name: countryName, code: countryCode } });
    } catch (err) {
        console.error('reverseGeocode error', err);
        return res.status(500).json({ success: false, message: 'Reverse geocode failed' });
    }
};