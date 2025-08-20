import React from 'react';

const CreateListing: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="font-display font-bold text-2xl mb-6">Create New Listing</h1>
        <p className="text-gray-600 mb-6">List your authentic African products for the diaspora community.</p>
        
        <div className="space-y-4 text-sm text-gray-500">
          <p>• Product title, description, price</p>
          <p>• Multiple image uploads</p>
          <p>• Category selection (Food, Clothing, Art, Beauty, Electronics)</p>
          <p>• Country of origin with flag display</p>
          <p>• Seller location (country → region → city)</p>
          <p>• Urgency settings for quick sales</p>
          <p>• Optional tags for better discovery</p>
        </div>
        
        <div className="mt-8">
          <button className="btn-primary">
            Start Creating Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
