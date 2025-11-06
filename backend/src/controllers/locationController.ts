import { Request, Response } from 'express';

export class LocationController {
  async getLocations(req: Request, res: Response) {
    try {
      const locations = [
        'London, United Kingdom',
        'Paris, France',
        'Berlin, Germany',
        'Madrid, Spain',
        'Rome, Italy',
        'Amsterdam, Netherlands',
        'Brussels, Belgium',
        'Vienna, Austria',
        'Lisbon, Portugal',
        'Dublin, Ireland'
      ];

      res.json({
        success: true,
        data: locations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}