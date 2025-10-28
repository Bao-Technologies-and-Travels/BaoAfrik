export const s3Service = {
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
            headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
             },
            body: JSON.stringify({ key }),
        });

        if (!res.ok) throw new Error('Failed to delete file');
        return true;
    },
};
