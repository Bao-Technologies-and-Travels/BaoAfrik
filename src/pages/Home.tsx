import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-display text-4xl md:text-6xl mb-6">
            Authentic African Products
          </h1>
          <p className="text-body text-xl md:text-2xl mb-8 text-primary-100">
            Connect with the African diaspora. Discover authentic goods from across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/listings" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
              Start Shopping
            </Link>
            <Link to="/create-listing" className="bg-primary-800 hover:bg-primary-900 font-semibold py-3 px-8 rounded-lg transition-colors">
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-center mb-12">
            Why Choose BaoAfrik?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                Direct from Africa with verified country of origin and cultural stories.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Urgent Sales</h3>
              <p className="text-gray-600">
                Find great deals from sellers who need quick sales.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Direct Connection</h3>
              <p className="text-gray-600">
                Chat directly with sellers. Build trust and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Food', emoji: '🍽️', color: 'bg-red-100 text-red-800' },
              { name: 'Clothing', emoji: '👗', color: 'bg-blue-100 text-blue-800' },
              { name: 'Art', emoji: '🎨', color: 'bg-purple-100 text-purple-800' },
              { name: 'Beauty', emoji: '💄', color: 'bg-pink-100 text-pink-800' },
              { name: 'Electronics', emoji: '📱', color: 'bg-green-100 text-green-800' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/listings?category=${category.name.toLowerCase()}`}
                className="card hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <span className={`${category.color} px-3 py-1 rounded-full text-sm font-medium`}>
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
