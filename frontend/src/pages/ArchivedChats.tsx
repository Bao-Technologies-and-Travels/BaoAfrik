import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
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
import { useSocket } from '../contexts/socketContext';

const ArchivedChats: React.FC = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const API_BASE = process.env.REACT_APP_API_URL;
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [archivedConversations, setArchivedConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatListRef = React.useRef<HTMLDivElement>(null);
  const [actionsMenuCoords, setActionsMenuCoords] = useState<{ top: number; right: number } | null>(null);

  // Fetch archived conversations from API
  const fetchArchivedConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      // Fetch all conversations and filter for archived ones
      // The API might not support archived parameter, so we fetch all and filter
      const res = await axios.get(
        `${API_BASE}/chat/conversations`,
        { 
          params: { page: 1, limit: 100 },
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      
      // Filter for archived conversations - trust backend isArchived value
      const convos = res.data?.data || [];
      const archived = convos.filter((c: any) => c.isArchived === true || c.isArchived === 'true');
      setArchivedConversations(archived);
    } catch (err) {
      console.warn('Failed to load archived conversations', err);
      toast.error('Failed to load archived chats');
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchArchivedConversations();
  }, [fetchArchivedConversations]);

  const handleActionsMenuClick = (chatId: string, event: React.MouseEvent) => {
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

  const handleActionSelect = async (action: string, chatId: string) => {
    const token = localStorage.getItem('accessToken');

    try {
      if (action === 'Pin the chat') {
        // Optimistically update UI
        setArchivedConversations(prev => prev.map(conv =>
          conv.id === chatId ? { ...conv, isPinned: true } : conv
        ));
        // Update via API
        await axios.patch(
          `${API_BASE}/chat/conversations/${chatId}/metadata`,
          { isPinned: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Emit to socket
        socket?.emit('update_conversation_metadata', {
          conversationId: chatId,
          isPinned: true
        });
        toast.success('Chat pinned');
      } else if (action === 'Unpin the chat') {
        // Optimistically update UI
        setArchivedConversations(prev => prev.map(conv =>
          conv.id === chatId ? { ...conv, isPinned: false } : conv
        ));
        // Update via API
        await axios.patch(
          `${API_BASE}/chat/conversations/${chatId}/metadata`,
          { isPinned: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Emit to socket
        socket?.emit('update_conversation_metadata', {
          conversationId: chatId,
          isPinned: false
        });
        toast.success('Chat unpinned');
      } else if (action === 'Unarchive the chat') {
        // Optimistically update UI - remove from archived list
        setArchivedConversations(prev => prev.filter(conv => conv.id !== chatId));
        // Update via API
        await axios.patch(
          `${API_BASE}/chat/conversations/${chatId}/metadata`,
          { isArchived: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Emit to socket
        socket?.emit('update_conversation_metadata', {
          conversationId: chatId,
          isArchived: false
        });
        toast.success('Chat unarchived');
      } else if (action === 'Delete the chat') {
        if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
          // Optimistically update UI
          setArchivedConversations(prev => prev.filter(conv => conv.id !== chatId));
          // Delete via API
          await axios.delete(
            `${API_BASE}/chat/conversations/${chatId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Emit to socket
          socket?.emit('delete_conversation', { conversationId: chatId });
          toast.success('Conversation deleted');
        }
      } else if (action === 'Mark as read') {
        // Mark all messages as read
        await axios.put(
          `${API_BASE}/chat/conversations/${chatId}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update UI
        setArchivedConversations(prev => prev.map(conv =>
          conv.id === chatId ? { ...conv, unreadCount: 0 } : conv
        ));
        toast.success('Marked as read');
      }
    } catch (err) {
      console.error('Action failed:', err);
      toast.error('Action failed. Please try again.');
      // Refresh to restore correct state
      fetchArchivedConversations();
    }

    setActionsMenuOpen(null);
    setActionsMenuCoords(null);
  };

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId);
    // Navigate to messages page with the conversation ID
    navigate('/messages', { state: { conversationId: chatId } });
  };

  // Format timestamp for display
  const formatTimestamp = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };

  // Get participant name
  const getParticipantName = (conv: any) => {
    const participant = conv.otherParticipant;
    if (!participant) return 'Unknown User';
    return `${participant.firstName || ''} ${participant.lastName || ''}`.trim() || 'Unknown User';
  };

  // Get participant avatar
  const getParticipantAvatar = (conv: any) => {
    return conv.otherParticipant?.profileImage || eboAvatar;
  };

  // Get last message preview
  const getLastMessagePreview = (conv: any) => {
    const lastMsg = conv.lastMessage;
    if (!lastMsg) return '';
    return lastMsg.content || lastMsg.text || '';
  };

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && archivedConversations.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <img src={archiveIcon} alt="No archived chats" className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-sm text-center" style={{ color: '#B0B0B0' }}>
            No archived chats yet.
          </p>
          <p className="text-xs text-center mt-1" style={{ color: '#B0B0B0' }}>
            Archive chats from the messages page to see them here.
          </p>
        </div>
      )}

      {/* Archived Chats List with Overlay */}
      {!isLoading && archivedConversations.length > 0 && (
        <div className="flex-1 overflow-y-auto relative" ref={chatListRef}>
          {archivedConversations.map((conv) => (
            <div
              key={conv.id}
              className={`chat-card p-4 cursor-pointer transition-colors relative ${actionsMenuOpen === conv.id ? 'mx-2 rounded-lg' : ''}`}
              style={{
                backgroundColor: actionsMenuOpen === conv.id ? '#FFFFFF' : 'transparent',
                boxShadow: actionsMenuOpen === conv.id ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none',
                zIndex: actionsMenuOpen === conv.id ? 45 : 'auto'
              }}
              onClick={() => handleChatClick(conv.id)}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar with Archive Badge and Pin Badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={getParticipantAvatar(conv)}
                    alt={getParticipantName(conv)}
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  {/* Archive Badge */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                    <img src={archiveIcon} alt="Archived" className="w-3 h-3" style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(97%) saturate(1636%) hue-rotate(1deg) brightness(102%) contrast(103%)' }} />
                  </div>
                  {/* Pin Badge */}
                  {conv.isPinned && (
                    <div className="absolute top-0 left-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                      <img src={pinBadgeIcon} alt="Pinned" className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Chat Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium truncate" style={{ color: '#4D4D4D' }}>{getParticipantName(conv)}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{formatTimestamp(conv.lastMessageAt)}</span>
                      <button
                        onClick={(e) => handleActionsMenuClick(conv.id, e)}
                        className="p-1 rounded transition-colors"
                        style={{
                          color: actionsMenuOpen === conv.id ? '#64B5F6' : '#000000'
                        }}
                      >
                        <span className="text-lg">⋯</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between -mt-1">
                    <p className="text-xs truncate flex-1">
                      {conv.lastMessage?.senderId === conv.currentUserId && (
                        <span className="px-1 py-0.5 rounded text-xs font-medium mr-1" style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}>You</span>
                      )}
                      <span style={{ color: '#939393' }}>{getLastMessagePreview(conv)}</span>
                    </p>
                    <div className="flex items-center ml-2">
                      {conv.unreadCount > 0 ? (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                          style={{ backgroundColor: '#64B5F6' }}
                        >
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      ) : (
                        <div className="flex items-center" style={{ position: 'relative' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6', marginLeft: '-6px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
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

                  {(() => {
                    const conv = archivedConversations.find(c => c.id === actionsMenuOpen);
                    const isPinned = conv?.isPinned || false;
                    return (
                      <button
                        onClick={() => handleActionSelect(isPinned ? 'Unpin the chat' : 'Pin the chat', actionsMenuOpen)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <img src={actionIcon04} alt={isPinned ? 'Unpin the chat' : 'Pin the chat'} className="w-4 h-4" />
                        <span className="font-light" style={{ color: '#374151' }}>{isPinned ? 'Unpin the chat' : 'Pin the chat'}</span>
                      </button>
                    );
                  })()}

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
      )}
    </div>
  );
};

export default ArchivedChats;
