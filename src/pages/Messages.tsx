import React from 'react';

const Messages: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="font-display font-bold text-2xl mb-6">Messages</h1>
        <p className="text-gray-600 mb-6">Chat with buyers and sellers directly.</p>
        
        <div className="space-y-4 text-sm text-gray-500">
          <p>• In-app messaging system</p>
          <p>• Message notifications</p>
          <p>• Chat history storage</p>
          <p>• Real-time communication</p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400">No messages yet. Start browsing products to connect with sellers!</p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
