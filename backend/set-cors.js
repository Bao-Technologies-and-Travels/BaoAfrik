const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

async function setCorsConfiguration() {
  await storage.bucket('baoafrik-dev-uploads').setCorsConfiguration([
    {
      origin: ['http://localhost:3000', 'https://staging.baoafrik.com'],
      method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      responseHeader: [
        'Content-Type',
        'Content-MD5',
        'Content-Disposition',
        'ETag',
        'x-goog-request-id',
        'x-goog-content-length-range'
      ],
      maxAgeSeconds: 3600,
    },
  ]);

  console.log('CORS configuration updated successfully');
}

setCorsConfiguration().catch(console.error);