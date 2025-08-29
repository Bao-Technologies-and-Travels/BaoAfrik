import { Router } from 'express';
import { authenticateToken, requireRole, optionalAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

const router = Router();

// Get all products (public)
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      seller_id,
      min_price,
      max_price,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        profiles!products_seller_id_fkey(username, full_name),
        product_images(url, is_primary)
      `)
      .eq('is_active', true);

    // Apply filters
    if (category) {
      query = query.eq('categories.slug', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (seller_id) {
      query = query.eq('seller_id', seller_id);
    }

    if (min_price) {
      query = query.gte('price', min_price);
    }

    if (max_price) {
      query = query.lte('price', max_price);
    }

    // Apply sorting and pagination
    const offset = (Number(page) - 1) * Number(limit);
    query = query
      .order(sort as string, { ascending: order === 'asc' })
      .range(offset, offset + Number(limit) - 1);

    const { data: products, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
});

// Get single product (public)
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        profiles!products_seller_id_fkey(username, full_name, avatar_url),
        product_images(url, is_primary, alt_text),
        reviews(rating, comment, created_at, profiles(username, full_name))
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
});

// Create product (sellers only)
router.post('/', authenticateToken, requireRole(['seller', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      price,
      currency = 'USD',
      stock_quantity = 0,
      category_id,
      images = []
    } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and price are required',
      });
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        seller_id: req.user!.id,
        title,
        slug,
        description,
        price,
        currency,
        stock_quantity,
        category_id,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Add images if provided
    if (images.length > 0) {
      const imageData = images.map((image: any, index: number) => ({
        product_id: product.id,
        url: image.url,
        alt_text: image.alt_text || title,
        is_primary: index === 0,
      }));

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imageData);

      if (imageError) {
        logger.error('Error adding product images:', imageError);
      }
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
    });
  }
});

// Update product (seller/admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      currency,
      stock_quantity,
      category_id,
      is_active
    } = req.body;

    // Check if user owns the product or is admin
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    if (existingProduct.seller_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this product',
      });
    }

    const updates: Record<string, any> = {};
    if (title !== undefined) {
      updates.title = title;
      updates.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (currency !== undefined) updates.currency = currency;
    if (stock_quantity !== undefined) updates.stock_quantity = stock_quantity;
    if (category_id !== undefined) updates.category_id = category_id;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
    });
  }
});

// Delete product (seller/admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the product or is admin
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    if (existingProduct.seller_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this product',
      });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
    });
  }
});

// Get user's products (authenticated)
router.get('/my/products', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { data: products, error, count } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(url, is_primary)
      `, { count: 'exact' })
      .eq('seller_id', req.user!.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get user products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch your products',
    });
  }
});

export default router;
