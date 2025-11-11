import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import filterIcon from '../assets/images/pre/filter.png';
import archiveIcon from '../assets/images/pre/archive.svg';
import eboAvatar from '../assets/images/pre/ebo.png';
import pinBadgeIcon from '../assets/images/pre/pn.svg';
import actionIcon01 from '../assets/images/pre/01.svg';
import actionIcon02 from '../assets/images/pre/02.svg';
import actionIcon03 from '../assets/images/pre/03.svg';
import actionIcon04 from '../assets/images/pre/04.svg';
import actionIcon05 from '../assets/images/pre/05.svg';
import actionIcon06 from '../assets/images/pre/06.svg';
import muteArrowIcon from '../assets/images/pre/mute.svg';

const ArchivedChats: React.FC = () => {
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<number | null>(null);
  const [pinnedChats, setPinnedChats] = useState<Set<number>>(new Set());
  const [archivedChatIds, setArchivedChatIds] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const chatListRef = React.useRef<HTMLDivElement>(null);
  const [actionsMenuCoords, setActionsMenuCoords] = useState<{ top: number; right: number } | null>(null);

  const handleActionsMenuClick = (chatId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const isOpening = actionsMenuOpen !== chatId;

    if (isOpening) {
      setActionsMenuOpen(chatId);
      
      // Calculate dropdown position
      if (chatListRef.current) {
        const buttonElement = event.currentTarget as HTMLElement;
        const cardElement = buttonElement.closest('.chat-card') as HTMLElement;
        const buttonRect = buttonElement.getBoundingClientRect();
        const cardRect = cardElement.getBoundingClientRect();
        const containerRect = chatListRef.current.getBoundingClientRect();
        const scrollTop = chatListRef.current.scrollTop;
        
        const top = cardRect.bottom - containerRect.top + scrollTop + 8;
        const right = 16; // 16px from right edge
        
        setActionsMenuCoords({ top, right });
      }
    } else {
      setActionsMenuOpen(null);
      setActionsMenuCoords(null);
    }
  };

  const handleActionSelect = (action: string, chatId: number) => {
    console.log(`Action: ${action} for chat: ${chatId}`);
    
    if (action === 'Pin the chat') {
      setPinnedChats(prev => new Set(prev).add(chatId));
    } else if (action === 'Unpin the chat') {
      setPinnedChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
    } else if (action === 'Unarchive the chat') {
      // Remove from archived list
      setArchivedChatIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
      // Navigate back to messages after a brief moment
      setTimeout(() => {
        navigate('/messages');
      }, 300);
    }
    
    setActionsMenuOpen(null);
    setActionsMenuCoords(null);
  };

  const handleChatClick = (chatId: number) => {
    setActiveChatId(chatId);
    // Navigate to messages page with the chat data
    navigate('/messages');
  };

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
      <div className="px-4 py-3 mb-4" style={{ backgroundColor: '#F4F4F4' }}>
        <p className="text-xs text-center" style={{ color: '#B0B0B0' }}>
          This page contains archived chats.
        </p>
        <p className="text-xs text-center" style={{ color: '#B0B0B0' }}>
          Review past conversations with contacts or groups.
        </p>
      </div>

      {/* Archived Chats List with Overlay */}
      <div className="flex-1 overflow-y-auto relative" ref={chatListRef}>
        {archivedChats.filter(chat => archivedChatIds.has(chat.id)).map((chat) => (
          <div
            key={chat.id}
            className={`chat-card p-4 cursor-pointer transition-colors relative ${actionsMenuOpen === chat.id ? 'mx-2 rounded-lg' : ''}`}
            style={{
              backgroundColor: actionsMenuOpen === chat.id ? '#FFFFFF' : 'transparent',
              boxShadow: actionsMenuOpen === chat.id ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none',
              zIndex: actionsMenuOpen === chat.id ? 45 : 'auto'
            }}
            onClick={() => handleChatClick(chat.id)}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar with Archive Badge and Pin Badge */}
              <div className="relative flex-shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-10 h-10 rounded-sm object-cover"
                />
                {/* Archive Badge */}
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                  <img src={archiveIcon} alt="Archived" className="w-3 h-3" style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(97%) saturate(1636%) hue-rotate(1deg) brightness(102%) contrast(103%)' }} />
                </div>
                {/* Pin Badge */}
                {pinnedChats.has(chat.id) && (
                  <div className="absolute top-0 left-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                    <img src={pinBadgeIcon} alt="Pinned" className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Chat Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium truncate" style={{ color: '#4D4D4D' }}>{chat.name}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    <button
                      onClick={(e) => handleActionsMenuClick(chat.id, e)}
                      className="p-1 rounded transition-colors"
                      style={{
                        color: actionsMenuOpen === chat.id ? '#64B5F6' : '#000000'
                      }}
                    >
                      <span className="text-lg">⋯</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between -mt-1">
                  <p className="text-xs truncate">
                    {chat.sentByUser && (
                      <span className="px-1 py-0.5 rounded text-xs font-medium mr-1" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}>You</span>
                    )}
                    <span style={{ color: '#939393' }}>{chat.lastMessage}</span>
                  </p>
                  <div className="flex items-center ml-2">
                    {chat.isRead ? (
                      <div className="flex items-center" style={{ position: 'relative' }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6', marginLeft: '-6px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9E9E9E' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Actions Menu Overlay and Popup */}
        {actionsMenuOpen !== null && (
          <>
            {/* Semi-transparent overlay - covers entire page */}
            <div
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => {
                setActionsMenuOpen(null);
                setActionsMenuCoords(null);
              }}
            ></div>

            {/* Actions Menu */}
            <div 
              className="actions-menu absolute bg-white shadow-lg border border-gray-200 py-2 z-50 min-w-48" 
              style={actionsMenuCoords
                ? {
                    borderRadius: '24px',
                    top: `${actionsMenuCoords.top}px`,
                    right: `${actionsMenuCoords.right}px`
                  }
                : {
                    borderRadius: '24px',
                    top: '10rem',
                    right: '16px'
                  }
              }
            >
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-thin" style={{ color: '#BABABA' }}>Actions</h3>
                <button
                  onClick={() => {
                    setActionsMenuOpen(null);
                    setActionsMenuCoords(null);
                  }}
                  className="transition-colors"
                  style={{ color: '#374151' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleActionSelect('Mark as read', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <img src={actionIcon01} alt="Mark as read" className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>Mark as read</span>
                </button>

                <button
                  onClick={() => handleActionSelect('Add label', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <img src={actionIcon02} alt="Add label" className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>Add label</span>
                </button>

                <button
                  onClick={() => handleActionSelect('Mute the chat', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <img src={actionIcon03} alt="Mute the chat" className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>Mute the chat</span>
                  <img src={muteArrowIcon} alt="Arrow" className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => handleActionSelect(pinnedChats.has(actionsMenuOpen) ? 'Unpin the chat' : 'Pin the chat', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <img src={actionIcon04} alt={pinnedChats.has(actionsMenuOpen) ? 'Unpin the chat' : 'Pin the chat'} className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>{pinnedChats.has(actionsMenuOpen) ? 'Unpin the chat' : 'Pin the chat'}</span>
                </button>

                <button
                  onClick={() => handleActionSelect('Unarchive the chat', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <img src={actionIcon05} alt="Unarchive the chat" className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>Unarchive the chat</span>
                </button>

                <button
                  onClick={() => handleActionSelect('Delete the chat', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center space-x-3"
                >
                  <img src={actionIcon06} alt="Delete the chat" className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>Delete the chat</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArchivedChats;

