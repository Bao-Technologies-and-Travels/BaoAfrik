import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, DeleteObjectCommand, S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';

const s3 = new S3({
  region: process.env.AWS_REGION,

  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
    : undefined,
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const PROFILE_PREFIX = process.env.S3_PROFILE_PREFIX! || 'profile-images';
const ATTACHMENTS_PREFIX = process.env.S3_ATTACHMENTS_PREFIX! || 'attachments';

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, uploadType, userId, conversationId } = req.body;

    if (!uploadType || !fileName || !fileType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let keyPrefix: string;
    if (uploadType === 'profile') {
      keyPrefix = `${PROFILE_PREFIX}/${userId}`;
    } else if (uploadType === 'chat') {
      keyPrefix = `${ATTACHMENTS_PREFIX}/${conversationId}`;
    } else {
      return res.status(400).json({ message: 'Invalid upload type' });
    }

    const key = `${keyPrefix}/${Date.now()}-${fileName}`;

    const params = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, params, {expiresIn: 120});

    return res.json({
      uploadUrl,
      fileUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate pre-signed URL' });
  }
};

export const getViewPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({ message: 'Missing key' });
    }

    const params = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const viewUrl = await getSignedUrl(s3, params, { expiresIn: 3600 }); // 1 hour

    return res.json({ viewUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate view URL' });
  }
};

// Delete file from S3
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ message: 'Missing key' });

    await s3.deleteObject({ Bucket: BUCKET, Key: key });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete image' });
  }
};