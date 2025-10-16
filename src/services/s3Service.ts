import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

export interface S3UploadResponse {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

export const s3Service = {
    // Image uploading to AWS S3
    uploadImage: async (file: File, userId: string): Promise<S3UploadResponse> => {
        try {
            // Generate a unique filename
            const fileExtension = file.name.split('.').pop();
            const timestamp = Date.now();
            const uniqueFileName = `profile-images/${userId}/profile-${timestamp}.${fileExtension}`;

            const params = {
                Bucket: process.env.REACT_APP_S3_BUCKET_NAME!,
                Key: uniqueFileName,
                Body: file,
                ContentType: file.type,
            };

            const result = await s3.upload(params).promise();

            return {
                success: true,
                imageUrl: result.Location
            };
        } catch (error) {
            console.error('S3 Upload error:', error);
            return {
                success: false,
                error: 'Failed to upload image'
            };
        }
    },

    // delete image from S3
    deleteImage: async (imageUrl: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const url = new URL(imageUrl);
            const key = decodeURIComponent(url.pathname.substring(1));

            const params =  {
                Bucket: process.env.REACT_APP_S3_BUCKET_NAME!,
                Key: key
            };

            await s3.deleteObject(params).promise();

            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: 'Failed to delete image'
            };
        }
    }
};