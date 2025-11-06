import { Request, Response } from 'express';

export class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = [
        { id: '1', name: 'Beauty & Wellness', value: 'beauty', icon: '💄' },
        { id: '2', name: 'Books & Media', value: 'books', icon: '📚' },
        { id: '3', name: 'Fashion & Textiles', value: 'fashion', icon: '👗' },
        { id: '4', name: 'Foods & Spices', value: 'food', icon: '🍎' },
        { id: '5', name: 'Home & Decor', value: 'home', icon: '🏠' }
      ];

      res.json({
        success: true,
        data: categories
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}