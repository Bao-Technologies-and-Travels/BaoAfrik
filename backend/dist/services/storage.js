"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFiles = exports.createSignedUrl = exports.getPublicUrl = exports.deleteFile = exports.uploadFile = exports.STORAGE_BUCKET = void 0;
const supabase_1 = require("../config/supabase");
const logger_1 = require("../utils/logger");
exports.STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'baoafrik';
const uploadFile = async ({ file, path, bucket = exports.STORAGE_BUCKET, contentType, upsert = false, }) => {
    try {
        const options = {
            cacheControl: '3600',
            upsert,
            ...(contentType && { contentType }),
        };
        const { data, error } = await supabase_1.supabase.storage
            .from(bucket)
            .upload(path, file, options);
        if (error)
            throw error;
        // Get the public URL
        const { data: { publicUrl } } = supabase_1.supabase.storage
            .from(bucket)
            .getPublicUrl(path);
        return {
            success: true,
            path: data.path,
            publicUrl,
        };
    }
    catch (error) {
        logger_1.logger.error('Error uploading file:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload file',
        };
    }
};
exports.uploadFile = uploadFile;
const deleteFile = async (path, bucket = exports.STORAGE_BUCKET) => {
    try {
        const { error } = await supabase_1.supabase.storage
            .from(bucket)
            .remove([path]);
        if (error)
            throw error;
        return { success: true };
    }
    catch (error) {
        logger_1.logger.error('Error deleting file:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete file',
        };
    }
};
exports.deleteFile = deleteFile;
const getPublicUrl = (path, bucket = exports.STORAGE_BUCKET) => {
    const { data: { publicUrl } } = supabase_1.supabase.storage
        .from(bucket)
        .getPublicUrl(path);
    return publicUrl;
};
exports.getPublicUrl = getPublicUrl;
const createSignedUrl = async (path, expiresIn = 3600, bucket = exports.STORAGE_BUCKET) => {
    try {
        const { data, error } = await supabase_1.supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);
        if (error)
            throw error;
        return {
            success: true,
            signedUrl: data.signedUrl,
        };
    }
    catch (error) {
        logger_1.logger.error('Error creating signed URL:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create signed URL',
        };
    }
};
exports.createSignedUrl = createSignedUrl;
const listFiles = async (path, bucket = exports.STORAGE_BUCKET) => {
    try {
        const { data, error } = await supabase_1.supabase.storage
            .from(bucket)
            .list(path);
        if (error)
            throw error;
        return {
            success: true,
            files: data,
        };
    }
    catch (error) {
        logger_1.logger.error('Error listing files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list files',
        };
    }
};
exports.listFiles = listFiles;
