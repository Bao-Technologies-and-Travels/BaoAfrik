class S3Service {
  async getPresignedUrlForProfile(file: File, userId: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload service error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(' Profile upload URL response:', data);
    return data;
  }

  // For chat files 
  async getPresignedUrlForChat(file: File, userId: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        userId,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload service error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(' Chat upload URL response:', data);
    return data;
  }

  // For product images
  async getPresignedUrlForProduct(file: File, userId: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        userId,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload service error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  // Upload file to S3 using presigned URL
  async uploadFile(file: File, uploadUrl: string): Promise<boolean> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      console.error(' S3 upload failed:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error('Upload failed');
    }

    console.log(' File uploaded successfully to S3');
    return true;
  }

  // Get view URL for private files
  async getViewUrl(fileUrl: string): Promise<string> {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    // Extract key from the fileUrl
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload/view-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ key })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`View URL error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.viewUrl;
  }

  // Delete file from S3
  async deleteFile(fileUrl: string): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    // Extract key from the fileUrl
    const url = new URL(fileUrl);
    const key = decodeURIComponent(url.pathname.substring(1));

    console.log(' Deleting file from S3:', { key });

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload/delete-file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return true;
  }

  // Batch upload for multiple files
  async getBatchPresignedUrls(files: File[], uploadType: 'profile' | 'chat' | 'product', userId: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    const fileData = files.map(file => ({
      fileName: file.name,
      fileType: file.type,
    }));

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload/batch-upload-urls `, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        files: fileData,
        uploadType,
        userId,
      })
    });

    const data = await response.json();
    return data.data || data;
  }
}

export const s3Service = new S3Service();
