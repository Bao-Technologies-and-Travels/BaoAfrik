"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const supabase_1 = require("../config/supabase");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
// Get all categories (public)
router.get('/', async (req, res) => {
    try {
        const { data: categories, error } = await supabase_1.supabase
            .from('categories')
            .select('*')
            .order('name');
        if (error)
            throw error;
        res.json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        logger_1.logger.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories',
        });
    }
});
// Get single category (public)
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data: category, error } = await supabase_1.supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error || !category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found',
            });
        }
        res.json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        logger_1.logger.error('Get category error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch category',
        });
    }
});
// Create category (admin only)
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), async (req, res) => {
    try {
        const { name, description, image_url, parent_id } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Category name is required',
            });
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const { data: category, error } = await supabase_1.supabase
            .from('categories')
            .insert({
            name,
            slug,
            description,
            image_url,
            parent_id,
        })
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        logger_1.logger.error('Create category error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create category',
        });
    }
});
// Update category (admin only)
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image_url, parent_id } = req.body;
        const updates = {};
        if (name !== undefined) {
            updates.name = name;
            updates.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (description !== undefined)
            updates.description = description;
        if (image_url !== undefined)
            updates.image_url = image_url;
        if (parent_id !== undefined)
            updates.parent_id = parent_id;
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update',
            });
        }
        const { data: category, error } = await supabase_1.supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        logger_1.logger.error('Update category error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update category',
        });
    }
});
// Delete category (admin only)
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.supabase
            .from('categories')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    }
    catch (error) {
        logger_1.logger.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete category',
        });
    }
});
exports.default = router;
