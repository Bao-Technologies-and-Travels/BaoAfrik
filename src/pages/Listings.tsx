import React from 'react';

const Listings: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <div className="space-y-4 text-sm text-gray-500">
              <p>• Category filters</p>
              <p>• Price range</p>
              <p>• Urgency level</p>
              <p>• Product origin</p>
              <p>• Seller location</p>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display font-bold text-2xl">Browse Products</h1>
            <select className="input-field w-auto">
              <option>Latest</option>
              <option>Trending</option>
              <option>Nearby</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder listing cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="font-semibold mb-2">Sample Product {item}</h3>
                <p className="text-gray-600 text-sm mb-2">Product description...</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">£{(Math.random() * 100 + 10).toFixed(2)}</span>
                  <span className="text-xs text-gray-500">🇳🇬 Nigeria</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
