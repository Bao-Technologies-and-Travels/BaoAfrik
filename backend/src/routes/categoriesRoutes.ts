import { Router } from 'express';

const router = Router();

// Mock data - replace with your actual categories
const categories = [
  { id: '1', name: 'Beauty & Wellness', value: 'beauty' },
  { id: '2', name: 'Books & Media', value: 'books' },
  { id: '3', name: 'Fashion & Textiles', value: 'fashion' },
  { id: '4', name: 'Foods & Spices', value: 'food' },
  { id: '5', name: 'Home & Decor', value: 'home' }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

export default router;