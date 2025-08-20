import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="font-display font-bold text-2xl mb-6">User Profile</h1>
        <p className="text-gray-600">Profile management functionality will be implemented here.</p>
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <p>• Bio, photo, location settings</p>
          <p>• Seller verification status</p>
          <p>• Account preferences</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
