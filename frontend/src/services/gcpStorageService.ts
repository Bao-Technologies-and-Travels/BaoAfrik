class GCPStorageService {
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

    return await response.json();
  }

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

    return await response.json();
  }

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

  async uploadFile(file: File, uploadUrl: string): Promise<boolean> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          errorText
        });
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getViewUrl(fileUrl: string): Promise<string> {
    return fileUrl;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User not authenticated');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return true;
  }
}

export const gcpStorageService = new GCPStorageService();