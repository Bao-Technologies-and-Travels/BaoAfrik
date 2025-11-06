import { Router } from 'express';

const router = Router();

// Your countries array from the frontend
const countries = [
  { value: 'algeria', label: 'Algeria', flagCode: 'dz' },
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: countries
  });
});

export default router;