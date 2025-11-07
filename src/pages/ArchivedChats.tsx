import React from 'react';
import { useNavigate } from 'react-router-dom';
import filterIcon from '../assets/images/pre/filter.png';
import archiveIcon from '../assets/images/pre/archive.svg';
import eboAvatar from '../assets/images/pre/ebo.png';

const ArchivedChats: React.FC = () => {
  const navigate = useNavigate();

  // Mock archived chats data
  const archivedChats = [
    {
      id: 1,
      name: 'Joaquin EDIMO',
      avatar: eboAvatar,
      lastMessage: 'Hello my dear, Yes this item is still available, h...',
      timestamp: 'Yesterday, 10:52',
      isRead: true,
      sentByUser: false
    },
    {
      id: 2,
      name: 'Dylan Abdoulaye',
      avatar: eboAvatar,
      lastMessage: 'Where should I deliver to plea...',
      timestamp: '19/08/25',
      isRead: false,
      sentByUser: true
    },
    {
      id: 3,
      name: 'Enies Lobe',
      avatar: eboAvatar,
      lastMessage: 'Yes is still available',
      timestamp: '18/08/25',
      isRead: true,
      sentByUser: true
    },
    {
      id: 4,
      name: 'Geraldine Tiam',
      avatar: eboAvatar,
      lastMessage: 'Hello, I am interested in this item is...',
      timestamp: '17/08/25',
      isRead: false,
      sentByUser: false
    }
  ];

  return (
    <div className="md:hidden h-screen bg-white flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        {/* Back Arrow */}
        <button onClick={() => navigate('/messages')} className="p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#212121' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-lg font-semibold" style={{ color: '#212121' }}>Archived</h1>

        {/* Filter Icon */}
        <button className="p-2">
          <img src={filterIcon} alt="Filter" className="w-5 h-5" />
        </button>
      </div>

      {/* Description Area */}
      <div className="px-4 py-3" style={{ backgroundColor: '#F4F4F4' }}>
        <p className="text-xs text-center" style={{ color: '#B0B0B0' }}>
          This page contains archived chats.
        </p>
        <p className="text-xs text-center" style={{ color: '#B0B0B0' }}>
          Review past conversations with contacts or groups.
        </p>
      </div>

      {/* Archived Chats List */}
      <div className="flex-1 overflow-y-auto">
        {archivedChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center space-x-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {/* Avatar with Archive Badge */}
            <div className="relative flex-shrink-0">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Archive Badge */}
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                <img src={archiveIcon} alt="Archived" className="w-3.5 h-3.5" style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(97%) saturate(1636%) hue-rotate(1deg) brightness(102%) contrast(103%)' }} />
              </div>
            </div>

            {/* Chat Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500 ml-2">{chat.timestamp}</span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {chat.sentByUser && (
                  <span style={{ color: '#64B5F6' }}>You </span>
                )}
                {chat.lastMessage}
              </p>
            </div>

            {/* Status Indicators */}
            <div className="flex-shrink-0">
              {chat.isRead ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" transform="translate(3, 0)" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9E9E9E' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivedChats;

