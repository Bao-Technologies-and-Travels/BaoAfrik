import { Router } from 'express';
import { getCountries, reverseGeocode } from '@/controllers/countryController';

const router = Router();

router.get('/', getCountries);
router.get('/reverse', reverseGeocode);

export default router;