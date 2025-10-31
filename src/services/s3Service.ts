export const s3Service = {

    async getViewUrl(fileUrl: string) {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('User not authenticated');

        // Extract key from the fileUrl
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1);

        const res = await fetch(`${process.env.REACT_APP_API_URL}/upload/view-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ key }),
        });

        if (!res.ok) throw new Error('Failed to get view URL');
        const data = await res.json();
        return data.viewUrl;
    },

    async getPresignedUrlForProfile(file: File, userId: string) {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('User not authenticated');

        const res = await fetch(`${process.env.REACT_APP_API_URL}/upload/upload-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                uploadType: 'profile',
                userId,
            }),
        });

        if (!res.ok) throw new Error('Failed to get presigned URL');
        return res.json();
    },

    async getPresignedUrlForChat(file: File, userId: string) {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('User not authenticated');

        const requestBody = {
            fileName: file.name,
            fileType: file.type,
            uploadType: 'chat',
            userId: userId,
        };

        console.log('🔍 [DEBUG] S3 Upload Request Details:', {
            url: `${process.env.REACT_APP_API_URL}/upload/upload-url`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.substring(0, 20)}...`, // Log partial token for security
            },
            body: requestBody,
            fileInfo: {
                name: file.name,
                type: file.type,
                size: file.size
            }
        });

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/upload/upload-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            console.log('📨 [DEBUG] S3 Upload Response Status:', {
                status: res.status,
                statusText: res.statusText,
                ok: res.ok,
                headers: Object.fromEntries(res.headers.entries())
            });

            if (!res.ok) {
                // Try to get the error response body
                let errorText = 'No error message';
                try {
                    errorText = await res.text();
                } catch (e) {
                    errorText = 'Could not read error response';
                }

                console.error('❌ [DEBUG] S3 Upload Error Details:', {
                    status: res.status,
                    statusText: res.statusText,
                    errorBody: errorText
                });

                throw new Error(`Upload URL request failed: ${res.status} ${res.statusText} - ${errorText}`);
            }

            const responseData = await res.json();
            console.log('✅ [DEBUG] S3 Upload Success Response:', responseData);
            return responseData;
        } catch (error) {
            console.error('❌ [DEBUG] S3 Upload Network Error:', error);
            throw error;
        }
    },

    uploadFile: async (file: File, uploadUrl: string) => {
        const res = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });

        if (!res.ok) throw new Error('Upload failed');
        return true;
    },

    deleteFile: async (fileUrl: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('User not authenticated');

        const key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));
        const res = await fetch(`${process.env.REACT_APP_API_URL}/upload/delete-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ key }),
        });

        if (!res.ok) throw new Error('Failed to delete file');
        return true;
    },
};
