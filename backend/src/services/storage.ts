import { supabase, supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';

export const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'baoafrik';

export interface UploadFileOptions {
  file: File | Buffer;
  path: string;
  bucket?: string;
  contentType?: string;
  upsert?: boolean;
}

export const uploadFile = async ({
  file,
  path,
  bucket = STORAGE_BUCKET,
  contentType,
  upsert = false,
}: UploadFileOptions) => {
  try {
    const options = {
      cacheControl: '3600',
      upsert,
      ...(contentType && { contentType }),
    };

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, options);

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      success: true,
      path: data.path,
      publicUrl,
    };
  } catch (error) {
    logger.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file',
    };
  }
};

export const deleteFile = async (path: string, bucket = STORAGE_BUCKET) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error('Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
};

export const getPublicUrl = (path: string, bucket = STORAGE_BUCKET) => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
};

export const createSignedUrl = async (
  path: string, 
  expiresIn = 3600, 
  bucket = STORAGE_BUCKET
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return {
      success: true,
      signedUrl: data.signedUrl,
    };
  } catch (error) {
    logger.error('Error creating signed URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create signed URL',
    };
  }
};

export const listFiles = async (path: string, bucket = STORAGE_BUCKET) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) throw error;

    return {
      success: true,
      files: data,
    };
  } catch (error) {
    logger.error('Error listing files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
    };
  }
};
