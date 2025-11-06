class S3Service {
  private baseUrl = process.env.REACT_APP_API_URL;

  private async request(endpoint: string, body: any) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload service error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // For profile images
  async getPresignedUrlForProfile(file: File, userId: string) {
    console.log('📸 Getting presigned URL for profile image:', {
      fileName: file.name,
      fileType: file.type,
      userId
    });

    const response = await this.request('/upload/upload-url/profile', {
      fileName: file.name,
      fileType: file.type,
      userId,
    });

    console.log('✅ Profile upload URL response:', response);
    return response;
  }

  // For chat files 
  async getPresignedUrlForChat(file: File, userId: string) {
    console.log('💬 Getting presigned URL for chat file:', {
      fileName: file.name,
      fileType: file.type,
      userId
    });

    const response = await this.request('/upload/upload-url/chat', {
      fileName: file.name,
      fileType: file.type,
      userId,
    });

    console.log('✅ Chat upload URL response:', response);
    return response;
  }

  // For product images
  async getPresignedUrlForProduct(file: File, userId: string) {
    console.log('🛍️ Getting presigned URL for product image:', {
      fileName: file.name,
      fileType: file.type,
      userId
    });

    const response = await this.request('/upload/upload-url/product', {
      fileName: file.name,
      fileType: file.type,
      userId,
    });

    return response;
  }

  // Upload file to S3 using presigned URL
  async uploadFile(file: File, uploadUrl: string): Promise<boolean> {
    console.log('📤 Uploading file to S3:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadUrl: uploadUrl.substring(0, 100) + '...'
    });

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      console.error('❌ S3 upload failed:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error('Upload failed');
    }

    console.log('✅ File uploaded successfully to S3');
    return true;
  }

  // Get view URL for private files
  async getViewUrl(fileUrl: string): Promise<string> {
    // Extract key from the fileUrl
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1);

    const response = await this.request('/upload/view-url', { key });
    return response.viewUrl;
  }

  // Delete file from S3
  async deleteFile(fileUrl: string): Promise<boolean> {
    // Extract key from the fileUrl
    const url = new URL(fileUrl);
    const key = decodeURIComponent(url.pathname.substring(1));

    console.log('🗑️ Deleting file from S3:', { key });

    await this.request('/upload/delete-file', { key });
    return true;
  }

  // Batch upload for multiple files
  async getBatchPresignedUrls(files: File[], uploadType: 'profile' | 'chat' | 'product', userId: string) {
    const fileData = files.map(file => ({
      fileName: file.name,
      fileType: file.type,
    }));

    const response = await this.request('/upload/batch-upload-urls', {
      files: fileData,
      uploadType,
      userId,
    });

    return response.data;
  }
}

export const s3Service = new S3Service();
