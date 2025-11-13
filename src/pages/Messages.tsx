import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import logo from '../assets/images/pre/logo.png';
import sideIcon from '../assets/images/pre/side.png';
import lilLogo from '../assets/images/pre/lil.png';
import messagesIcon from '../assets/images/pre/messages.png';
import filterIcon from '../assets/images/pre/filter.png';
import ssIcon from '../assets/images/pre/ss.png';
import mainIcon from '../assets/images/pre/main.png';
import avatarIcon from '../assets/images/pre/avatar.png';
import basketIcon from '../assets/images/pre/basket.png';
import leftIcon from '../assets/images/pre/left.png';
import fiIcon from '../assets/images/pre/fi.png';
import faIcon from '../assets/images/pre/fa.png';
import eboAvatar from '../assets/images/pre/ebo.png';
import earthIcon from '../assets/images/pre/earth.png';
import locIcon from '../assets/images/pre/loc.png';
import profileIcon from '../assets/images/pre/profile.png';
import faceIcon from '../assets/images/pre/face.png';
import pinIcon from '../assets/images/pre/pin.png';
import bluIcon from '../assets/images/pre/blu.png';
import audioIcon from '../assets/images/pre/audio.svg';
import swiIcon from '../assets/images/pre/swi.svg';
import messageIcon from '../assets/images/pre/message.svg';
import boxIcon from '../assets/images/pre/box.svg';
import groupIcon from '../assets/images/pre/group.svg';
import frameIcon from '../assets/images/pre/frame.svg';
import podsIcon from '../assets/images/pre/pods.svg';
import settingIcon from '../assets/images/pre/setting.svg';
import reactionIcon from '../assets/images/pre/reaction.svg';
import optionIcon from '../assets/images/pre/option.svg';
import notificationIcon from '../assets/images/pre/notification.svg';
import emoji1 from '../assets/images/pre/s1.svg';
import emoji2 from '../assets/images/pre/s2.svg';
import emoji3 from '../assets/images/pre/s3.svg';
import emoji4 from '../assets/images/pre/s4.svg';
import emoji5 from '../assets/images/pre/s5.svg';
import emoji6 from '../assets/images/pre/s6.svg';
import actionIcon01 from '../assets/images/pre/01.svg';
import actionIcon02 from '../assets/images/pre/02.svg';
import actionIcon03 from '../assets/images/pre/03.svg';
import actionIcon04 from '../assets/images/pre/04.svg';
import actionIcon05 from '../assets/images/pre/05.svg';
import actionIcon06 from '../assets/images/pre/06.svg';
import muteArrowIcon from '../assets/images/pre/mute.svg';
import archiveIcon from '../assets/images/pre/archive.svg';
import starIcon from '../assets/images/pre/star.svg';
import translationToggleIcon from '../assets/images/pre/tt.svg';
import replyIcon from '../assets/images/pre/reply.svg';
import copyIcon from '../assets/images/pre/copy.svg';
import tickIcon from '../assets/images/pre/tick.svg';
import pinMenuIcon from '../assets/images/pre/pin.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import replyCloseIcon from '../assets/images/pre/re.svg';
import productImage1 from '../assets/images/pre/1.png';
import amIcon from '../assets/images/pre/AM.svg';
import pinBadgeIcon from '../assets/images/pre/pn.svg';
import documentIcon from '../assets/images/pre/do.svg';
import photoIcon from '../assets/images/pre/ph.svg';
import closeIcon from '../assets/images/pre/cc.svg';
import svgIcon from '../assets/images/pre/svg.svg';

// PDF Icon Component
const PDFIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0H4C1.79086 0 0 1.79086 0 4V52C0 54.2091 1.79086 56 4 56H44C46.2091 56 48 54.2091 48 52V16L32 0Z" fill="#FF1607"/>
    <path d="M32 0L48 16H38C34.6863 16 32 13.3137 32 10V0Z" fill="#FFFFFF80"/>
    <text x="24" y="38" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">PDF</text>
  </svg>
);

// JPG Icon Component
const JPGIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0H4C1.79086 0 0 1.79086 0 4V52C0 54.2091 1.79086 56 4 56H44C46.2091 56 48 54.2091 48 52V16L32 0Z" fill="#E0E0E0"/>
    <path d="M32 0L48 16H38C34.6863 16 32 13.3137 32 10V0Z" fill="#BDBDBD"/>
    <rect x="2" y="40" width="20" height="14" rx="2" fill="#2196F3"/>
    <text x="12" y="51" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">JPG</text>
  </svg>
);

// PNG Icon Component
const PNGIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0H4C1.79086 0 0 1.79086 0 4V52C0 54.2091 1.79086 56 4 56H44C46.2091 56 48 54.2091 48 52V16L32 0Z" fill="#E0E0E0"/>
    <path d="M32 0L48 16H38C34.6863 16 32 13.3137 32 10V0Z" fill="#BDBDBD"/>
    <rect x="2" y="40" width="20" height="14" rx="2" fill="#2196F3"/>
    <text x="12" y="51" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">PNG</text>
  </svg>
);

const Messages: React.FC = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [productData, setProductData] = useState<any>(null);
  const [preFilledMessage, setPreFilledMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [chatEntry, setChatEntry] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const [messageStatuses, setMessageStatuses] = useState<{[key: number]: 'sending' | 'delivered' | 'read'}>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [soundDetected, setSoundDetected] = useState(false);
  const [soundTimer, setSoundTimer] = useState<NodeJS.Timeout | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [waveformTimer, setWaveformTimer] = useState<NodeJS.Timeout | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioPlaybackTime, setAudioPlaybackTime] = useState<{[key: number]: number}>({});
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState<{[key: number]: number}>({});
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<{[key: number]: number}>({});
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [previewPlaybackTime, setPreviewPlaybackTime] = useState(0);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [isAttachActive, setIsAttachActive] = useState(false);
  const [showAttachmentBadges, setShowAttachmentBadges] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [clickedMessageId, setClickedMessageId] = useState<number | null>(null);
  const [isReplyRead, setIsReplyRead] = useState(false);
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const [hasIncomingReply, setHasIncomingReply] = useState(false);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<number | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showCondensedHeader, setShowCondensedHeader] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<any[]>([]);
  const [fadingOutMessageIds, setFadingOutMessageIds] = useState<number[]>([]);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<number | null>(null);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [activeMessageOptionsId, setActiveMessageOptionsId] = useState<number | null>(null);
  const [showMobileArchiveModal, setShowMobileArchiveModal] = useState(false);
  const [actionsMenuCoords, setActionsMenuCoords] = useState<{ top: number; right: number } | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isChatPinned, setIsChatPinned] = useState(false);
  const [showReactionEmojiPicker, setShowReactionEmojiPicker] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [recordedWaveforms, setRecordedWaveforms] = useState<number[]>([]);
  const [mobileMessageOptionsId, setMobileMessageOptionsId] = useState<number | null>(null);
  const [showMobileReactionPicker, setShowMobileReactionPicker] = useState(false);
  const [mobileMessageCoords, setMobileMessageCoords] = useState<{ top: number; left: number } | null>(null);
  const [pinnedMessage, setPinnedMessage] = useState<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const chatListRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window !== 'undefined') {
        setIsMobileViewport(window.innerWidth < 768);
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const handleHomepageClick = () => {
    // Navigate to home page while preserving login state
    navigate('/', { replace: false });
  };

  const handleMenuClick = () => {
    // Navigate to home page with menu opened and highlight Chats option
    navigate('/', { 
      replace: false,
      state: { 
        openMenu: true, 
        highlightChats: true 
      }
    });
  };

  // Limit visible messages to last 3 with smooth fade-out (unless showing all)
  useEffect(() => {
    const MAX_VISIBLE_MESSAGES = 10;
    
    if (messages.length > 0) {
      // If showing all messages, display everything; otherwise show last 10
      const messagesToShow = showAllMessages ? messages : messages.slice(-MAX_VISIBLE_MESSAGES);
      const newMessageIds = messagesToShow.map(m => m.id);
      const currentMessageIds = visibleMessages.map(m => m.id);
      
      // Find messages that need to fade out (old messages not in new list)
      const messagesToFadeOut = visibleMessages.filter(
        msg => !newMessageIds.includes(msg.id)
      );
      
      if (messagesToFadeOut.length > 0 && !showAllMessages) {
        // Start fade-out animation for old messages
        setFadingOutMessageIds(messagesToFadeOut.map(m => m.id));
        
        // After animation completes, remove them and show new messages
        setTimeout(() => {
          setVisibleMessages(messagesToShow);
          setFadingOutMessageIds([]);
          
          // Auto-scroll to bottom (only if not showing all messages)
          setTimeout(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          }, 100);
        }, 500); // Match fade-out animation duration
      } else {
        // No messages to fade out, just update
        setVisibleMessages(messagesToShow);
        
        // Auto-scroll to bottom (only if not showing all messages)
        if (!showAllMessages) {
          setTimeout(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          }, 100);
        }
      }
    }
  }, [messages, showAllMessages]);

  // Auto-scroll for mobile conversation view when it opens
  useEffect(() => {
    if (showMobileConversation && messagesEndRef.current) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300);
    }
  }, [showMobileConversation]);

  // File attachment handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setShowFilePreview(true);
    }
  };

  const handleAttachClick = () => {
    setShowAttachmentBadges(!showAttachmentBadges);
    setIsAttachActive(!isAttachActive);
  };

  const handleAddPhotosClick = () => {
    const fileInput = document.getElementById('photo-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleAddDocumentsClick = () => {
    const fileInput = document.getElementById('document-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) {
      setShowFilePreview(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileClick = (file: any) => {
    // For now, we'll create a download link since we don't have the actual file data
    // In a real app, you would fetch the file from the server
    const link = document.createElement('a');
    link.href = '#'; // Placeholder - in real app this would be the file URL
    link.download = file.name;
    link.click();
    
      // Show a message to the user
      alert(`Opening file: ${file.name} (${formatFileSize(file.size)})`);
    };

    const handleIncomingMessageClick = (messageId: number) => {
      // Toggle the clicked message - if already clicked, hide icons; if not clicked, show icons
      setClickedMessageId(clickedMessageId === messageId ? null : messageId);
      
      // Mark reply as read when user clicks on incoming message
      const message = messages.find(m => m.id === messageId);
      if (message && message.isIncoming) {
        setIsReplyRead(true);
      }
    };

    const handleMobileIncomingMessageClick = (messageId: number, event?: React.MouseEvent) => {
      const isOpening = mobileMessageOptionsId !== messageId;
      
      if (isOpening) {
        setMobileMessageOptionsId(messageId);
        
        // Calculate position relative to clicked message (fixed positioning)
        if (event) {
          const messageElement = (event.currentTarget as HTMLElement).closest('.mobile-message-wrapper') as HTMLElement;
          if (messageElement) {
            const messageRect = messageElement.getBoundingClientRect();
            
            // Position relative to viewport (using fixed positioning)
            const top = messageRect.top;
            const left = 16;
            
            setMobileMessageCoords({ top, left });
          }
        }
      } else {
        setMobileMessageOptionsId(null);
        setMobileMessageCoords(null);
        setShowMobileReactionPicker(false);
      }
      
      // Mark reply as read when user clicks on incoming message
      const message = messages.find(m => m.id === messageId);
      if (message && message.isIncoming) {
        setIsReplyRead(true);
      }
    };

  const handleActionsMenuClick = (chatId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent chat selection
    const isOpening = actionsMenuOpen !== chatId;

    if (isOpening) {
      setActionsMenuOpen(chatId);

      if (isMobileViewport && chatListRef.current) {
        const buttonElement = event.currentTarget as HTMLElement;
        const buttonRect = buttonElement.getBoundingClientRect();
        const containerRect = chatListRef.current.getBoundingClientRect();
        const scrollTop = chatListRef.current.scrollTop;
        const top = buttonRect.bottom - containerRect.top + scrollTop + 24;

        setActionsMenuCoords({ top, right: 16 });
      } else {
        setActionsMenuCoords(null);
      }
    } else {
      setActionsMenuOpen(null);
      setActionsMenuCoords(null);
    }
  };

    const handleActionSelect = (action: string, chatId: number) => {
      console.log(`Action: ${action} for chat: ${chatId}`);
      
      if (action === 'Pin the chat') {
        setIsChatPinned(true);
      } else if (action === 'Unpin the chat') {
        setIsChatPinned(false);
      }
      
      setActionsMenuOpen(null);
      setActionsMenuCoords(null);
      // Here you would implement the actual action logic
    };

  // Emoji picker handlers
  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (emojiObject: any) => {
    setSelectedEmoji(emojiObject.emoji);
    // Add the emoji to the message input
    setMessageText(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    // Trigger typing detection when emoji is added
    handleTypingDetection();
  };

  // Typing detection logic
  const handleTypingDetection = () => {
    setIsUserTyping(true);
    
    // Clear existing timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    
    // Set new timer to stop typing indicator after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      setIsUserTyping(false);
    }, 1500);
    
    setTypingTimer(timer);
  };

  // Render sidebar status indicator
  const renderSidebarStatus = (messageId: number) => {
    const status = messageStatuses[messageId] || 'sending';
    
    switch (status) {
      case 'sending':
  return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        );
      case 'read':
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <svg className="w-4 h-4 -ml-2.5" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Handle reaction button click
  const handleReactionClick = (messageId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // Close message options popup if open
    setActiveMessageOptionsId(null);
    // Toggle reaction popup
    setActiveReactionMessageId(activeReactionMessageId === messageId ? null : messageId);
  };

  // Handle reaction selection
  const handleReactionSelect = (reaction: string) => {
    const messageId = activeReactionMessageId !== null ? activeReactionMessageId : mobileMessageOptionsId;
    
    if (messageId !== null) {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, reaction } 
            : msg
        )
      );
    }
    
    setActiveReactionMessageId(null);
    setMobileMessageOptionsId(null);
    setShowMobileReactionPicker(false);
    setShowReactionEmojiPicker(false);
    setMobileMessageCoords(null);
  };

  // Handle reaction removal
  const handleRemoveReaction = (messageId: number) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId 
          ? { ...msg, reaction: undefined } 
          : msg
      )
    );
  };

  // Handle message options click
  const handleMessageOptionsClick = (messageId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // Close reaction popup and emoji picker if open
    setActiveReactionMessageId(null);
    setShowReactionEmojiPicker(false);
    // Toggle message options popup
    setActiveMessageOptionsId(activeMessageOptionsId === messageId ? null : messageId);
  };

  // Handle message option selection
  const handleMessageOptionSelect = (action: string, messageId?: number) => {
    console.log('Selected action:', action);
    
    if (action === 'reply' && messageId) {
      // Find the message to reply to
      const message = messages.find(m => m.id === messageId);
      if (message) {
        console.log('Setting reply to message:', {
          type: message.type,
          duration: message.duration,
          waveformDataLength: message.waveformData?.length || 0,
          hasAudioUrl: !!message.audioUrl
        });
        setReplyToMessage(message);
      }
    }
    
    if (action === 'important' && messageId) {
      // Toggle important status for the message
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, isImportant: !msg.isImportant }
            : msg
        )
      );
    }
    
    if (action === 'pin' && messageId) {
      // Find the message
      const message = messages.find(m => m.id === messageId);
      if (message) {
        if (message.isPinned) {
          // Unpin the message
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === messageId
                ? { ...msg, isPinned: false }
                : msg
            )
          );
          // Clear pinned message preview if this was the pinned message
          if (pinnedMessage && pinnedMessage.id === messageId) {
            setPinnedMessage(null);
          }
        } else {
          // Pin the message
          setPinnedMessage(message);
          // Also mark message as pinned
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === messageId
                ? { ...msg, isPinned: true }
                : msg
            )
          );
        }
      }
    }
    
    // Close the options menu (both desktop and mobile)
    setActiveMessageOptionsId(null);
    setMobileMessageOptionsId(null);
    setShowMobileReactionPicker(false);
    setMobileMessageCoords(null);
  };

  // Handle important badge removal
  const handleRemoveImportant = (messageId: number) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, isImportant: false }
          : msg
      )
    );
  };

  // Handle pin badge removal
  const handleRemovePin = (messageId: number) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, isPinned: false }
          : msg
      )
    );
    // Clear pinned message preview if this was the pinned message
    if (pinnedMessage && pinnedMessage.id === messageId) {
      setPinnedMessage(null);
    }
  };

  // Handle unpinning from preview
  const handleUnpinMessage = () => {
    if (pinnedMessage) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === pinnedMessage.id
            ? { ...msg, isPinned: false }
            : msg
        )
      );
      setPinnedMessage(null);
    }
  };

  // Close message options popup on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMessageOptionsId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.reaction-container')) {
          setActiveMessageOptionsId(null);
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeMessageOptionsId !== null) {
        setActiveMessageOptionsId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeMessageOptionsId]);

  // Render message status indicator
  const renderMessageStatus = (messageId: number) => {
    const status = messageStatuses[messageId] || 'sending';
    
    switch (status) {
      case 'sending':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        );
      case 'read':
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <svg className="w-4 h-4 -ml-2.5" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
        </div>
        );
      default:
        return null;
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  // Handle incoming product data from Product Detail page
  useEffect(() => {
    if (location.state) {
      const { productData, preFilledMessage } = location.state;
      if (productData) {
        setProductData(productData);
        setPreFilledMessage(preFilledMessage || '');
        // Only set messageText if no messages have been sent yet
        if (!isMessageSent) {
          setMessageText(preFilledMessage || '');
        }
        // Show mobile conversation view when coming from product detail
        setShowMobileConversation(true);
      }
    }
  }, [location.state, isMessageSent]);

  const handleSendMessage = () => {
    // Check if user has typed additional text beyond the prefilled message
    const userTypedText = messageText.trim();
    const hasUserTyped = userTypedText && userTypedText !== preFilledMessage.trim();
    
    // Only include text if user has typed something new, or if there are no files
    const messageToSend = selectedFiles.length > 0 
      ? (hasUserTyped ? userTypedText : '') 
      : (userTypedText || preFilledMessage.trim());
    
    if (messageToSend || selectedFiles.length > 0) {
      const currentTime = new Date();
      const timeString = currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      const dateString = currentTime.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const imageFiles = selectedFiles.filter(f => f.type.startsWith('image/'));
      const documentFiles = selectedFiles.filter(f => !f.type.startsWith('image/'));

      const newMessage = {
        id: Date.now(),
        text: messageToSend,
        timestamp: timeString,
        timeString: timeString,
        dateString: `Today, ${timeString}`,
        productData: isMessageSent ? null : productData, // Only attach product data for first message
        isProductInquiry: !isMessageSent && !!productData,
        sentAt: currentTime,
        images: imageFiles.length > 0 ? imageFiles : [],
        documents: documentFiles.length > 0 ? documentFiles : [],
        attachments: selectedFiles.length > 0 ? selectedFiles.map(file => ({
          name: file.name,
        size: file.size,
        type: file.type
      })) : null,
      replyTo: replyToMessage ? {
        text: replyToMessage.text,
        sender: replyToMessage.isIncoming ? 'Joaquin EDIMO' : 'You',
        type: replyToMessage.type,
        duration: replyToMessage.duration,
        waveformData: replyToMessage.waveformData,
        audioUrl: replyToMessage.audioUrl
      } : null
    };
    
    if (replyToMessage) {
      console.log('Replying to message with waveformData:', replyToMessage.waveformData?.length || 0, 'bars');
    }

    setMessages(prev => [...prev, newMessage]);
           setIsMessageSent(true);
           setMessageText('');
           setPreFilledMessage('');
           setSelectedFiles([]);
           setShowFilePreview(false);
           setReplyToMessage(null);
           
           // Reset incoming reply state when user sends new message
           setHasIncomingReply(false);
           setIsReplyRead(false);

      // Set initial status as 'sending'
      setMessageStatuses(prev => ({
        ...prev,
        [newMessage.id]: 'sending'
      }));

      // Simulate status progression
      setTimeout(() => {
        setMessageStatuses(prev => ({
          ...prev,
          [newMessage.id]: 'delivered'
        }));
      }, 2000); // 2 seconds for delivered

          setTimeout(() => {
            setMessageStatuses(prev => ({
              ...prev,
              [newMessage.id]: 'read'
            }));
            
             // Show typing indicator after 2 seconds (for mock data)
             // In real system, this would be triggered by actual seller typing
             setTimeout(() => {
               setShowTypingIndicator(true);
               setIsSellerTyping(true); // Update sidebar typing status
               
               // Show seller reply after typing indicator
               setTimeout(() => {
                 const replyTime = new Date();
                 const replyTimeString = replyTime.toLocaleTimeString('en-US', {
                   hour: '2-digit',
                   minute: '2-digit',
                   hour12: false
                 });
                 
                const sellerReply = {
                  id: Date.now() + 1,
                  text: "Hello my dear, Yes this item is still available, how much do you want for ?",
                  timestamp: replyTimeString,
                  timeString: replyTimeString,
                  dateString: `Today, ${replyTimeString}`,
                  isIncoming: true,
                  sentAt: replyTime
                };
                 
                setMessages(prev => [...prev, sellerReply]);
                setShowTypingIndicator(false);
                setIsSellerTyping(false); // Stop typing indicator
                setHasIncomingReply(true); // Mark that there's an incoming reply
                setIsReplyRead(false); // Mark reply as unread
                setShowCondensedHeader(true); // Collapse header when seller replies
                
                // Update chat entry with seller's reply
                setChatEntry((prev: any) => ({
                  ...prev,
                  lastMessage: sellerReply.text.length > 30 ? sellerReply.text.substring(0, 30) + '...' : sellerReply.text,
                  timestamp: `Today, ${replyTimeString}`
                }));
                
                // Auto-transition to read state after 3 seconds since chat is open
                setTimeout(() => {
                  setIsReplyRead(true);
                }, 3000);
               }, 2000); // 2 seconds of typing indicator
             }, 2000); // 2 seconds delay before showing typing indicator
          }, 5000); // 5 seconds for read

      // Create or update chat entry for sidebar
      const chatId = chatEntry?.id || Date.now();
      const hasImages = imageFiles.length > 0;
      const hasDocuments = documentFiles.length > 0;
      
      // Detect specific document types
      let documentType = '';
      if (hasDocuments && documentFiles.length > 0) {
        const firstDocExt = documentFiles[0].name.split('.').pop()?.toLowerCase();
        if (firstDocExt === 'pdf') {
          documentType = 'pdf';
        } else if (firstDocExt === 'jpg' || firstDocExt === 'jpeg') {
          documentType = 'jpg';
        } else if (firstDocExt === 'png') {
          documentType = 'png';
        }
      }
      
      const displayMessage = hasImages && !messageToSend 
        ? 'Image' 
        : hasDocuments && !messageToSend && documentType === 'pdf'
        ? 'Document'
        : hasDocuments && !messageToSend && documentType === 'jpg'
        ? 'JPG File'
        : hasDocuments && !messageToSend && documentType === 'png'
        ? 'PNG File'
        : hasDocuments && !messageToSend
        ? 'Document'
        : messageToSend.length > 30 ? messageToSend.substring(0, 30) + '...' : messageToSend;
      
      setChatEntry({
        id: chatId,
        name: 'Joaquin EDIMO',
        avatar: eboAvatar,
        lastMessage: displayMessage,
        timestamp: `Today, ${timeString}`,
        isRead: false,
        isActive: true,
        sentByUser: true,
        hasImage: hasImages,
        hasDocument: hasDocuments,
        documentType: documentType,
        messageId: newMessage.id // Link to the latest message for status sync
      });
      
      if (!activeChatId) {
        setActiveChatId(chatId); // Set as active chat
      }
    }
  };

  const handleAudioRecord = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setSoundDetected(false);
    
    // Start with empty waveform - bars will be added progressively
    setAudioLevels([]);
    
    // Start recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setRecordingTimer(timer);
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      
      // Create MediaRecorder for actual recording
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        setAudioChunks(chunks);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      
      // Create audio context and analyser for visualization
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.3; // Lower for more responsive waveforms
      source.connect(analyserNode);
      
      setAudioContext(audioCtx);
      setAnalyser(analyserNode);
      
      // Buffer for audio data
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Progressive waveform building - Instagram style
      const waveformTimer = setInterval(() => {
        analyserNode.getByteTimeDomainData(dataArray);
        
        // Calculate current audio level (amplitude)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const value = dataArray[i] - 128; // Convert to signed
          sum += Math.abs(value);
        }
        const averageLevel = sum / bufferLength;
        
        // Normalize to get bar height (0.2-1.0 range)
        // Short bars when quiet, tall bars when loud
        const barHeight = Math.max(0.15, Math.min(1.0, (averageLevel / 128) * 3));
        
        // Detect if voice/sound is present (threshold ~0.3)
        const hasVoice = barHeight > 0.3;
        setSoundDetected(hasVoice);
        
        // Add new bar to the waveform array (Instagram style - left to right)
        setAudioLevels(prev => {
          const newLevels = [...prev, barHeight];
          // Limit to 50 bars max (will scroll effect naturally)
          return newLevels.slice(-50);
        });
        
      }, 100); // Add new bar every 100ms
      
      setWaveformTimer(waveformTimer);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Fallback to visual-only recording if mic access fails
      alert('Could not access microphone. Recording will continue without audio visualization.');
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setSoundDetected(false);
    
    // Save the recorded waveforms before clearing
    setRecordedWaveforms([...audioLevels]);
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    if (soundTimer) {
      clearTimeout(soundTimer);
      setSoundTimer(null);
    }
    
    if (waveformTimer) {
      clearInterval(waveformTimer);
      setWaveformTimer(null);
    }
    
    // Stop MediaRecorder
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    // Stop microphone and clean up audio resources
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    
    setAnalyser(null);
    
    // Keep the recorded waveforms for preview (don't reset)
    // Keep the recording time for display purposes
  };

  const handleSendVoiceMessage = () => {
    if (recordingTime > 0) {
      // Clear any incoming reply state when sending a new message
      setHasIncomingReply(false);
      setIsReplyRead(false);
      setIsSellerTyping(false);
      
      const currentTime = new Date();
      const timeString = currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      const dateString = currentTime.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create audio blob from recorded chunks
      const audioBlob = audioChunks.length > 0 ? new Blob(audioChunks, { type: 'audio/webm' }) : null;
      const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

      const newMessage = {
        id: Date.now(),
        type: 'voice',
        duration: recordingTime,
        timestamp: timeString,
        timeString: timeString,
        dateString: `Today, ${timeString}`,
        sentAt: currentTime,
        audioUrl: audioUrl,
        waveformData: [...recordedWaveforms],
        replyTo: replyToMessage ? {
          text: replyToMessage.text,
          sender: replyToMessage.isIncoming ? 'Joaquin EDIMO' : 'You',
          type: replyToMessage.type,
          duration: replyToMessage.duration,
          waveformData: replyToMessage.waveformData,
          audioUrl: replyToMessage.audioUrl
        } : null
      };
      
      console.log('Sending voice note with waveformData:', recordedWaveforms.length, 'bars');
      
      setMessages(prev => [...prev, newMessage]);
      setRecordingTime(0);
      setIsMessageSent(true);
      
      // Set initial status as 'sending'
      setMessageStatuses(prev => ({
        ...prev,
        [newMessage.id]: 'sending'
      }));

      // Simulate status progression
      setTimeout(() => {
        setMessageStatuses(prev => ({
          ...prev,
          [newMessage.id]: 'delivered'
        }));
      }, 2000);

      setTimeout(() => {
        setMessageStatuses(prev => ({
          ...prev,
          [newMessage.id]: 'read'
        }));
        
        // Show typing indicator after voice message is read
        setIsSellerTyping(true);
        setHasIncomingReply(false);
        
        setTimeout(() => {
          setIsSellerTyping(false);
          setHasIncomingReply(true);
          setIsReplyRead(false);
          
          // Add incoming reply message
          const replyTime = new Date();
          const replyTimeString = replyTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Thanks for the voice note! I'll review it and get back to you shortly.",
            timestamp: replyTimeString,
            timeString: replyTimeString,
            dateString: `Today, ${replyTimeString}`,
            isIncoming: true,
            sentAt: replyTime
          }]);
          
          // Auto-transition to read state after 3 seconds since chat is open
          setTimeout(() => {
            setIsReplyRead(true);
          }, 3000);
         }, 2000); // 2 seconds of typing indicator
      }, 5000); // 5 seconds for read

      // Update chat entry with latest message
      const chatId = chatEntry?.id || Date.now();
      const voiceDuration = `${Math.floor(recordingTime / 60).toString().padStart(2, '0')} : ${(recordingTime % 60).toString().padStart(2, '0')} - Audio`;
      setChatEntry({
        id: chatId,
        name: 'Joaquin EDIMO',
        avatar: eboAvatar,
        lastMessage: voiceDuration,
        timestamp: `Today, ${timeString}`,
        isRead: false,
        isActive: true,
        sentByUser: true,
        hasVoiceNote: true,
        voiceDuration: recordingTime,
        messageId: newMessage.id
      });
      setActiveChatId(chatId); // Set as active chat
      
      // Clear reply preview and audio chunks after sending voice message
      setReplyToMessage(null);
      setAudioChunks([]);
      setMediaRecorder(null);
      setRecordedWaveforms([]);
      setAudioLevels([]);
      
      // Clean up preview audio if playing
      if (previewAudio) {
        previewAudio.pause();
        setPreviewAudio(null);
      }
      setIsPreviewPlaying(false);
      setPreviewPlaybackTime(0);
      
      // No seller reply for voice messages - voice messages don't trigger responses
    }
  };

  // Handle audio preview playback (before sending)
  const handlePreviewPlayback = () => {
    // If already playing, pause it
    if (isPreviewPlaying && previewAudio) {
      previewAudio.pause();
      setIsPreviewPlaying(false);
      return;
    }

    // Create audio from recorded chunks
    if (audioChunks.length === 0) return;
    
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    setPreviewAudio(audio);
    setIsPreviewPlaying(true);
    setPreviewPlaybackTime(recordingTime);

    // Update countdown timer
    const updateTimer = setInterval(() => {
      setPreviewPlaybackTime(prev => {
        const remaining = Math.max(0, prev - 1);
        if (remaining === 0) {
          clearInterval(updateTimer);
        }
        return remaining;
      });
    }, 1000);

    // Handle audio end
    audio.onended = () => {
      setIsPreviewPlaying(false);
      setPreviewAudio(null);
      clearInterval(updateTimer);
      setPreviewPlaybackTime(recordingTime);
      URL.revokeObjectURL(audioUrl);
    };

    // Handle audio pause
    audio.onpause = () => {
      clearInterval(updateTimer);
    };

    audio.play();
  };

  // Handle audio playback with play/pause toggle and countdown
  const handleAudioPlayback = (messageId: number, audioUrl: string, duration: number) => {
    // If this message is already playing, pause it
    if (playingMessageId === messageId && currentAudio) {
      currentAudio.pause();
      setPlayingMessageId(null);
      setCurrentAudio(null);
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create and play new audio
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    setPlayingMessageId(messageId);
    
    // Initialize playback time to full duration
    setAudioPlaybackTime(prev => ({
      ...prev,
      [messageId]: duration
    }));
    
    // Initialize progress to 0
    setAudioPlaybackProgress(prev => ({
      ...prev,
      [messageId]: 0
    }));

    // Update countdown timer and progress
    const updateTimer = setInterval(() => {
      if (audio.currentTime && duration > 0) {
        const progress = (audio.currentTime / duration) * 100;
        setAudioPlaybackProgress(prev => ({
          ...prev,
          [messageId]: progress
        }));
      }
      
      setAudioPlaybackTime(prev => {
        const remaining = Math.max(0, (prev[messageId] || duration) - 1);
        if (remaining === 0) {
          clearInterval(updateTimer);
        }
        return {
          ...prev,
          [messageId]: remaining
        };
      });
    }, 1000);

    // Handle audio end
    audio.onended = () => {
      setPlayingMessageId(null);
      setCurrentAudio(null);
      clearInterval(updateTimer);
      setAudioPlaybackTime(prev => ({
        ...prev,
        [messageId]: duration
      }));
      setAudioPlaybackProgress(prev => ({
        ...prev,
        [messageId]: 0
      }));
    };

    // Handle audio pause
    audio.onpause = () => {
      clearInterval(updateTimer);
    };
    
    // Apply playback speed if set
    const currentSpeed = audioPlaybackSpeed[messageId] || 1;
    audio.playbackRate = currentSpeed;

    audio.play();
  };
  
  // Handle playback speed change
  const handleSpeedChange = (messageId: number) => {
    const currentSpeed = audioPlaybackSpeed[messageId] || 1;
    let newSpeed = 1;
    
    // Cycle through speeds: 1x → 1.5x → 2x → 1x
    if (currentSpeed === 1) {
      newSpeed = 1.5;
    } else if (currentSpeed === 1.5) {
      newSpeed = 2;
    } else {
      newSpeed = 1;
    }
    
    setAudioPlaybackSpeed(prev => ({
      ...prev,
      [messageId]: newSpeed
    }));
    
    // Apply to currently playing audio if this message is playing
    if (currentAudio && playingMessageId === messageId) {
      currentAudio.playbackRate = newSpeed;
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (soundTimer) {
        clearTimeout(soundTimer);
      }
    };
  }, [recordingTimer, soundTimer]);

  // Handle clicks outside dropdowns
  useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       const target = event.target as HTMLElement;
       const languageSelector = target.closest('.language-selector');
       const menuDropdown = target.closest('.menu-dropdown');
       const emojiPicker = target.closest('.emoji-picker-container');
       const actionsMenu = target.closest('.actions-menu');

       if (!languageSelector && isLanguageDropdownOpen) {
         setIsLanguageDropdownOpen(false);
       }

       if (!menuDropdown && isMenuDropdownOpen) {
         setIsMenuDropdownOpen(false);
       }

       if (!emojiPicker && showEmojiPicker) {
         setShowEmojiPicker(false);
       }

       if (!actionsMenu && actionsMenuOpen !== null) {
         setActionsMenuOpen(null);
       }
     };

     const handleEscapeKey = (event: KeyboardEvent) => {
       if (event.key === 'Escape' && actionsMenuOpen !== null) {
         setActionsMenuOpen(null);
       }
     };

     document.addEventListener('mousedown', handleClickOutside);
     document.addEventListener('keydown', handleEscapeKey);
     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
       document.removeEventListener('keydown', handleEscapeKey);
     };
   }, [isLanguageDropdownOpen, isMenuDropdownOpen, showEmojiPicker, actionsMenuOpen]);

  // Close reaction popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeReactionMessageId !== null && !target.closest('.reaction-container')) {
        setActiveReactionMessageId(null);
        setShowReactionEmojiPicker(false);
      }
    };

    if (activeReactionMessageId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeReactionMessageId]);

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [typingTimer]);

  return (
    <>
      {/* CSS for smooth fade animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOutUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-30px);
          }
        }
        
        .message-fade-out {
          animation: fadeOutUp 0.5s ease-in-out forwards;
        }
        
        /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
    <div className="h-screen bg-gray-50 flex overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hidden file input for file attachments */}
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      {/* Hidden file input for photos only */}
      <input
        id="photo-file-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      {/* Hidden file input for documents only */}
      <input
        id="document-file-input"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      {/* Mobile Conversation View - Full Screen on Mobile */}
      {showMobileConversation && productData && (
        <div className="md:hidden w-full bg-white flex flex-col h-screen overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Seller Profile Section or Condensed Header */}
            {!showCondensedHeader ? (
              <>
                {/* Header with Back Arrow - Only shows with full profile */}
                <div className="p-4 flex items-center justify-between">
                  <button onClick={() => setShowMobileConversation(false)} className="p-2">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {/* Top Right Icons */}
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ border: '0.727px solid #F3F3F3' }}
                    >
                      <img src={fiIcon} alt="Refresh" className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ border: '0.727px solid #F3F3F3' }}
                    >
                      <img src={faIcon} alt="Report" className="w-4 h-4" />
                    </button>
        </div>
      </div>

                {/* Full Profile Header */}
                <div className="px-6 pb-4 pt-0">
                {/* Avatar - overlapping into header */}
                <div className="flex justify-center -mt-8 mb-2">
                  <img 
                    src={eboAvatar} 
                    alt="Joaquin EDIMO"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white"
                  />
    </div>
                
                {/* Name and Rating */}
                <div className="flex items-center justify-center space-x-1.5 mb-2">
                  <h3 className="text-base font-medium text-gray-900">Joaquin EDIMO</h3>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#BABABA' }}>4.3</span>
                </div>

                {/* Website and Location - Side by Side */}
                <div className="flex items-center justify-center space-x-3 mb-2">
                  {/* Website */}
                  <div className="flex items-center space-x-0.5">
                    <img src={earthIcon} alt="Website" className="w-3 h-3" />
                    <span style={{ fontSize: '10px', color: '#64B5F6' }}>user-randomlink.com</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-0.5">
                    <img src={locIcon} alt="Location" className="w-3 h-3" />
                    <span style={{ fontSize: '10px', color: '#64B5F6' }}>London, United Kingdom</span>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <img src={profileIcon} alt="Profile" className="w-3 h-3" style={{ filter: 'brightness(0) saturate(100%) invert(44%) sepia(0%) saturate(0%) hue-rotate(208deg) brightness(94%) contrast(86%)' }} />
                  <span style={{ fontSize: '10px', color: '#6A6A6A' }}>Joined BAO' Afrik in June 2018</span>
                </div>

                {/* Bio - Shortened */}
                <p className="text-xs text-center mb-3" style={{ color: '#BABABA' }}>
                  Passionate about discovering unique products and always on the lookout for great deals.
                </p>

                {/* See User Profile Button */}
                <div className="flex justify-center">
                  <button 
                    className="px-5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ 
                      backgroundColor: '#F0F8FE', 
                      color: '#64B5F6' 
                    }}
                  >
                    See user profile
                  </button>
                </div>
                </div>
              </>
            ) : (
              // Condensed Header Bar - Single Row - Sticky
              <div className="sticky top-0 z-30 bg-white" style={{ borderBottom: '1px solid #F1F1F1' }}>
                <div className="flex items-center justify-between px-4 py-3">
                  {/* Left: Back Arrow */}
                  <button onClick={() => setShowMobileConversation(false)} className="p-1">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Left: Avatar + Name + Rating */}
                  <div className="flex items-center space-x-2 flex-1">
                    <img 
                      src={eboAvatar} 
                      alt="Joaquin EDIMO"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium text-gray-900">Joaquin EDIMO</h3>
                      <div className="flex items-center space-x-1">
                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-xs" style={{ color: '#BABABA' }}>4.3</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Icons */}
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ border: '0.727px solid #F3F3F3' }}
                    >
                      <img src={fiIcon} alt="Refresh" className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ border: '0.727px solid #F3F3F3' }}
                    >
                      <img src={faIcon} alt="Report" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pinned Message Preview - Shows when message is pinned and condensed header is shown */}
            {pinnedMessage && showCondensedHeader && (
              <div className="sticky top-14 z-20 px-4 py-2" style={{ backgroundColor: '#F1F1F1' }}>
                <div className="flex items-center space-x-2">
                  <img 
                    src={pinBadgeIcon} 
                    alt="Pin" 
                    className="w-5 h-5 flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity" 
                    style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(0%) hue-rotate(209deg) brightness(92%) contrast(86%)' }}
                    onClick={handleUnpinMessage}
                  />
                  <div className="flex-1 min-w-0 px-2 py-1.5" style={{ backgroundColor: '#FFFFFF', borderRadius: '6px' }}>
                    <p className="text-xs truncate" style={{ color: '#6A6A6A' }}>
                      {pinnedMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Date Separator */}
            {visibleMessages.length > 0 && !showCondensedHeader && (
              <div className="flex items-center justify-center my-3 px-6">
                <div className="w-12 h-px bg-gray-300"></div>
                <span className="px-2 text-xs text-gray-500">{visibleMessages[0]?.dateString}</span>
                <div className="w-12 h-px bg-gray-300"></div>
              </div>
            )}

            {/* Chat Messages Area */}
            {visibleMessages.length > 0 && (
              <div 
                ref={messagesContainerRef}
                className="px-4 py-2 overflow-y-auto scroll-smooth flex-1 relative"
                style={{ scrollBehavior: 'smooth' }}
              >
                {/* View Older Messages Button */}
                {messages.length > 10 && !showAllMessages && (
                  <div className="flex justify-center mb-3">
                    <button
                      onClick={() => setShowAllMessages(true)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: '#E3F2FD',
                        color: '#64B5F6'
                      }}
                    >
                      View older messages
                    </button>
                  </div>
                )}

                {/* Messages */}
                {visibleMessages.map((message, index) => {
                  const isFadingOut = fadingOutMessageIds.includes(message.id);
                  const isReactionActive = activeReactionMessageId === message.id;
                  return (
                    <div 
                      key={message.id} 
                      className={`mobile-message-wrapper flex mb-3 ${message.isIncoming ? 'justify-start' : 'justify-end'} ${isFadingOut ? 'message-fade-out' : ''}`}
                      style={{
                        animation: isFadingOut ? 'fadeOutUp 0.5s ease-in-out forwards' : 'fadeIn 0.5s ease-in-out',
                        opacity: isFadingOut ? 0 : 1,
                        position: isReactionActive ? 'relative' : 'static',
                        zIndex: isReactionActive ? 50 : 'auto'
                      }}
                    >
                      <div className="max-w-[75%] relative">
                        {/* Images (if present) - NO bubble */}
                        {message.images && message.images.length > 0 && (
                          <div className={`flex flex-wrap gap-1 mb-2 ${message.isIncoming ? 'justify-start' : 'justify-end'}`}>
                            {message.images.map((image: File, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={URL.createObjectURL(image)}
                                alt={image.name}
                                className="object-cover"
                                style={{ 
                                  borderRadius: '12px',
                                  maxWidth: '160px',
                                  maxHeight: '160px'
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Message bubble with text and/or product card and/or documents and/or voice */}
                        {(message.text || (!message.images?.length && message.isProductInquiry && message.productData) || (message.documents && message.documents.length > 0) || message.type === 'voice') && (
                          <div 
                            className={`rounded-2xl p-2.5 ${message.isIncoming ? 'rounded-bl-md' : 'rounded-br-md'} cursor-pointer`} 
                            style={{ 
                              backgroundColor: message.isIncoming ? '#F0F8FE' : '#64B5F6'
                            }}
                            onClick={(e) => handleMobileIncomingMessageClick(message.id, e)}
                          >
                            {/* Voice Message Display */}
                            {message.type === 'voice' ? (
                              <div className="flex items-center space-x-2">
                                {/* Avatar or Speed Button - Mobile */}
                                {playingMessageId === message.id ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSpeedChange(message.id);
                                    }}
                                    className="flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                                    style={{ 
                                      backgroundColor: '#4781AF',
                                      borderRadius: '12px',
                                      width: '36px',
                                      height: '28px',
                                      padding: '0 8px'
                                    }}
                                  >
                                    <span className="text-white text-xs font-medium">
                                      {(audioPlaybackSpeed[message.id] || 1) === 1 ? '1x' : (audioPlaybackSpeed[message.id] || 1) === 1.5 ? '1.5x' : '2x'}
                                    </span>
                                  </button>
                                ) : (
                                  <div className="relative flex-shrink-0">
                                    <img src={avatarIcon} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center" style={{ transform: 'translate(15%, 15%)' }}>
                                      <svg className="w-2 h-2" viewBox="0 0 12 12" fill="none">
                                        <rect x="1" y="4" width="2" height="4" fill="#64B5F6"/>
                                        <rect x="5" y="2" width="2" height="8" fill="#64B5F6"/>
                                        <rect x="9" y="0" width="2" height="12" fill="#64B5F6"/>
                                      </svg>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1.5 flex-shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (message.audioUrl) {
                                        handleAudioPlayback(message.id, message.audioUrl, message.duration);
                                      }
                                    }}
                                    className="hover:opacity-80 transition-opacity"
                                  >
                                    {playingMessageId === message.id ? (
                                      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }}/>
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                        <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }}/>
                                      </svg>
                                    )}
                                  </button>
                                  <span className="text-white text-xs whitespace-nowrap">
                                    {(() => {
                                      const time = audioPlaybackTime[message.id] !== undefined ? audioPlaybackTime[message.id] : message.duration;
                                      return `${Math.floor(time / 60).toString().padStart(2, '0')} : ${(time % 60).toString().padStart(2, '0')} - Audio`;
                                    })()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center space-x-0.5 flex-shrink-0">
                                  {(message.waveformData && message.waveformData.length > 0 ? 
                                    message.waveformData.slice(-20).map((level: number, i: number) => {
                                      const progress = audioPlaybackProgress[message.id] || 0;
                                      const isPlayed = playingMessageId === message.id && (i / 20) * 100 <= progress;
                                      return (
                                        <div
                                          key={i}
                                          className="w-0.5 rounded-full"
                                          style={{
                                            height: `${Math.max(3, level * 15)}px`,
                                            backgroundColor: isPlayed ? '#FFFFFF' : '#CFE8FC'
                                          }}
                                        />
                                      );
                                    })
                                  : 
                                    [3,5,3,6,9,11,13,11,9,6,5,3,6,8,9,8,6,5,3,5].map((h, i) => {
                                      const progress = audioPlaybackProgress[message.id] || 0;
                                      const isPlayed = playingMessageId === message.id && (i / 20) * 100 <= progress;
                                      return (
                                        <div
                                          key={i}
                                          className="w-0.5 rounded-full"
                                          style={{
                                            height: `${h}px`,
                                            backgroundColor: isPlayed ? '#FFFFFF' : '#CFE8FC'
                                          }}
                                        />
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Reply Section - Mobile */}
                                {message.replyTo && (
                                  <div className="mb-2">
                                    {/* User's reply text at top */}
                                    <p style={{ fontSize: '12px', marginBottom: '6px', color: message.isIncoming ? '#6A6A6A' : '#FFFFFF' }}>
                                      {message.text}
                                    </p>
                                    
                                    {message.replyTo.type === 'voice' ? (
                                      /* Voice Note Reply - Screenshot Structure - TWO LINES */
                                      <div className="flex items-start">
                                        {/* White vertical line on LEFT */}
                                        <div 
                                          className="rounded-full mr-1.5"
                                          style={{ 
                                            width: '2px',
                                            backgroundColor: message.isIncoming ? '#64B5F6' : '#FFFFFF',
                                            height: '32px',
                                            flexShrink: 0
                                          }}
                                        ></div>
                                        
                                        <div className="flex-1">
                                          {/* "You" text in light blue - ABOVE */}
                                          <div style={{ fontSize: '10px', color: message.isIncoming ? '#64B5F6' : '#CFE8FC', fontWeight: 500, marginBottom: '4px' }}>
                                            {message.replyTo.sender}
                                          </div>
                                          
                                          {/* Audio preview - BELOW "You" */}
                                          <div className="flex items-center">
                                            {/* Speed button - appears when playing */}
                                            {playingMessageId === message.id && (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleSpeedChange(message.id);
                                                }}
                                                className="flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                                                style={{ 
                                                  backgroundColor: '#4781AF',
                                                  borderRadius: '8px',
                                                  width: '28px',
                                                  height: '20px',
                                                  padding: '0 6px',
                                                  marginRight: '6px'
                                                }}
                                              >
                                                <span className="text-white" style={{ fontSize: '9px', fontWeight: 500 }}>
                                                  {(audioPlaybackSpeed[message.id] || 1) === 1 ? '1x' : (audioPlaybackSpeed[message.id] || 1) === 1.5 ? '1.5x' : '2x'}
                                                </span>
                                              </button>
                                            )}
                                            
                                            {/* Duration */}
                                            <span style={{ fontSize: '10px', color: message.isIncoming ? '#6A6A6A' : 'rgba(255, 255, 255, 0.6)', marginRight: '6px' }}>
                                              {Math.floor((message.replyTo.duration || 0) / 60).toString().padStart(2, '0')}:{((message.replyTo.duration || 0) % 60).toString().padStart(2, '0')}
                                            </span>
                                            
                                            {/* Waveform */}
                                            <div className="flex items-center space-x-0.5 flex-1">
                                              {(message.replyTo.waveformData && message.replyTo.waveformData.length > 0 ? 
                                                message.replyTo.waveformData.slice(-20).map((level: number, i: number) => {
                                                  const progress = audioPlaybackProgress[message.id] || 0;
                                                  const totalBars = Math.min(20, message.replyTo.waveformData.length);
                                                  const isPlayed = playingMessageId === message.id && (i / totalBars) * 100 <= progress;
                                                  return (
                                                    <div
                                                      key={i}
                                                      style={{ 
                                                        width: '1.5px',
                                                        height: `${Math.max(2, level * 8)}px`,
                                                        backgroundColor: isPlayed ? '#FFFFFF' : (message.isIncoming ? '#6A6A6A' : '#CFE8FC'),
                                                        borderRadius: '1px'
                                                      }}
                                                    />
                                                  );
                                                })
                                              : 
                                                [2,3,2,4,6,7,8,7,6,4,6,5,3,6,8,9,8,6,5,3].map((h, i) => {
                                                  const progress = audioPlaybackProgress[message.id] || 0;
                                                  const isPlayed = playingMessageId === message.id && (i / 20) * 100 <= progress;
                                                  return (
                                                    <div
                                                      key={i}
                                                      style={{ 
                                                        width: '1.5px',
                                                        height: `${h}px`,
                                                        backgroundColor: isPlayed ? '#FFFFFF' : (message.isIncoming ? '#6A6A6A' : '#CFE8FC'),
                                                        borderRadius: '1px'
                                                      }}
                                                    />
                                                  );
                                                })
                                              )}
                                            </div>
                                            
                                            {/* Play/Pause button - far right */}
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (message.replyTo.audioUrl) {
                                                  handleAudioPlayback(message.id, message.replyTo.audioUrl, message.replyTo.duration);
                                                }
                                              }}
                                              className="ml-3 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
                                              style={{ 
                                                width: '18px',
                                                height: '18px',
                                                backgroundColor: '#FFFFFF'
                                              }}
                                            >
                                              {playingMessageId === message.id ? (
                                                <svg style={{ width: '12px', height: '12px', color: '#64B5F6' }} fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                </svg>
                                              ) : (
                                                <svg style={{ width: '12px', height: '12px', color: '#64B5F6' }} fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M8 5v14l11-7z" />
                                                </svg>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Text Reply */
                                      <div className="flex items-stretch">
                                        {/* Vertical line */}
                                        <div 
                                          className="rounded-full mr-1.5"
                                          style={{ 
                                            width: '2px',
                                            backgroundColor: message.isIncoming ? '#64B5F6' : '#FFFFFF',
                                            flexShrink: 0
                                          }}
                                        ></div>
                                        
                                        {/* Quoted message info */}
                                        <div className="flex-1">
                                          <p style={{ fontSize: '10px', fontWeight: 500, marginBottom: '2px', color: message.isIncoming ? '#64B5F6' : 'rgba(255, 255, 255, 0.9)' }}>
                                            {message.replyTo.sender}
                                          </p>
                                          <p style={{ fontSize: '10px', color: message.isIncoming ? '#6A6A6A' : 'rgba(255, 255, 255, 0.6)' }}>
                                            {message.replyTo.text}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Message Text (only show if no reply) */}
                                {!message.replyTo && message.text && (
                                  <p 
                                    style={{ fontSize: '12px', marginBottom: 0, color: message.isIncoming ? '#6A6A6A' : '#FFFFFF' }}
                                  >
                                    {message.text}
                                  </p>
                                )}
                            
                            {/* Product Card in Message - Only for first message */}
                            {message.isProductInquiry && message.productData && (
                              <div className="rounded-lg p-1.5 mt-2">
                              <div className="flex space-x-2">
                                <div className="relative">
                                  <div className="absolute -left-1.5 top-0 w-0.5 h-12" style={{ backgroundColor: '#FFFFFF' }}></div>
                                  <img 
                                    src={message.productData.image} 
                                    alt={message.productData.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div style={{ fontSize: '9px', fontWeight: 600, color: '#B8DDFB' }}>USD {message.productData.price}</div>
                                    <div className="flex items-center space-x-0.5" style={{ fontSize: '5.5px', color: '#B8DDFB' }}>
                                      <img src={locIcon} alt="Location" className="w-1.5 h-1.5" />
                                      <span>{message.productData.location}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <h4 style={{ fontSize: '7px', fontWeight: 500, color: '#B8DDFB' }}>{message.productData.name}</h4>
                                    <div style={{ fontSize: '5.5px', color: '#B8DDFB' }}>
                                      <span>Category: {message.productData.category || 'Spices'}</span>
                                    </div>
                                  </div>
                                  <p style={{ fontSize: '5.5px', marginTop: '2px', lineHeight: '1.3', color: '#B8DDFB' }}>
                                    Premium White Pepper sourced from the fertile soils of Africa. Known for its smooth, aromatic heat and rich flavor...
                                  </p>
                                  <a href="#" style={{ fontSize: '6px', marginTop: '2px', display: 'block', color: '#1976D2' }}>
                                    baoafrik.com/product-id-link?
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                            {/* Document Display in Message */}
                            {message.documents && message.documents.length > 0 && (
                              <div className={message.text ? 'mt-2' : ''}>
                                {message.documents.map((doc: File, docIndex: number) => {
                                  const fileName = doc.name.split('.');
                                  const extension = fileName.pop() || '';
                                  const nameWithoutExt = fileName.join('.');
                                  const fileSizeMB = doc.size / (1024 * 1024);
                                  const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
                                  const extensionLower = extension.toLowerCase();
                                  const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                                  return (
                                    <div key={docIndex} className="flex items-center space-x-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                      <DocumentIcon size={32} />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs truncate" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                                          {nameWithoutExt} · {extension}
                                        </p>
                                        <p style={{ fontSize: '10px', color: '#B8DDFB' }}>
                                          {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                              </>
                            )}
                          </div>
                        )}

                        <div className={`flex items-center mt-1 space-x-1 text-xs ${message.isIncoming ? 'justify-start' : 'justify-end'}`} style={{ color: '#6A6A6A' }}>
                          <span>{message.timeString}</span>
                          {!message.isIncoming && messageStatuses[message.id] && (
                            <div className="flex items-center">
                              {messageStatuses[message.id] === 'sending' && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9E9E9E' }}>
                                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/>
                                </svg>
                              )}
                              {messageStatuses[message.id] === 'delivered' && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9E9E9E' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                </svg>
                              )}
                              {messageStatuses[message.id] === 'read' && (
                                <div className="flex items-center" style={{ position: 'relative' }}>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                  </svg>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6', marginLeft: '-6px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Reaction Display - inline after timestamp */}
                          {message.reaction && (
                            <div 
                              className="ml-3 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleRemoveReaction(message.id)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #F1F1F1',
                                borderRadius: '20px',
                                padding: '2px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minWidth: '50px',
                                height: '22px',
                                marginTop: '-2px',
                                gap: '6px'
                              }}
                            >
                              <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span style={{ fontSize: '12px', lineHeight: 1 }}>
                                {message.reaction}
                              </span>
                            </div>
                          )}
                          
                          {/* Important Badge - inline after timestamp/reaction */}
                          {message.isImportant && (
                            <div 
                              className="ml-3 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleRemoveImportant(message.id)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #F1F1F1',
                                borderRadius: '20px',
                                padding: '2px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minWidth: '50px',
                                height: '22px',
                                marginTop: '-2px',
                                gap: '6px'
                              }}
                            >
                              <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                          )}
                          
                          {/* Pin Badge - inline after timestamp/reaction/important */}
                          {message.isPinned && (
                            <div 
                              className="ml-3 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleRemovePin(message.id)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #F1F1F1',
                                borderRadius: '20px',
                                padding: '2px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minWidth: '50px',
                                height: '22px',
                                marginTop: '-2px',
                                gap: '6px'
                              }}
                            >
                              <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <img src={pinBadgeIcon} alt="Pin" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)' }} />
                            </div>
                          )}
        </div>
      </div>
    </div>
                  );
                })}
                
                {/* Typing Indicator */}
                {isSellerTyping && (
                  <div className="flex justify-start mb-3">
                    <div className="max-w-20">
                      <div 
                        className="rounded-2xl rounded-bl-md px-3 py-2 flex items-center" 
                        style={{ backgroundColor: '#F0F8FE' }}
                      >
                        <div className="flex space-x-1">
                          <div 
                            className="w-1.5 h-1.5 rounded-full animate-bounce" 
                            style={{ 
                              backgroundColor: '#64B5F6',
                              animationDelay: '0ms'
                            }}
                          ></div>
                          <div 
                            className="w-1.5 h-1.5 rounded-full animate-bounce" 
                            style={{ 
                              backgroundColor: '#64B5F6',
                              animationDelay: '150ms'
                            }}
                          ></div>
                          <div 
                            className="w-1.5 h-1.5 rounded-full animate-bounce" 
                            style={{ 
                              backgroundColor: '#64B5F6',
                              animationDelay: '300ms'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* View Latest Messages Button */}
                {showAllMessages && messages.length > 10 && (
                  <div className="flex justify-center mt-3 mb-3">
                    <button
                      onClick={() => setShowAllMessages(false)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: '#E3F2FD',
                        color: '#64B5F6'
                      }}
                    >
                      View latest messages
                    </button>
                  </div>
                )}
                
                <div ref={messagesEndRef}></div>

                {/* Mobile Message Options and Reactions - Positioned above clicked message */}
                {mobileMessageOptionsId !== null && (
              <>
                {/* Semi-transparent overlay - covers entire page */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-20 z-50"
                  onClick={() => {
                    setMobileMessageOptionsId(null);
                    setShowMobileReactionPicker(false);
                    setMobileMessageCoords(null);
                  }}
                ></div>

                {/* Actions Menu - Positioned above message */}
                <div
                  className="fixed bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                  style={mobileMessageCoords
                    ? { 
                        minWidth: '180px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: `${mobileMessageCoords.top - 250}px`
                      }
                    : {
                        minWidth: '180px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: '100px'
                      }
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium" style={{ color: '#9CA3AF', fontSize: '10px' }}>Actions</span>
                      <button
                        onClick={() => {
                          setMobileMessageOptionsId(null);
                          setShowMobileReactionPicker(false);
                          setMobileMessageCoords(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => handleMessageOptionSelect('reply', mobileMessageOptionsId)}
                      className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={replyIcon} alt="Reply" className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs" style={{ color: '#6B7280' }}>Reply the message</span>
                    </button>

                    <button
                      onClick={() => handleMessageOptionSelect('important', mobileMessageOptionsId)}
                      className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={starIcon} alt="Star" className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs" style={{ color: '#6B7280' }}>Mark as important</span>
                    </button>

                    <button
                      onClick={() => handleMessageOptionSelect('copy', mobileMessageOptionsId)}
                      className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={copyIcon} alt="Copy" className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs" style={{ color: '#6B7280' }}>Copy the message</span>
                    </button>

                    <button
                      onClick={() => handleMessageOptionSelect('select', mobileMessageOptionsId)}
                      className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={tickIcon} alt="Select" className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs" style={{ color: '#6B7280' }}>Select the message</span>
                    </button>

                    <button
                      onClick={() => handleMessageOptionSelect('pin', mobileMessageOptionsId)}
                      className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={pinMenuIcon} alt="Pin" className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        {messages.find(m => m.id === mobileMessageOptionsId)?.isPinned ? 'Unpin the message' : 'Pin the message'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleMessageOptionSelect('delete', mobileMessageOptionsId)}
                      className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={trashIcon} alt="Delete" className="w-3.5 h-3.5 mr-2" />
                      <span className="text-xs" style={{ color: '#6B7280' }}>Delete for me</span>
                    </button>
                  </div>
                </div>

                {/* Reactions Bar - Positioned below Actions menu */}
                <div
                  className="fixed bg-white rounded-full shadow-xl border border-gray-200 z-50"
                  style={mobileMessageCoords
                    ? { 
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: `${mobileMessageCoords.top - 35}px`
                      }
                    : {
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: '305px'
                      }
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1.5 flex items-center space-x-1.5">
                    <button onClick={() => handleReactionSelect('👍')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
                      <Emoji unified="1f44d" size={16} />
                    </button>
                    <button onClick={() => handleReactionSelect('❤️')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
                      <Emoji unified="2764-fe0f" size={16} />
                    </button>
                    <button onClick={() => handleReactionSelect('✅')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
                      <Emoji unified="2705" size={16} />
                    </button>
                    <button onClick={() => handleReactionSelect('😂')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
                      <Emoji unified="1f602" size={16} />
                    </button>
                    <button onClick={() => handleReactionSelect('😊')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
                      <Emoji unified="1f60a" size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMobileReactionPicker(!showMobileReactionPicker);
                      }}
                      className="hover:scale-110 transition-transform flex items-center justify-center"
                      style={{ width: '24px', height: '24px' }}
                    >
                      <img src={emoji6} alt="More reactions" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    </button>
                  </div>

                  {/* Mobile Reaction Emoji Picker */}
                  {showMobileReactionPicker && (
                    <div 
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiObject) => {
                          handleReactionSelect(emojiObject.emoji);
                          setShowMobileReactionPicker(false);
                        }}
                        width={280}
                        height={350}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
              </div>
            )}
          </div>

          {/* Fixed Input Bar at Bottom */}
          <div className="border-t border-gray-200 px-4 py-3 bg-white">
            {/* Product Card - Only show before message is sent */}
            {productData && !isMessageSent && (
              <div className="mb-3 rounded-lg p-2" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="flex items-start justify-between mb-1">
                <span style={{ fontSize: '10px', fontWeight: 500, color: '#83C4F8' }}>From Bao'Afrik</span>
                <button className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#6A6A6A' }}>
                  <svg className="w-1.5 h-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div className="flex space-x-2.5">
                <div className="relative">
                  <div className="absolute -left-1.5 top-0 w-0.5 h-20" style={{ backgroundColor: '#83C4F8' }}></div>
                  <img 
                    src={productData.image} 
                    alt={productData.name}
                    className="w-20 h-20 object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#6A6A6A' }}>USD {productData.price}</div>
                    <div className="flex items-center space-x-0.5" style={{ fontSize: '8px', color: '#BABABA' }}>
                      <img src={locIcon} alt="Location" className="w-2.5 h-2.5" />
                      <span>{productData.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 style={{ fontSize: '10px', fontWeight: 500, color: '#6A6A6A' }}>{productData.name}</h4>
                    <div style={{ fontSize: '8px', color: '#BABABA' }}>
                      <span>Category: {productData.category || 'Spices'}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '8px', marginTop: '4px', lineHeight: '1.4', color: '#6A6A6A' }}>
                    Premium White Pepper sourced from the fertile soils of Africa.<br/>
                    Known for its smooth, aromatic heat and rich flavor...
                  </p>
                  <a href="#" style={{ fontSize: '9px', marginTop: '4px', display: 'block', color: '#83C4F8' }}>
                    baoafrik.com/product-id-link?
                  </a>
                </div>
              </div>
            </div>
            )}
            
            {/* Reply Preview - Mobile */}
            {replyToMessage && (
              <div className="mb-2 relative">
                {replyToMessage.type === 'voice' ? (
                  /* Voice Note Reply Preview - Matches Audio Preview Style */
                  <div 
                    className="flex items-center rounded-md p-2"
                    style={{ 
                      background: 'linear-gradient(to right, #DBEAFE, #64B5F6)',
                      borderRadius: '12px',
                      maxWidth: '85%'
                    }}
                  >
                    {/* Play icon */}
                    <button className="hover:opacity-80 transition-opacity flex-shrink-0">
                      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }}/>
                      </svg>
                    </button>
                    
                    {/* Duration text */}
                    <span className="text-white text-xs mx-2 flex-shrink-0">
                      {Math.floor((replyToMessage.duration || 0) / 60).toString().padStart(2, '0')} : {((replyToMessage.duration || 0) % 60).toString().padStart(2, '0')} - Audio
                    </span>
                    
                    {/* Waveform */}
                    <div className="flex space-x-0.5 items-end flex-1 mx-2">
                      {(replyToMessage.waveformData && replyToMessage.waveformData.length > 0 ? 
                        replyToMessage.waveformData.slice(-20).map((level: number, i: number) => (
                          <div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            style={{ height: `${Math.max(2, level * 15)}px`, minHeight: '2px' }}
                          />
                        ))
                      : 
                        [3,5,3,6,9,11,13,11,9,6,5,3].map((h, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            style={{ height: `${h}px`, minHeight: '2px' }}
                          />
                        ))
                      )}
                    </div>
                    
                    {/* Close button */}
                    <button
                      onClick={() => setReplyToMessage(null)}
                      className="hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Text Reply Preview */
                  <div 
                    className="rounded-lg p-2 pl-4 pr-8 relative flex"
                    style={{ 
                      backgroundColor: '#FAFAFA'
                    }}
                  >
                    {/* Blue line inside */}
                    <div 
                      className="rounded-full mr-3"
                      style={{ 
                        width: '2px',
                        backgroundColor: '#64B5F6',
                        flexShrink: 0
                      }}
                    ></div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="text-xs font-medium mb-0.5" style={{ color: '#64B5F6' }}>
                        {replyToMessage.isIncoming ? 'Joaquin EDIMO' : 'You'}
                      </div>
                      <div className="text-xs" style={{ color: '#6A6A6A' }}>
                        {replyToMessage.text}
                      </div>
                    </div>
                    
                    {/* Close button */}
                    <button
                      onClick={() => setReplyToMessage(null)}
                      className="absolute top-1.5 right-1.5 hover:opacity-70 transition-opacity"
                    >
                      <img src={replyCloseIcon} alt="Close" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Attachment Badges - Above Message Input Bar (Only show when no files selected) */}
            {showAttachmentBadges && selectedFiles.length === 0 && (
              <div className="pl-1 pr-2 pb-2 flex items-center space-x-2">
                <button onClick={handleAddDocumentsClick} className="flex items-center space-x-1.5 px-3 py-1.5" style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}>
                  <img src={documentIcon} alt="Document" className="w-3 h-3" />
                  <span className="text-xs font-medium" style={{ color: '#64B5F6' }}>Add documents</span>
                </button>
                <button onClick={handleAddPhotosClick} className="flex items-center space-x-1.5 px-3 py-1.5" style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}>
                  <img src={photoIcon} alt="Photo" className="w-3 h-3" />
                  <span className="text-xs font-medium" style={{ color: '#64B5F6' }}>Add photos</span>
                </button>
              </div>
            )}

            {/* Files Display */}
            {selectedFiles.length > 0 && (
              <div className="pt-2 px-1 pb-2">
                {selectedFiles.map((file, index) => {
                  const isImage = file.type.startsWith('image/');
                  if (isImage) {
                    return (
                      <div key={index} className="inline-block relative mr-2 mb-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-20 h-20 object-cover"
                          style={{ borderRadius: '12px' }}
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#4D4D4D', border: '2px solid #FFFFFF' }}
                        >
                          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  } else {
                    // Document preview
                    const fileName = file.name.split('.');
                    const extension = fileName.pop() || '';
                    const nameWithoutExt = fileName.join('.');
                    const fileSizeMB = file.size / (1024 * 1024);
                    const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1)); // Rough estimate: ~100KB per page
                    const extensionLower = extension.toLowerCase();
                    const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                    return (
                      <div key={index} className="relative mb-2 p-3 flex items-center space-x-3" style={{ backgroundColor: '#FAFAFA', borderRadius: '10px', fontFamily: 'Poppins, sans-serif' }}>
                        <DocumentIcon size={40} />
                        <div className="flex-1">
                          <p className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                            {nameWithoutExt} · {extension}
                          </p>
                          <p style={{ fontSize: '10px', color: '#B0B0B0' }}>
                            {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center hover:opacity-70"
                        >
                          <img src={closeIcon} alt="Close" className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  }
                })}
                {/* Add More Button - Only show for images */}
                {selectedFiles.some(f => f.type.startsWith('image/')) && (
                  <button
                    onClick={handleAddPhotosClick}
                    className="inline-block w-20 h-20 flex-shrink-0"
                    style={{
                      backgroundColor: '#F0F8FE',
                      border: '2px dashed #64B5F6',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      verticalAlign: 'top'
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {isRecording ? (
              // Recording Interface for Mobile
              <div className="flex items-center" style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '4px' }}>
                <div 
                  className="rounded-full px-4 py-1 flex items-center flex-1 mr-1"
                  style={{ 
                    background: 'linear-gradient(to right, #DBEAFE, #64B5F6)',
                    maxWidth: 'calc(100% - 32px)'
                  }}
                >
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" style={{ boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }}></div>
                    <span className="text-white text-xs">
                      {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
                      {(recordingTime % 60).toString().padStart(2, '0')} - Audio recording
                    </span>
                  </div>
                  <div className="flex space-x-0.5 ml-3 items-end flex-1 justify-end">
                    {audioLevels.map((level, i) => {
                      const height = `${level * 16}px`;
                      const minHeight = '2px';
                      return (
                        <div
                          key={i}
                          className="w-0.5 bg-white rounded-full transition-all duration-150 ease-out"
                          style={{
                            height: Math.max(parseFloat(height), parseFloat(minHeight)) + 'px',
                            minHeight: minHeight
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                
                <button 
                  onClick={handleStopRecording}
                  className="w-7 h-7 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                  style={{ backgroundColor: '#F5F5F5' }}
                >
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div>
                </button>
              </div>
            ) : recordingTime > 0 ? (
              // Audio Preview for Mobile - After Recording
              <div className="space-y-2">
                {/* Audio Preview Bubble */}
                <div 
                  className="flex items-center px-3 py-2"
                  style={{ 
                    background: 'linear-gradient(to right, #DBEAFE, #64B5F6)',
                    borderRadius: '12px',
                    maxWidth: '85%'
                  }}
                >
                  <button
                    onClick={() => {
                      if (isPreviewPlaying) {
                        if (previewAudio) {
                          previewAudio.pause();
                          setIsPreviewPlaying(false);
                        }
                      } else {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);
                        
                        audio.addEventListener('timeupdate', () => {
                          setPreviewPlaybackTime(Math.floor(audio.currentTime));
                        });
                        
                        audio.addEventListener('ended', () => {
                          setIsPreviewPlaying(false);
                          setPreviewPlaybackTime(0);
                        });
                        
                        audio.play();
                        setPreviewAudio(audio);
                        setIsPreviewPlaying(true);
                      }
                    }}
                    className="hover:opacity-80 transition-opacity flex-shrink-0"
                  >
                    {isPreviewPlaying ? (
                      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }}/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }}/>
                      </svg>
                    )}
                  </button>
                  <span className="text-white text-xs mx-2 flex-shrink-0">
                    {Math.floor((isPreviewPlaying ? previewPlaybackTime : recordingTime) / 60).toString().padStart(2, '0')} : {((isPreviewPlaying ? previewPlaybackTime : recordingTime) % 60).toString().padStart(2, '0')} - Audio
                  </span>
                  <div className="flex space-x-0.5 items-end flex-1 mx-2">
                    {recordedWaveforms.length > 0 ? (
                      recordedWaveforms.slice(-20).map((level, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-white rounded-full"
                          style={{ height: `${Math.max(2, level * 15)}px`, minHeight: '2px' }}
                        />
                      ))
                    ) : (
                      [3,5,3,6,9,11,13,11,9,6,5,3,6,8,9,8,6,5,3,5].map((h, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-white rounded-full"
                          style={{ height: `${h}px`, minHeight: '2px' }}
                        />
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setRecordingTime(0);
                      setAudioChunks([]);
                      setAudioLevels([]);
                      setRecordedWaveforms([]);
                      setIsPreviewPlaying(false);
                      setPreviewPlaybackTime(0);
                      if (previewAudio) {
                        previewAudio.pause();
                        setPreviewAudio(null);
                      }
                    }}
                    className="hover:opacity-80 transition-opacity flex-shrink-0"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Message Input Bar */}
                <div className="flex items-center" style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '4px' }}>
                  {/* Emoji Icon */}
                  <div className="relative emoji-picker-container">
                    <button 
                      onClick={handleEmojiClick}
                      className="p-1 hover:text-gray-600"
                    >
                      <img 
                        src={faceIcon} 
                        alt="emoji" 
                        className="w-5 h-5" 
                        style={{ 
                          filter: showEmojiPicker ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)'
                        }}
                      />
                    </button>
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 z-50">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={280}
                          height={350}
                          searchDisabled={false}
                          skinTonesDisabled={true}
                          previewConfig={{
                            showPreview: false
                          }}
                          searchPlaceHolder="Search Emoji"
                        />
                      </div>
                    )}
                  </div>

                  {/* Attachment Icon */}
                  <button 
                    onClick={handleAttachClick}
                    className="p-1.5 transition-colors focus:outline-none"
                    style={{ outline: 'none' }}
                  >
                    <img 
                      src={pinIcon} 
                      alt="attachment" 
                      className="w-5 h-5"
                      style={{
                        filter: isAttachActive ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)'
                      }}
                    />
                  </button>

                  {/* Text Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        handleTypingDetection();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      placeholder="...Write a message"
                      className="w-full px-2 py-1.5 focus:outline-none bg-transparent"
                      style={{ 
                        border: 'none',
                        caretColor: '#64B5F6',
                        fontSize: '11px'
                      }}
                    />
                  </div>

                  {/* Send Button */}
                  <button 
                    onClick={handleSendVoiceMessage}
                    className="p-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <img src={bluIcon} alt="send" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              // Normal Message Input for Mobile
              <div className="flex items-center" style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '4px' }}>
                {/* Emoji Icon */}
                <div className="relative emoji-picker-container">
                  <button 
                    onClick={handleEmojiClick}
                    className="p-1 hover:text-gray-600"
                  >
                    <img 
                      src={faceIcon} 
                      alt="emoji" 
                      className="w-5 h-5" 
                      style={{ 
                        filter: showEmojiPicker ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)'
                      }}
                    />
                  </button>
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 z-50">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={280}
                        height={350}
                        searchDisabled={false}
                        skinTonesDisabled={true}
                        previewConfig={{
                          showPreview: false
                        }}
                        searchPlaceHolder="Search Emoji"
                      />
                    </div>
                  )}
                </div>

                {/* Attachment Icon */}
                <button 
                  onClick={handleAttachClick}
                  className="p-1.5 transition-colors focus:outline-none"
                  style={{ outline: 'none' }}
                >
                  <img 
                    src={pinIcon} 
                    alt="attachment" 
                    className="w-5 h-5"
                    style={{
                      filter: isAttachActive ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)'
                    }}
                  />
                </button>

                {/* Text Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      handleTypingDetection();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder="...Write your message"
                    className="w-full px-2 py-1.5 focus:outline-none bg-transparent"
                    style={{ 
                      border: 'none',
                      caretColor: '#64B5F6',
                      fontSize: '11px'
                    }}
                  />
                </div>

                {/* Voice/Send Button */}
                <button 
                  onClick={messageText.trim() || selectedFiles.length > 0 ? handleSendMessage : handleAudioRecord}
                  className="p-1.5 text-blue-600 hover:text-blue-800"
                >
                  {messageText.trim() || selectedFiles.length > 0 ? (
                    <img src={bluIcon} alt="send" className="w-6 h-6" />
                  ) : (
                    <img src={audioIcon} alt="audio" className="w-6 h-6" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Hidden file input for mobile */}
          <input
            id="mobile-file-input"
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Left Sidebar - Full Height */}
      <div
        ref={chatListRef}
        className={`${showMobileConversation && productData ? 'hidden md:flex' : 'flex'} w-full md:w-1/4 bg-white md:border-r-2 border-gray-300 flex-col h-screen sticky top-0 relative`}
      >
        {/* Header */}
        <header className="bg-white">
          <div className="w-full pl-6 pr-4 sm:pl-6 sm:pr-6 lg:pl-6 lg:pr-8">
            <div className="flex items-center justify-between h-16">
              {/* Desktop - Logo and sidebar button */}
              <div className="hidden md:flex items-center space-x-36 pr-0">
                <img 
                  src={logo} 
                  alt="bao'Afrik" 
                  className="h-8 w-auto"
                />
                <button className="bg-white hover:bg-gray-50 rounded-lg transition-colors w-10 h-10 flex items-center justify-center">
                  <img 
                    src={sideIcon} 
                    alt="Minimize sidebar" 
                    className="w-5 h-5"
                  />
                </button>
              </div>
              
              {/* Mobile - Chats header with icons */}
              <div className="flex md:hidden items-center justify-between w-full">
                <h1 className="text-xl font-normal text-black">Chats</h1>
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <img 
                      src={filterIcon} 
                      alt="Filter" 
                      className="w-5 h-5"
                    />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chats List */}
        <div className="flex-1 flex flex-col">
          {/* Chats Header */}
          <div className="pt-1 px-6 pb-4 md:p-6">
            {/* Desktop - Chats title and filter */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <h1 className="text-xl text-black">Chats</h1>
              <button className="p-2 hover:bg-gray-200 rounded">
                <img 
                  src={filterIcon} 
                  alt="Filter" 
                  className="w-5 h-5"
                />
              </button>
            </div>
            
            {/* Search Bar - visible on all screens */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search a chat?"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
          </div>

          {/* Chat List or Empty State */}
          {chatEntry && (!chatSearchQuery || 
            chatEntry.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) || 
            chatEntry.lastMessage.toLowerCase().includes(chatSearchQuery.toLowerCase())) ? (
            <div className="flex-1 flex flex-col">
              {/* Filter Tabs */}
              <div className="px-4 py-3">
                <div className="relative">
                  {/* Gray baseline */}
                  <div className="absolute bottom-0 -left-4 -right-4 md:left-0 md:right-0 h-px bg-gray-200"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-6 relative">
                      <button 
                        onClick={() => setSelectedTab('All')}
                        className={`text-sm font-medium pb-1 relative ${
                          selectedTab === 'All' 
                            ? 'text-gray-900' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        style={{ 
                          color: selectedTab === 'All' ? '#64B5F6' : undefined
                        }}
                      >
                        All
                        {selectedTab === 'All' && (
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ backgroundColor: '#64B5F6' }}
                          ></div>
                        )}
                      </button>
                      <button 
                        onClick={() => setSelectedTab('Unreads')}
                        className={`text-sm font-medium pb-1 relative flex items-center space-x-1 ${
                          selectedTab === 'Unreads' 
                            ? 'text-gray-900' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        style={{ 
                          color: selectedTab === 'Unreads' ? '#64B5F6' : undefined
                        }}
                      >
                        <span>Unreads</span>
                        <span 
                          className="md:hidden w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: '#E3F2FD',
                            color: '#64B5F6',
                            border: '1px solid white'
                          }}
                        >
                          3
                        </span>
                        {selectedTab === 'Unreads' && (
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ backgroundColor: '#64B5F6' }}
                          ></div>
                        )}
                      </button>
                    </div>
                    
                    {/* Archive Button - Mobile Only */}
                    <button 
                      className="md:hidden pb-1 flex items-center"
                      onClick={() => setShowMobileArchiveModal(true)}
                    >
                      <img src={amIcon} alt="Archived Messages" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Chat Entry */}
              <div className="flex-1 overflow-y-auto p-1">
                <div 
                  className={`p-2 rounded-lg cursor-pointer transition-colors md:hover:bg-gray-50`} 
                  style={{ 
                    backgroundColor: window.innerWidth >= 768 
                      ? (actionsMenuOpen === chatEntry.id 
                          ? '#FFFFFF' 
                          : activeChatId === chatEntry.id 
                            ? '#F5F5F5' 
                            : '#FFFFFF')
                      : '#FFFFFF',
                    boxShadow: actionsMenuOpen === chatEntry.id 
                      ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' 
                      : 'none',
                    zIndex: actionsMenuOpen === chatEntry.id ? 45 : 'auto',
                    position: actionsMenuOpen === chatEntry.id ? 'relative' : 'static'
                  }}
                  onClick={() => {
                    setActiveChatId(chatEntry.id);
                    // Mobile: Open conversation view
                    if (window.innerWidth < 768) {
                      setShowMobileConversation(true);
                    }
                  }}
                >
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <img 
                          src={chatEntry.avatar} 
                          alt={chatEntry.name}
                          className="w-10 h-10 rounded-sm object-cover"
                        />
                        {isChatPinned && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                            <img src={pinBadgeIcon} alt="Pinned" className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm md:text-base font-medium md:font-semibold text-gray-900 truncate">{chatEntry.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">{chatEntry.timestamp}</span>
                          <button
                            onClick={(e) => handleActionsMenuClick(chatEntry.id, e)}
                            className="p-1 rounded transition-colors"
                            style={{ 
                              color: actionsMenuOpen === chatEntry.id ? '#64B5F6' : '#000000'
                            }}
                          >
                            <span className="text-lg">⋯</span>
                          </button>
                        </div>
                      </div>
                        <div className="flex items-center justify-between -mt-1">
                         <p className="text-xs md:text-sm truncate">
                           {isSellerTyping ? (
                             <span style={{ color: '#64B5F6' }}>Typing...</span>
                           ) : hasIncomingReply && !isReplyRead ? (
                             <span style={{ color: '#64B5F6' }}>New message</span>
                           ) : hasIncomingReply && isReplyRead ? (
                             <span className="text-gray-600">
                               {messages.find(m => m.isIncoming)?.text || 'Message'}
                             </span>
                           ) : (
                             <>
                               <span 
                                 className="px-1 py-0.5 rounded text-xs font-medium mr-1"
                                 style={{ 
                                   backgroundColor: '#E3F2FD',
                                   color: '#64B5F6'
                                 }}
                               >
                                 You
                               </span>
                               {chatEntry.hasImage && (
                                 <img src={photoIcon} alt="Image" className="w-3.5 h-3.5 inline mr-1" style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(0%) saturate(0%) hue-rotate(209deg) brightness(96%) contrast(91%)' }} />
                               )}
                               {chatEntry.hasDocument && chatEntry.documentType === 'pdf' && (
                                 <img src={documentIcon} alt="Document" className="w-3.5 h-3.5 inline mr-1" style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(0%) saturate(0%) hue-rotate(209deg) brightness(96%) contrast(91%)' }} />
                               )}
                               {chatEntry.hasDocument && (chatEntry.documentType === 'jpg' || chatEntry.documentType === 'png') && (
                                 <img src={svgIcon} alt="File" className="w-3.5 h-3.5 inline mr-1" style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(0%) saturate(0%) hue-rotate(209deg) brightness(96%) contrast(91%)' }} />
                               )}
                              {chatEntry.hasVoiceNote && (
                                <svg className="w-3.5 h-3.5 inline mr-1" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="1" y="6" width="1.5" height="2" rx="0.75" fill="#4D4D4D"/>
                                  <rect x="4" y="4" width="1.5" height="6" rx="0.75" fill="#4D4D4D"/>
                                  <rect x="7" y="2" width="1.5" height="10" rx="0.75" fill="#4D4D4D"/>
                                  <rect x="10" y="4" width="1.5" height="6" rx="0.75" fill="#4D4D4D"/>
                                  <rect x="13" y="5" width="1.5" height="4" rx="0.75" fill="#4D4D4D"/>
                                </svg>
                              )}
                               <span style={{ color: chatEntry.hasVoiceNote ? '#6A6A6A' : '#4D4D4D' }}>{chatEntry.lastMessage}</span>
                             </>
                           )}
                          </p>
                          <div className="flex items-center ml-2">
                           {isSellerTyping ? (
                             // No indicator when typing
                             <div></div>
                           ) : hasIncomingReply && !isReplyRead ? (
                             // Unread reply - solid blue dot
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#64B5F6' }}></div>
                           ) : hasIncomingReply && isReplyRead ? (
                             // Read reply - empty circle
                             <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>
                           ) : (
                             // User message - show status indicators
                             chatEntry.messageId ? renderSidebarStatus(chatEntry.messageId) : (
                               <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                               </svg>
                             )
                           )}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src={messagesIcon} 
                  alt="Messages" 
                  className="w-12 h-12"
                />
              </div>
              <p className="text-center mb-2" style={{ color: '#999999' }}>Your chats will appear here</p>
              <p className="text-sm text-center flex items-start justify-center">
                <img 
                  src={ssIcon} 
                  alt="Search status" 
                  className="w-4 h-4 mr-0.5 mt-0.5"
                />
                <span style={{ color: '#64B5F6' }}>Love what you see? <span className="cursor-pointer">Reach out to the seller and make it yours.</span></span>
              </p>
            </div>
          )}
        </div>
        
        {/* Actions Menu Overlay and Popup - Sidebar Level */}
        {actionsMenuOpen !== null && (
          <>
            {/* Semi-transparent overlay for sidebar only */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => {
                setActionsMenuOpen(null);
                setActionsMenuCoords(null);
              }}
            ></div>
            
            {/* Actions Menu */}
             <div
              className="actions-menu absolute bg-white shadow-lg border border-gray-200 py-2 z-50 min-w-48"
              style={isMobileViewport && actionsMenuCoords
                ? {
                    borderRadius: '24px',
                    top: `${actionsMenuCoords.top}px`,
                    right: `${actionsMenuCoords.right}px`
                  }
                : {
                    borderRadius: '24px',
                    top: '21rem',
                    right: '1rem'
                  }
              }
            >
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-thin" style={{ color: '#BABABA' }}>Actions</h3>
                <button
                  onClick={() => setActionsMenuOpen(null)}
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
                  onClick={() => handleActionSelect(isChatPinned ? 'Unpin the chat' : 'Pin the chat', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <img src={actionIcon04} alt={isChatPinned ? 'Unpin the chat' : 'Pin the chat'} className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>{isChatPinned ? 'Unpin the chat' : 'Pin the chat'}</span>
                </button>
                
                <button
                  onClick={() => handleActionSelect('Archive the chat', actionsMenuOpen)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                >
                  <img src={actionIcon05} alt="Archive the chat" className="w-4 h-4" />
                  <span className="font-light" style={{ color: '#374151' }}>Archive the chat</span>
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
        
        {/* Archive and Important Section - At Bottom of Sidebar - Only show when there are conversations - Hidden on mobile */}
        {chatEntry && (
          <div className="hidden md:block mt-auto bg-white px-4 py-3">
            <div className="border-t border-gray-300 mx-1 mb-3"></div>
            {/* Archived */}
            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
              <div className="flex items-center space-x-3">
                <img src={archiveIcon} alt="Archived" className="w-5 h-5" style={{ color: '#6A6A6A' }} />
                <span className="text-sm" style={{ color: '#6A6A6A' }}>Archived</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}>4</span>
            </div>
            
            {/* Mark as important */}
            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
              <div className="flex items-center space-x-3">
                <img src={starIcon} alt="Mark as important" className="w-5 h-5" style={{ color: '#6A6A6A' }} />
                <span className="text-sm" style={{ color: '#6A6A6A' }}>Mark as important</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}>+9</span>
            </div>
          </div>
        )}
        
        {/* Mobile Archive Modal - Only show on mobile */}
        {showMobileArchiveModal && (
          <>
            {/* Overlay */}
            <div 
              className="md:hidden fixed inset-0 z-50"
              style={{ backgroundColor: '#0000001A' }}
              onClick={() => setShowMobileArchiveModal(false)}
            ></div>
            
            {/* Modal */}
            <div 
              className="md:hidden fixed bg-white p-3 shadow-lg"
              style={{ borderRadius: '14px', minWidth: '220px', top: '140px', right: '16px', zIndex: 51 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm" style={{ color: '#BABABA' }}>Actions</h3>
                <button
                  onClick={() => setShowMobileArchiveModal(false)}
                  className="transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#171717' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Archived */}
              <div 
                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                onClick={() => {
                  setShowMobileArchiveModal(false);
                  navigate('/archived-chats');
                }}
              >
                <div className="flex items-center space-x-3">
                  <img src={archiveIcon} alt="Archived" className="w-5 h-5" style={{ color: '#6A6A6A' }} />
                  <span className="text-sm" style={{ color: '#6A6A6A' }}>Archived</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}>4</span>
              </div>
              
              {/* Mark as important */}
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={starIcon} alt="Mark as important" className="w-5 h-5" style={{ color: '#6A6A6A' }} />
                  <span className="text-sm" style={{ color: '#6A6A6A' }}>Mark as important</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}>+9</span>
              </div>
            </div>
          </>
        )}
        
      </div>

      {/* Main Content Area */}
      <div className="hidden md:flex flex-1 flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-gray-50">
          <div className="w-full pl-6 pr-4 sm:pl-6 sm:pr-6 lg:pl-6 lg:pr-8">
            <div className="flex items-center justify-between h-16">
              {/* Center - Breadcrumb */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <img 
                  src={leftIcon} 
                  alt="Back" 
                  className="w-5 h-5 cursor-pointer"
                  onClick={handleHomepageClick}
                />
                <span 
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={handleHomepageClick}
                >
                  Homepage
                </span>
                <span className="text-gray-400">/</span>
                <span 
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={handleMenuClick}
                >
                  Menu
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">Chats</span>
              </div>

              {/* Right side - Language, button, profile, notifications */}
              <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg">
                {/* Language Selector */}
                <div className="relative language-selector">
                  <button 
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <span>{selectedLanguage}</span>
                    <img src={translationToggleIcon} alt="Toggle" className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isLanguageDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => handleLanguageSelect('EN')}
                          className="w-full text-left px-4 py-2 text-sm transition-colors"
                          style={{
                            backgroundColor: selectedLanguage === 'EN' ? '#F0F8FE' : 'transparent',
                            color: selectedLanguage === 'EN' ? '#64B5F6' : '#374151'
                          }}
                        >
                          English
                        </button>
                        <button
                          onClick={() => handleLanguageSelect('FR')}
                          className="w-full text-left px-4 py-2 text-sm transition-colors"
                          style={{
                            backgroundColor: selectedLanguage === 'FR' ? '#F0F8FE' : 'transparent',
                            color: selectedLanguage === 'FR' ? '#64B5F6' : '#374151'
                          }}
                        >
                          French
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Become Seller Button */}
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: '#FEF6E9' }}
                >
                  <img 
                    src={basketIcon} 
                    alt="Basket" 
                    className="w-5 h-5"
                    style={{filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)'}}
                  />
                  <span className="text-sm font-normal" style={{ color: '#F9A825' }}>Start Selling</span>
                </Link>

                {/* Notification Button */}
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <img src={notificationIcon} alt="Notifications" className="w-6 h-6" />
                </button>

                {/* Profile Picture */}
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={avatarIcon} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>

                 {/* Menu Button */}
                 <div className="relative menu-dropdown">
                   <button 
                     onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                     className="p-2 text-gray-600 hover:text-gray-900"
                   >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                     <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                       +9
                     </div>
                    </button>
                   
                   {/* Dropdown Menu */}
        {isMenuDropdownOpen && (
          <div className="fixed right-8 top-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 max-h-screen overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #f3f4f6' }}>
                       {/* Start selling button with exit */}
                       <div className="px-3 pb-3 flex items-center justify-between">
                         <Link 
                              to="/register" 
                              className="inline-flex items-center px-3 py-1.5 rounded-lg font-normal text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2" 
                              style={{backgroundColor: '#FFF8F0', color: '#F9A822'}}
                              onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.backgroundColor = '#FFF0E6';
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.backgroundColor = '#FFF8F0';
                              }}
                           onClick={() => setIsMenuDropdownOpen(false)}
                         >
                              <svg className="w-3 h-3 mr-1.5 border border-orange-500 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#F9A822'}}>
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                             </svg>
                             Start selling
                           </Link>
                           <button
                             onClick={() => setIsMenuDropdownOpen(false)}
                             className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                           </button>
                         </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-2 px-3 py-3 border-b border-gray-100">
                             <img 
                               src={avatarIcon} 
                           alt="User avatar" 
                           className="w-12 h-12 rounded-full object-cover"
                           width="48"
                           height="48"
                         />
                         <div className="flex-1">
                           <p className="text-xs text-gray-500">My profile</p>
                           <div className="flex items-center justify-between">
                             <h3 className="text-sm font-bold text-gray-900">Jean Kameni</h3>
                             <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor: '#E3F2FD'}}>
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#64B5F6'}}>
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                             </div>
                           </div>
                         </div>
                       </div>

            {/* Create a new listing button */}
            <div className="px-3 py-3">
              <Link
                to="/create-listing"
                className="block w-full px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                           style={{backgroundColor: '#E3F2FD', color: '#64B5F6'}}
                           onClick={() => setIsMenuDropdownOpen(false)}
                         >
                           <div className="flex items-center justify-center space-x-1.5">
                             <span>Create a new listing</span>
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#64B5F6'}}>
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                             </svg>
                           </div>
                         </Link>
                       </div>

            {/* Navigation Menu Items */}
            <div className="space-y-0.5 px-2">
                         {/* Chats */}
                         <Link 
                           to="/messages" 
                           className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                           onClick={() => setIsMenuDropdownOpen(false)}
                         >
                           <div className="flex items-center space-x-2">
                             <img src={messageIcon} alt="Message" className="w-4 h-4" style={{color: '#64B5F6'}} />
                           <div>
                               <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Chats</div>
                             </div>
                           </div>
                        </Link>

                        {/* My listings */}
                        <Link 
                          to="/my-listings" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                          onClick={() => setIsMenuDropdownOpen(false)}
                        >
                           <div className="flex items-center space-x-2">
                               <img src={boxIcon} alt="Box" className="w-4 h-4" style={{color: '#64B5F6'}} />
                            <div>
                              <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>My listings</div>
                              </div>
                            </div>
                        </Link>

                          {/* My requests */}
                        <Link 
                            to="/my-requests" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                          onClick={() => setIsMenuDropdownOpen(false)}
                        >
                           <div className="flex items-center space-x-2">
                               <img src={groupIcon} alt="Group" className="w-4 h-4" style={{color: '#64B5F6'}} />
                            <div>
                                <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>My requests</div>
                              </div>
                            </div>
                        </Link>


                        {/* Bookmarks */}
                        <Link 
                          to="/bookmarks" 
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                          onClick={() => setIsMenuDropdownOpen(false)}
                        >
                           <div className="flex items-center space-x-2">
                             <img src={frameIcon} alt="Frame" className="w-4 h-4" style={{color: '#64B5F6'}} />
                            <div>
                              <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Bookmarks</div>
                              </div>
                            </div>
                           </Link>

                           {/* Help Center */}
                           <Link 
                             to="/help" 
                             className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                             onClick={() => setIsMenuDropdownOpen(false)}
                           >
                              <div className="flex items-center space-x-2">
                                <img src={podsIcon} alt="Pods" className="w-4 h-4" style={{color: '#64B5F6'}} />
                               <div>
                                 <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Help Center</div>
                               </div>
                             </div>
                            </Link>

                            {/* Settings */}
                            <Link 
                              to="/settings" 
                              className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                              onClick={() => setIsMenuDropdownOpen(false)}
                            >
                               <div className="flex items-center space-x-2">
                                 <img src={settingIcon} alt="Setting" className="w-4 h-4" style={{color: '#64B5F6'}} />
                                <div>
                                  <div className="font-medium text-sm" style={{color: '#6A6A6A'}}>Settings</div>
                                </div>
                              </div>
                             </Link>

                             {/* Log Out */}
                             <div className="px-3 pt-3 border-t border-gray-100">
                               <button 
                                 onClick={() => setIsMenuDropdownOpen(false)}
                                 className="w-full bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                               >
                                 <div className="flex items-center space-x-2">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6A6A6A'}}>
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                   </svg>
                                   <div className="text-left">
                                     <div className="font-medium text-xs" style={{color: '#6A6A6A'}}>Log Out</div>
                                     <div className="text-xs" style={{color: '#6A6A6A'}}>Log out of BAO Afrik</div>
                                   </div>
                                 </div>
                               </button>
                             </div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl mx-8 my-8 flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
          {productData ? (
            // Product Inquiry View
            <div className="flex flex-col h-full relative">
              {/* Dimmed Overlay when reaction or message options popup is active */}
              {(activeReactionMessageId !== null || activeMessageOptionsId !== null) && (
                <div className="absolute inset-0 bg-black bg-opacity-10 z-40 pointer-events-none rounded-2xl"></div>
              )}
              
              {/* Scrollable Content Area (Profile + Product + Messages) */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Seller Profile Header - Conditional Rendering */}
              {!showCondensedHeader ? (
                // Full Profile Header
                <div className="p-6 transition-all duration-500 ease-in-out">
                {/* Top Right Icons */}
                <div className="flex justify-end space-x-3 mb-6">
                  <button className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                    <img 
                      src={fiIcon} 
                      alt="Search" 
                      className="w-6 h-6"
                    />
                  </button>
                  <button className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                    <img 
                      src={faIcon} 
                      alt="Settings" 
                      className="w-6 h-6"
                    />
                  </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg p-6 pt-2 max-w-4xl mx-auto">
                  <div className="text-center">
                    {/* Avatar */}
                    <img 
                      src={eboAvatar} 
                      alt={productData.seller.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                    />
                    
                    {/* Name and Rating */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Joaquin EDIMO</h3>
                      <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-lg" style={{ color: '#BABABA' }}>4.3</span>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-center space-x-6 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={earthIcon} 
                          alt="Website" 
                          className="w-4 h-4"
                        />
                        <span style={{ color: '#64B5F6' }}>user-randomlink.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <img 
                          src={locIcon} 
                          alt="Location" 
                          className="w-4 h-4"
                        />
                        <span style={{ color: '#64B5F6' }}>London, United Kingdom</span>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="flex items-center justify-center space-x-2 text-sm mb-4">
                      <img 
                        src={profileIcon} 
                        alt="Profile" 
                        className="w-4 h-4"
                      />
                      <span style={{ color: '#BABABA' }}>Joined BAO' Afrik in June 2018</span>
                    </div>

                    {/* Description */}
                    <div className="text-left">
                      <p className="text-sm leading-relaxed mb-4 text-justify" style={{ color: '#BABABA' }}>
                        Passionate about discovering unique products and always on the lookout for great deals. I enjoy exploring new brands, trying out innovative items, and supporting businesses that deliver quality and creativity.
                      </p>
                    </div>


                    {/* See User Profile Button */}
                    <button 
                      className="px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ 
                        backgroundColor: '#F0F8FE', 
                        color: '#64B5F6' 
                      }}
                    >
                      See user profile
                    </button>
                  </div>
                </div>
              </div>
              ) : (
                // Condensed Header Bar - Sticky
                <div className="sticky top-0 z-30 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 transition-all duration-500 ease-in-out rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    {/* Profile Picture */}
                    <img 
                      src={eboAvatar} 
                      alt="Joaquin EDIMO"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {/* Name and Rating */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Joaquin EDIMO</h3>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-sm" style={{ color: '#BABABA' }}>4.3</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Icons */}
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <img 
                        src={fiIcon} 
                        alt="Search" 
                        className="w-5 h-5"
                      />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <img 
                        src={faIcon} 
                        alt="Settings" 
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Pinned Message Preview - Shows when message is pinned and condensed header is shown */}
              {pinnedMessage && showCondensedHeader && (
                <div className="sticky top-20 z-20 px-6 py-3" style={{ backgroundColor: '#F1F1F1' }}>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={pinBadgeIcon} 
                      alt="Pin" 
                      className="w-6 h-6 flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity" 
                      style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(0%) hue-rotate(209deg) brightness(92%) contrast(86%)' }}
                      onClick={handleUnpinMessage}
                    />
                    <div className="px-3 py-2" style={{ backgroundColor: '#FFFFFF', borderRadius: '6px', maxWidth: '70%' }}>
                      <p className="text-sm truncate" style={{ color: '#6A6A6A' }}>
                        {pinnedMessage.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages Area */}
              {visibleMessages.length > 0 && (
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 px-6 py-4 overflow-y-auto scroll-smooth"
                  style={{ scrollBehavior: 'smooth', overflowX: 'visible' }}
                >
                  {/* View Older Messages Button */}
                  {messages.length > 10 && !showAllMessages && (
                    <div className="flex justify-center mb-4">
                      <button
                        onClick={() => setShowAllMessages(true)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                        style={{
                          backgroundColor: '#E3F2FD',
                          color: '#64B5F6'
                        }}
                      >
                        View older messages
                      </button>
                    </div>
                  )}

                  {/* Top Timestamp - Shorter lines */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                      <div className="w-16 h-px bg-gray-300"></div>
                      <span className="px-4 text-sm text-gray-500">{visibleMessages[0]?.dateString}</span>
                      <div className="w-16 h-px bg-gray-300"></div>
                    </div>
                  </div>

                  {/* Messages */}
                    {visibleMessages.map((message, index) => {
                      const isFadingOut = fadingOutMessageIds.includes(message.id);
                      const isReactionActive = activeReactionMessageId === message.id;
                      return (
                      <div 
                        key={message.id} 
                        className={`flex mb-4 ${message.isIncoming ? 'justify-start' : 'justify-end'} ${isFadingOut ? 'message-fade-out' : ''}`}
                        style={{
                          animation: isFadingOut ? 'fadeOutUp 0.5s ease-in-out forwards' : 'fadeIn 0.5s ease-in-out',
                          opacity: isFadingOut ? 0 : 1,
                          position: isReactionActive ? 'relative' : 'static',
                          zIndex: isReactionActive ? 50 : 'auto'
                        }}
                      >
                       {/* Reaction and Option Icons - LEFT side for outgoing messages */}
                       {!message.isIncoming && clickedMessageId === message.id && (
                        <div className="flex items-center mr-1 self-center reaction-container relative" style={{ zIndex: (activeReactionMessageId === message.id || activeMessageOptionsId === message.id) ? 999 : 'auto' }}>
                          <button 
                            className="p-1 hover:opacity-70 transition-opacity"
                            onClick={(e) => handleReactionClick(message.id, e)}
                          >
                            <img 
                              src={reactionIcon} 
                              alt="Reaction" 
                              className="w-6 h-6" 
                              style={{
                                filter: activeReactionMessageId === message.id 
                                  ? 'brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)' 
                                  : 'none'
                              }}
                            />
                          </button>
                          <button 
                            className="p-1 hover:opacity-70 transition-opacity"
                            onClick={(e) => handleMessageOptionsClick(message.id, e)}
                          >
                            <img 
                              src={optionIcon} 
                              alt="Options" 
                              className="w-6 h-6" 
                              style={{
                                filter: activeMessageOptionsId === message.id 
                                  ? 'brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)' 
                                  : 'none'
                              }}
                            />
                          </button>
                          
                          {/* Reaction Popup - For outgoing messages */}
                          {activeReactionMessageId === message.id && (
                            <div className="absolute bottom-full mb-2" style={{ left: '-24px', right: '-24px', zIndex: 999 }}>
                              <div className="relative bg-white shadow-lg px-4 py-2.5 flex items-center justify-center space-x-1.5 border border-gray-200" style={{ borderRadius: '20px', minWidth: '280px' }}>
                                <button onClick={() => handleReactionSelect('👍')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="1f44d" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('❤️')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="2764-fe0f" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('✅')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="2705" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('😂')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="1f602" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('😊')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="1f60a" size={24} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReactionEmojiPicker(!showReactionEmojiPicker);
                                  }} 
                                  className="hover:scale-110 transition-transform flex items-center justify-center" 
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  <img src={emoji6} alt="More reactions" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                </button>
                                <div 
                                  style={{
                                    position: 'absolute',
                                    left: 'calc(16px + 4px + 16px)',
                                    bottom: '-6px',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: '6px solid white',
                                  }}
                                ></div>
                              </div>
                              
                              {showReactionEmojiPicker && (
                                <div 
                                  className="absolute top-full mt-2 z-50"
                                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <EmojiPicker
                                    onEmojiClick={(emojiObject) => {
                                      handleReactionSelect(emojiObject.emoji);
                                      setShowReactionEmojiPicker(false);
                                    }}
                                    width={300}
                                    height={400}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Message Options Popup - For outgoing messages */}
                          {activeMessageOptionsId === message.id && (
                            <div 
                              className="absolute -left-12" 
                              style={{ 
                                zIndex: 999,
                                top: index <= 1 ? '-200px' : 'auto',
                                bottom: index > 1 ? '100%' : 'auto',
                                marginBottom: index > 1 ? '8px' : '0'
                              }}
                            >
                              <div className="relative bg-white rounded-2xl shadow-xl py-2 px-1 border border-gray-200" style={{ minWidth: '180px' }}>
                                <div className="flex items-center justify-between px-3 mb-1">
                                  <span className="font-medium" style={{ color: '#9CA3AF', fontSize: '10px' }}>Actions</span>
                                  <button 
                                    onClick={() => setActiveMessageOptionsId(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                  </button>
                                </div>
                                
                                <div className="space-y-0.5">
                                  <button 
                                    onClick={() => handleMessageOptionSelect('reply', message.id)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={replyIcon} alt="Reply" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Reply the message</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('important', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={starIcon} alt="Star" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Mark as important</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('copy', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={copyIcon} alt="Copy" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Copy the message</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('select', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={tickIcon} alt="Select" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Select the message</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('pin', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={pinMenuIcon} alt="Pin" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>
                                      {messages.find(m => m.id === activeMessageOptionsId)?.isPinned ? 'Unpin the message' : 'Pin the message'}
                                    </span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('delete', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={trashIcon} alt="Delete" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Delete for me</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                       )}
                       
                       <div className="max-w-xs lg:max-w-md relative">
                         {/* Images (if present) - NO bubble */}
                         {message.images && message.images.length > 0 && (
                           <div className={`flex flex-wrap gap-2 mb-2 ${message.isIncoming ? 'justify-start' : 'justify-end'}`}>
                             {message.images.map((image: File, imgIndex: number) => (
                               <img
                                 key={imgIndex}
                                 src={URL.createObjectURL(image)}
                                 alt={image.name}
                                 className="object-cover"
                                 style={{ 
                                   borderRadius: '12px',
                                   maxWidth: '300px',
                                   maxHeight: '300px'
                                 }}
                               />
                             ))}
                           </div>
                         )}

                         {/* Message bubble (only if there's text or voice or documents) */}
                         {((!message.images || message.images.length === 0) && (message.text || message.type === 'voice' || (message.documents && message.documents.length > 0))) && (
                           <div 
                             className={`rounded-2xl p-4 ${message.isIncoming ? 'rounded-bl-md cursor-pointer' : 'rounded-br-md'}`} 
                             style={{ 
                               backgroundColor: message.isIncoming ? '#F0F8FE' : '#64B5F6'
                             }}
                             onClick={() => handleIncomingMessageClick(message.id)}
                           >
                            {message.type === 'voice' ? (
                            // Voice Message Display
                            <div className="space-y-2">
                              {/* Reply Preview for Voice Messages */}
                              {message.replyTo && (
                                <div className="flex items-stretch">
                                  <div 
                                    className="rounded-full mr-2" 
                                    style={{ 
                                      width: '2px', 
                                      backgroundColor: '#FFFFFF' 
                                    }}
                                  ></div>
                                  <div className="flex-1">
                                    <p className="text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                      {message.replyTo.sender}
                                    </p>
                                    <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                      {message.replyTo.text}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Voice Message Content */}
                              <div className="flex items-center space-x-3">
                                {/* Avatar or Speed Button - Desktop */}
                                {playingMessageId === message.id ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSpeedChange(message.id);
                                    }}
                                    className="flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                                    style={{ 
                                      backgroundColor: '#4781AF',
                                      borderRadius: '16px',
                                      width: '48px',
                                      height: '36px',
                                      padding: '0 12px'
                                    }}
                                  >
                                    <span className="text-white text-sm font-medium">
                                      {(audioPlaybackSpeed[message.id] || 1) === 1 ? '1x' : (audioPlaybackSpeed[message.id] || 1) === 1.5 ? '1.5x' : '2x'}
                                    </span>
                                  </button>
                                ) : (
                                  <div className="relative flex-shrink-0">
                                    <img src={avatarIcon} alt="Your Avatar" className="w-10 h-10 rounded-full" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                      <img src={swiIcon} alt="Waveform" className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (message.audioUrl) {
                                        handleAudioPlayback(message.id, message.audioUrl, message.duration);
                                      }
                                    }}
                                    className="hover:opacity-80 transition-opacity"
                                  >
                                    {playingMessageId === message.id ? (
                                      // Pause icon
                                      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }}/>
                                      </svg>
                                    ) : (
                                      // Play icon
                                      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                        <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }}/>
                                      </svg>
                                    )}
                                  </button>
                                  <span className="text-white text-sm">
                                    {(() => {
                                      const time = audioPlaybackTime[message.id] !== undefined ? audioPlaybackTime[message.id] : message.duration;
                                      return `${Math.floor(time / 60).toString().padStart(2, '0')} : ${(time % 60).toString().padStart(2, '0')}`;
                                    })()}
                                  </span>
                                  <div className="w-2 h-0.5 bg-white/70 rounded-full mx-0.5"></div>
                                  <span className="text-white text-sm">Audio</span>
                                </div>
                                <div className="flex items-center justify-center space-x-0.5">
                                  {(message.waveformData && message.waveformData.length > 0 ? 
                                    message.waveformData.slice(-20).map((level: number, i: number) => {
                                      const progress = audioPlaybackProgress[message.id] || 0;
                                      const isPlayed = playingMessageId === message.id && (i / 20) * 100 <= progress;
                                      return (
                                        <div
                                          key={i}
                                          className="w-0.5 rounded-full"
                                          style={{
                                            height: `${Math.max(4, level * 18)}px`,
                                            backgroundColor: isPlayed ? '#FFFFFF' : '#CFE8FC'
                                          }}
                                        />
                                      );
                                    })
                                  : 
                                    [4,6,4,8,12,14,16,14,12,8,6,4,8,10,12,10,8,6,4,6].map((h, i) => {
                                      const progress = audioPlaybackProgress[message.id] || 0;
                                      const isPlayed = playingMessageId === message.id && (i / 20) * 100 <= progress;
                                      return (
                                        <div
                                          key={i}
                                          className="w-0.5 rounded-full"
                                          style={{
                                            height: `${h}px`,
                                            backgroundColor: isPlayed ? '#FFFFFF' : '#CFE8FC'
                                          }}
                                        />
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                            ) : (
                              // Text Message Display
                            <>
                              {/* Reply Section */}
                              {message.replyTo && (
                                <div className="mb-3">
                                  {/* User's reply text at top */}
                                  <p className="text-sm mb-2" style={{ color: '#FFFFFF' }}>
                                    {message.text}
                                  </p>
                                  
                                  {message.replyTo.type === 'voice' ? (
                                    /* Voice Note Reply - Screenshot Structure - TWO LINES */
                                    <div className="flex items-start">
                                      {/* White vertical line on LEFT */}
                                      <div 
                                        className="rounded-full mr-2"
                                        style={{ 
                                          width: '2px',
                                          backgroundColor: '#FFFFFF',
                                          height: '38px',
                                          flexShrink: 0
                                        }}
                                      ></div>
                                      
                                      <div className="flex-1">
                                        {/* "You" text in light blue - ABOVE */}
                                        <div className="text-xs font-medium mb-1" style={{ color: '#CFE8FC' }}>
                                          {message.replyTo.sender}
                                        </div>
                                        
                                        {/* Audio preview - BELOW "You" */}
                                        <div className="flex items-center">
                                          {/* Speed button - appears when playing */}
                                          {playingMessageId === message.id && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleSpeedChange(message.id);
                                              }}
                                              className="flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                                              style={{ 
                                                backgroundColor: '#4781AF',
                                                borderRadius: '10px',
                                                width: '32px',
                                                height: '22px',
                                                padding: '0 8px',
                                                marginRight: '8px'
                                              }}
                                            >
                                              <span className="text-white" style={{ fontSize: '10px', fontWeight: 500 }}>
                                                {(audioPlaybackSpeed[message.id] || 1) === 1 ? '1x' : (audioPlaybackSpeed[message.id] || 1) === 1.5 ? '1.5x' : '2x'}
                                              </span>
                                            </button>
                                          )}
                                          
                                          {/* Duration */}
                                          <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)', marginRight: '8px' }}>
                                            {Math.floor((message.replyTo.duration || 0) / 60).toString().padStart(2, '0')}:{((message.replyTo.duration || 0) % 60).toString().padStart(2, '0')}
                                          </span>
                                          
                                          {/* Waveform */}
                                          <div className="flex items-center space-x-0.5 flex-1">
                                            {(message.replyTo.waveformData && message.replyTo.waveformData.length > 0 ? 
                                              message.replyTo.waveformData.slice(-20).map((level: number, i: number) => {
                                                const progress = audioPlaybackProgress[message.id] || 0;
                                                const totalBars = Math.min(20, message.replyTo.waveformData.length);
                                                const isPlayed = playingMessageId === message.id && (i / totalBars) * 100 <= progress;
                                                return (
                                                  <div
                                                    key={i}
                                                    style={{ 
                                                      width: '2px',
                                                      height: `${Math.max(3, level * 10)}px`,
                                                      backgroundColor: isPlayed ? '#FFFFFF' : '#CFE8FC',
                                                      borderRadius: '1px'
                                                    }}
                                                  />
                                                );
                                              })
                                            : 
                                              [3,4,3,5,8,10,12,10,8,5,4,3,6,8,9,8,6,5,3,5].map((h, i) => {
                                                const progress = audioPlaybackProgress[message.id] || 0;
                                                const isPlayed = playingMessageId === message.id && (i / 20) * 100 <= progress;
                                                return (
                                                  <div
                                                    key={i}
                                                    style={{ 
                                                      width: '2px',
                                                      height: `${h}px`,
                                                      backgroundColor: isPlayed ? '#FFFFFF' : '#CFE8FC',
                                                      borderRadius: '1px'
                                                    }}
                                                  />
                                                );
                                              })
                                            )}
                                          </div>
                                          
                                          {/* Play/Pause button - far right */}
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (message.replyTo.audioUrl) {
                                                handleAudioPlayback(message.id, message.replyTo.audioUrl, message.replyTo.duration);
                                              }
                                            }}
                                            className="ml-4 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
                                            style={{ 
                                              width: '22px',
                                              height: '22px',
                                              backgroundColor: '#FFFFFF'
                                            }}
                                          >
                                            {playingMessageId === message.id ? (
                                              <svg style={{ width: '14px', height: '14px', color: '#64B5F6' }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                              </svg>
                                            ) : (
                                              <svg style={{ width: '14px', height: '14px', color: '#64B5F6' }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                              </svg>
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    /* Text Reply */
                                    <div className="flex items-stretch">
                                      {/* Vertical white line */}
                                      <div 
                                        className="rounded-full mr-2"
                                        style={{ 
                                          width: '2px',
                                          backgroundColor: '#FFFFFF',
                                          flexShrink: 0
                                        }}
                                      ></div>
                                      
                                      {/* Quoted message info */}
                                      <div className="flex-1">
                                        <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                          {message.replyTo.sender}
                                        </p>
                                        <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                          {message.replyTo.text}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Regular message text (only show if no reply) */}
                              {!message.replyTo && (
                                <p 
                                  className="text-sm mb-3" 
                                  style={{ color: message.isIncoming ? '#6A6A6A' : '#FFFFFF' }}
                                >
                                  {message.text}
                                </p>
                              )}
                              
                              {/* Product Card in Message - Only for first message */}
                              {message.isProductInquiry && message.productData && (
                                <div className="rounded-lg p-3 mt-3">
                                  <div className="flex space-x-4">
                                    <div className="relative">
                                      <div className="absolute -left-3 top-0 w-0.5 h-24" style={{ backgroundColor: '#FFFFFF' }}></div>
                                      <img 
                                        src={message.productData.image} 
                                        alt={message.productData.name}
                                        className="w-24 h-24 object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <div className="text-xl font-semibold" style={{ color: '#B8DDFB' }}>${message.productData.price}</div>
                                        <div className="flex items-center space-x-2 text-[10px]" style={{ color: '#B8DDFB' }}>
                                          <img src={locIcon} alt="Location" className="w-4 h-4" />
                                          <span>{message.productData.location}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between -mt-0.5">
                                        <h4 className="text-xs font-medium" style={{ color: '#B8DDFB' }}>{message.productData.name}</h4>
                                        <div className="text-[10px]" style={{ color: '#B8DDFB' }}>
                                          <span>Category: {message.productData.category}</span>
                                        </div>
                                      </div>
                                      <p className="text-[10px] mt-2 leading-relaxed" style={{ color: '#B8DDFB' }}>
                                        Premium White Pepper sourced from the fertile soils of Africa.<br/>
                                        Known for its smooth, aromatic heat and rich flavor...
                                      </p>
                                      <a href="#" className="text-xs mt-1 block" style={{ color: '#182073' }}>
                                        baoafrik.com/product-id-link?
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Document Display */}
                              {message.documents && message.documents.length > 0 && (
                                <div className={message.text || message.replyTo ? 'mt-3' : ''}>
                                  {message.documents.map((doc: File, docIndex: number) => {
                                    const fileName = doc.name.split('.');
                                    const extension = fileName.pop() || '';
                                    const nameWithoutExt = fileName.join('.');
                                    const fileSizeMB = doc.size / (1024 * 1024);
                                    const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
                                    const extensionLower = extension.toLowerCase();
                                    const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                                    return (
                                      <div key={docIndex} className="flex items-center space-x-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <DocumentIcon size={40} />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm truncate" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                                            {nameWithoutExt} · {extension}
                                          </p>
                                          <p className="text-xs" style={{ color: '#B8DDFB' }}>
                                            {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          )}
                           </div>
                         )}
                        
                        {/* Bottom Timestamp */}
                        <div className={`flex items-center mt-2 ${message.isIncoming ? 'justify-start' : 'justify-end'}`}>
                          {/* For outgoing messages: Badges BEFORE timestamp */}
                          {!message.isIncoming && (
                            <>
                              {/* Reaction Display - LEFT of timestamp */}
                              {message.reaction && (
                                <div 
                                  className="mr-6 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleRemoveReaction(message.id)}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F1F1F1',
                                    borderRadius: '20px',
                                    padding: '2px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minWidth: '60px',
                                    height: '22px',
                                    marginTop: '-2px',
                                    gap: '8px'
                                  }}
                                >
                                  <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span style={{ fontSize: '14px', lineHeight: 1 }}>
                                    {message.reaction}
                                  </span>
                                </div>
                              )}
                              
                              {/* Important Badge - LEFT of timestamp */}
                              {message.isImportant && (
                                <div 
                                  className="mr-6 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleRemoveImportant(message.id)}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F1F1F1',
                                    borderRadius: '20px',
                                    padding: '2px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minWidth: '60px',
                                    height: '22px',
                                    marginTop: '-2px',
                                    gap: '8px'
                                  }}
                                >
                                  <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                </div>
                              )}
                              
                              {/* Pin Badge - LEFT of timestamp */}
                              {message.isPinned && (
                                <div 
                                  className="mr-6 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleRemovePin(message.id)}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F1F1F1',
                                    borderRadius: '20px',
                                    padding: '2px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minWidth: '60px',
                                    height: '22px',
                                    marginTop: '-2px',
                                    gap: '8px'
                                  }}
                                >
                                  <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <img src={pinBadgeIcon} alt="Pin" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)' }} />
                                </div>
                              )}
                            </>
                          )}
                          
                          <span 
                            className="text-xs mr-1" 
                            style={{ color: '#6A6A6A' }}
                          >
                            {message.timestamp}
                          </span>
                          {!message.isIncoming && renderMessageStatus(message.id)}
                          
                          {/* For incoming messages: Badges AFTER timestamp */}
                          {message.isIncoming && (
                            <>
                              {/* Reaction Display - RIGHT of timestamp */}
                              {message.reaction && (
                                <div 
                                  className="ml-6 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleRemoveReaction(message.id)}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F1F1F1',
                                    borderRadius: '20px',
                                    padding: '2px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minWidth: '60px',
                                    height: '22px',
                                    marginTop: '-2px',
                                    gap: '8px'
                                  }}
                                >
                                  <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span style={{ fontSize: '14px', lineHeight: 1 }}>
                                    {message.reaction}
                                  </span>
                                </div>
                              )}
                              
                              {/* Important Badge - RIGHT of timestamp */}
                              {message.isImportant && (
                                <div 
                                  className="ml-6 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleRemoveImportant(message.id)}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F1F1F1',
                                    borderRadius: '20px',
                                    padding: '2px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minWidth: '60px',
                                    height: '22px',
                                    marginTop: '-2px',
                                    gap: '8px'
                                  }}
                                >
                                  <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                </div>
                              )}
                              
                              {/* Pin Badge - RIGHT of timestamp */}
                              {message.isPinned && (
                                <div 
                                  className="ml-6 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => handleRemovePin(message.id)}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F1F1F1',
                                    borderRadius: '20px',
                                    padding: '2px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minWidth: '60px',
                                    height: '22px',
                                    marginTop: '-2px',
                                    gap: '8px'
                                  }}
                                >
                                  <svg style={{ width: '14px', height: '14px', color: '#BABABA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <img src={pinBadgeIcon} alt="Pin" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)' }} />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Reaction and Option Icons - RIGHT side for incoming messages only */}
                      {message.isIncoming && clickedMessageId === message.id && (
                        <div className="flex items-center ml-1 self-center reaction-container relative" style={{ zIndex: (activeReactionMessageId === message.id || activeMessageOptionsId === message.id) ? 999 : 'auto' }}>
                          <button 
                            className="p-1 hover:opacity-70 transition-opacity"
                            onClick={(e) => handleReactionClick(message.id, e)}
                          >
                            <img 
                              src={reactionIcon} 
                              alt="Reaction" 
                              className="w-6 h-6" 
                              style={{
                                filter: activeReactionMessageId === message.id 
                                  ? 'brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)' 
                                  : 'none'
                              }}
                            />
                          </button>
                          <button 
                            className="p-1 hover:opacity-70 transition-opacity"
                            onClick={(e) => handleMessageOptionsClick(message.id, e)}
                          >
                            <img 
                              src={optionIcon} 
                              alt="Options" 
                              className="w-6 h-6" 
                              style={{
                                filter: activeMessageOptionsId === message.id 
                                  ? 'brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)' 
                                  : 'none'
                              }}
                            />
                          </button>
                          
                          {/* Reaction Popup */}
                          {activeReactionMessageId === message.id && (
                            <div className="absolute bottom-full mb-2" style={{ left: '-24px', right: '-24px', zIndex: 999 }}>
                              {/* Speech bubble with tail */}
                              <div className="relative bg-white shadow-lg px-4 py-2.5 flex items-center justify-center space-x-1.5 border border-gray-200" style={{ borderRadius: '20px', minWidth: '280px' }}>
                                <button onClick={() => handleReactionSelect('👍')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="1f44d" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('❤️')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="2764-fe0f" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('✅')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="2705" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('😂')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="1f602" size={24} />
                                </button>
                                <button onClick={() => handleReactionSelect('😊')} className="hover:scale-110 transition-transform flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                                  <Emoji unified="1f60a" size={24} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReactionEmojiPicker(!showReactionEmojiPicker);
                                  }} 
                                  className="hover:scale-110 transition-transform flex items-center justify-center" 
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  <img src={emoji6} alt="More reactions" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                </button>
                                {/* Triangle tail pointing to reaction button */}
                                <div 
                                  style={{
                                    position: 'absolute',
                                    left: 'calc(16px + 4px + 16px)', // px-4 (16px) + space-x-1.5 (6px) + half button width (16px)
                                    bottom: '-6px',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: '6px solid white',
                                  }}
                                ></div>
                              </div>
                              
                              {/* Emoji Picker for Reactions */}
                              {showReactionEmojiPicker && (
                                <div 
                                  className="absolute top-full mt-2 z-50"
                                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <EmojiPicker
                                    onEmojiClick={(emojiObject) => {
                                      handleReactionSelect(emojiObject.emoji);
                                      setShowReactionEmojiPicker(false);
                                    }}
                                    width={300}
                                    height={400}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Message Options Popup */}
                          {activeMessageOptionsId === message.id && (
                            <div 
                              className="absolute -left-12" 
                              style={{ 
                                zIndex: 999,
                                top: index <= 1 ? '-200px' : 'auto',
                                bottom: index > 1 ? '100%' : 'auto',
                                marginBottom: index > 1 ? '8px' : '0'
                              }}
                            >
                              <div className="relative bg-white rounded-2xl shadow-xl py-2 px-1 border border-gray-200" style={{ minWidth: '180px' }}>
                                {/* Header */}
                                <div className="flex items-center justify-between px-3 mb-1">
                                  <span className="font-medium" style={{ color: '#9CA3AF', fontSize: '10px' }}>Actions</span>
                                  <button 
                                    onClick={() => setActiveMessageOptionsId(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                  </button>
                                </div>
                                
                                {/* Menu Items */}
                                <div className="space-y-0.5">
                                  <button 
                                    onClick={() => handleMessageOptionSelect('reply', message.id)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={replyIcon} alt="Reply" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Reply the message</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('important', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={starIcon} alt="Star" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Mark as important</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('copy', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={copyIcon} alt="Copy" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Copy the message</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('select', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={tickIcon} alt="Select" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Select the message</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('pin', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={pinMenuIcon} alt="Pin" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>
                                      {messages.find(m => m.id === activeMessageOptionsId)?.isPinned ? 'Unpin the message' : 'Pin the message'}
                                    </span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleMessageOptionSelect('delete', activeMessageOptionsId || undefined)}
                                    className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                  >
                                    <img src={trashIcon} alt="Delete" className="w-4 h-4 mr-2" />
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Delete for me</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
    </div>
                  );
                    })}
                  
                  {/* Typing Indicator */}
                  {isSellerTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="max-w-20">
                        <div 
                          className="rounded-2xl rounded-bl-md px-3 py-2 flex items-center" 
                          style={{ backgroundColor: '#F0F8FE' }}
                        >
                          <div className="flex space-x-1">
                            <div 
                              className="w-1.5 h-1.5 rounded-full animate-bounce" 
                              style={{ 
                                backgroundColor: '#64B5F6',
                                animationDelay: '0ms'
                              }}
                            ></div>
                            <div 
                              className="w-1.5 h-1.5 rounded-full animate-bounce" 
                              style={{ 
                                backgroundColor: '#64B5F6',
                                animationDelay: '150ms'
                              }}
                            ></div>
                            <div 
                              className="w-1.5 h-1.5 rounded-full animate-bounce" 
                              style={{ 
                                backgroundColor: '#64B5F6',
                                animationDelay: '300ms'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* View Latest Messages Button */}
                  {showAllMessages && messages.length > 10 && (
                    <div className="flex justify-center mt-4 mb-4">
                      <button
                        onClick={() => setShowAllMessages(false)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                        style={{
                          backgroundColor: '#E3F2FD',
                          color: '#64B5F6'
                        }}
                      >
                        View latest messages
                      </button>
                    </div>
                  )}
                  
                  {/* Scroll anchor for auto-scroll */}
                  <div ref={messagesEndRef} />
                </div>
              )}
              </div>
              {/* End Scrollable Content Area */}

                {/* Message Input - Fixed at Bottom */}
                <div className={`px-6 pb-6 flex-shrink-0 ${messages.length > 0 ? 'py-2' : '-mt-2'}`}>
                  {/* Permanent Gray Separator Line */}
                  <div className="mb-3 -mx-6">
                    <div className="w-full bg-gray-200 rounded-full" style={{ height: '0.5px' }}></div>
                  </div>
                  
                  {/* Reply Preview - Desktop */}
                  {replyToMessage && (
                    <div className="mb-2 relative">
                      {replyToMessage.type === 'voice' ? (
                        /* Voice Note Reply Preview - Matches Audio Preview Style */
                        <div 
                          className="flex items-center justify-between rounded-md px-4 py-2"
                          style={{ 
                            background: 'linear-gradient(to right, #DBEAFE, #64B5F6)',
                            borderRadius: '12px',
                            width: '300px'
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <button className="hover:opacity-80 transition-opacity">
                              <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }}/>
                              </svg>
                            </button>
                            <span className="text-white text-sm">
                              {Math.floor((replyToMessage.duration || 0) / 60).toString().padStart(2, '0')} : {((replyToMessage.duration || 0) % 60).toString().padStart(2, '0')}
                            </span>
                            <div className="w-2 h-0.5 bg-white/70 rounded-full mx-0.5"></div>
                            <span className="text-white text-sm">Audio</span>
                            <div className="flex items-center justify-center space-x-0.5">
                              {(replyToMessage.waveformData && replyToMessage.waveformData.length > 0 ? 
                                replyToMessage.waveformData.slice(-20).map((level: number, i: number) => (
                                  <div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full"
                                    style={{ height: `${Math.max(4, level * 18)}px` }}
                                  />
                                ))
                              : 
                                [6,8,4,6,12,16,14,18,20,16,12,8,6,10,14,12,8,6,4,8].map((h, i) => (
                                  <div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full"
                                    style={{ height: `${h}px` }}
                                  />
                                ))
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => setReplyToMessage(null)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        /* Text Reply Preview */
                        <div 
                          className="rounded-lg p-2 pl-4 pr-8 relative flex"
                          style={{ 
                            backgroundColor: '#FAFAFA'
                          }}
                        >
                          {/* Blue line inside */}
                          <div 
                            className="rounded-full mr-3"
                            style={{ 
                              width: '2px',
                              backgroundColor: '#64B5F6',
                              flexShrink: 0
                            }}
                          ></div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="text-xs font-medium mb-0.5" style={{ color: '#64B5F6' }}>
                              {replyToMessage.isIncoming ? 'Joaquin EDIMO' : 'You'}
                            </div>
                            <div className="text-xs" style={{ color: '#6A6A6A' }}>
                              {replyToMessage.text}
                            </div>
                          </div>
                          
                          {/* Close button */}
                          <button
                            onClick={() => setReplyToMessage(null)}
                            className="absolute top-1.5 right-1.5 hover:opacity-70 transition-opacity"
                          >
                            <img src={replyCloseIcon} alt="Close" className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Product Inquiry Card - Only show before sending first message */}
                  {!isMessageSent && productData && (
                    <div className="mb-3">
                      <div className="flex items-start space-x-3">
                        {/* Product Detail Card */}
                        <div className="bg-gray-50 rounded-xl p-3 flex-1 max-w-lg">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium" style={{ color: '#83C4F8' }}>From Bao'Afrik</span>
                            <button className="w-4 h-4 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#6A6A6A' }}>
                              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                          <div className="flex space-x-4">
                            <div className="relative">
                              <div className="absolute -left-3 top-0 w-0.5 h-24" style={{ backgroundColor: '#83C4F8' }}></div>
                              <img 
                                src={productImage1} 
                                alt={productData.name}
                                className="w-24 h-24 object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="text-xl font-semibold" style={{ color: '#6A6A6A' }}>${productData.price}</div>
                                <div className="flex items-center space-x-2 text-[10px]" style={{ color: '#BABABA' }}>
                                  <img src={locIcon} alt="Location" className="w-4 h-4" />
                                  <span>{productData.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between -mt-0.5">
                                <h4 className="text-xs font-medium" style={{ color: '#6A6A6A' }}>{productData.name}</h4>
                                <div className="text-[10px]" style={{ color: '#BABABA' }}>
                                  <span>Category: {productData.category}</span>
                                </div>
                              </div>
                              <p className="text-[10px] mt-2 leading-relaxed" style={{ color: '#6A6A6A' }}>
                                Premium White Pepper sourced from the fertile soils of Africa.<br/>
                                Known for its smooth, aromatic heat and rich flavor...
                              </p>
                              <a href="#" className="text-xs mt-1 block" style={{ color: '#83C4F8' }}>
                                baoafrik.com/product-id-link?
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  

                  {isRecording ? (
                    // Recording Interface with inline file attachment
                    <div className="space-y-3">
                      {/* Main Recording Interface */}
                      <div className="flex items-center" style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '6px' }}>
                        <div className="relative emoji-picker-container">
                          <button 
                            onClick={handleEmojiClick}
                            className="p-1.5 hover:text-gray-600 opacity-0 pointer-events-none"
                          >
                            <img 
                              src={faceIcon} 
                              alt="emoji" 
                              className="w-6 h-6" 
                              style={{ 
                                filter: showEmojiPicker ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'none'
                              }}
                            />
                          </button>
                          
                          {/* Emoji Picker */}
                          {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-2 z-50">
                              <style>{`
                                .emoji-picker-react {
                                  border: none !important;
                                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                                }
                                .emoji-picker-react .emoji-search {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                  background-color: #f8f8f8 !important;
                                }
                                .emoji-picker-react .emoji-search:focus {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                }
                                .emoji-picker-react .emoji-group:before {
                                  color: #666 !important;
                                  font-weight: bold !important;
                                  font-size: 12px !important;
                                }
                                .emoji-picker-react .emoji-categories button {
                                  border-radius: 50% !important;
                                  width: 32px !important;
                                  height: 32px !important;
                                  margin: 2px !important;
                                }
                                .emoji-picker-react .emoji-categories button.active {
                                  background-color: #64B5F6 !important;
                                }
                                .emoji-picker-react .emoji-categories button svg {
                                  width: 16px !important;
                                  height: 16px !important;
                                }
                              `}</style>
                              <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={350}
                                height={450}
                                searchDisabled={false}
                                skinTonesDisabled={true}
                                previewConfig={{
                                  showPreview: false
                                }}
                                searchPlaceHolder="Search Emoji"
                              />
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={handleAttachClick}
                          className="p-2 transition-colors focus:outline-none"
                          style={{ outline: 'none' }}
                        >
                          <img 
                            src={pinIcon} 
                            alt="attachment" 
                            className="w-6 h-6"
                            style={{
                              filter: isAttachActive ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'none'
                            }}
                          />
                        </button>
                        <div className="flex-1 flex justify-start">
                          <div 
                            className="rounded-full px-6 py-0.5 flex items-center -ml-12 relative"
                            style={{ 
                              background: 'linear-gradient(to right, #DBEAFE, #64B5F6)',
                              width: '550px',
                              height: '28px' // Fixed height to prevent container movement
                            }}
                          >
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }}></div>
                              <span className="text-white text-sm">
                                {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
                                {(recordingTime % 60).toString().padStart(2, '0')} - Audio recording
                              </span>
                            </div>
                            <div className="flex space-x-0.5 absolute right-8 top-1/2 transform -translate-y-1/2 items-end">
                              {audioLevels.map((level, i) => {
                                // Convert audio level (0.1 to 1.0) to height (2px to 24px)
                                const height = `${level * 24}px`;
                                const minHeight = '2px';
                                
                                return (
                                  <div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full transition-all duration-150 ease-out"
                                    style={{
                                      height: Math.max(parseFloat(height), parseFloat(minHeight)) + 'px',
                                      minHeight: minHeight
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={handleStopRecording}
                          className="w-8 h-8 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                          style={{ backgroundColor: '#F5F5F5' }}
                        >
                          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        </button>
                      </div>
                      
                    </div>
                  ) : recordingTime > 0 ? (
                    // Show audio preview bubble and send button after recording
                    <div className="flex flex-col">
                      
                      {/* Audio Preview Bubble - Outside message input */}
                      <div className="mb-3">
                        <div 
                          className="flex items-center justify-between rounded-md px-4 py-2"
                          style={{ 
                            background: 'linear-gradient(to right, #DBEAFE, #64B5F6)',
                            borderRadius: '12px',
                            width: '300px'
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={handlePreviewPlayback}
                              className="hover:opacity-80 transition-opacity"
                            >
                              {isPreviewPlaying ? (
                                // Pause icon
                                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }}/>
                                </svg>
                              ) : (
                                // Play icon
                                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                  <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }}/>
                                </svg>
                              )}
                            </button>
                            <span className="text-white text-sm">
                              {(() => {
                                const time = previewPlaybackTime > 0 ? previewPlaybackTime : recordingTime;
                                return `${Math.floor(time / 60).toString().padStart(2, '0')} : ${(time % 60).toString().padStart(2, '0')}`;
                              })()}
                            </span>
                            <div className="w-2 h-0.5 bg-white/70 rounded-full mx-0.5"></div>
                            <span className="text-white text-sm">Audio</span>
                            <div className="flex items-center justify-center space-x-0.5">
                              {recordedWaveforms.length > 0 ? (
                                recordedWaveforms.slice(-20).map((level, i) => (
                                  <div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full"
                                    style={{ height: `${Math.max(4, level * 18)}px` }}
                                  />
                                ))
                              ) : (
                                [6,8,4,6,12,16,14,18,20,16,12,8,6,10,14,12,8,6,4,8].map((h, i) => (
                                  <div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full"
                                    style={{ height: `${h}px` }}
                                  />
                                ))
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              // Stop preview audio if playing
                              if (previewAudio) {
                                previewAudio.pause();
                                setPreviewAudio(null);
                              }
                              setIsPreviewPlaying(false);
                              setPreviewPlaybackTime(0);
                              setRecordingTime(0);
                              setAudioChunks([]);
                              setRecordedWaveforms([]);
                              setAudioLevels([]);
                            }}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Message Input with Send Button */}
                      <div className="flex items-center" style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '6px' }}>
                        <div className="relative emoji-picker-container">
                          <button 
                            onClick={handleEmojiClick}
                            className="p-1.5 hover:text-gray-600"
                          >
                            <img 
                              src={faceIcon} 
                              alt="emoji" 
                              className="w-6 h-6" 
                              style={{ 
                                filter: showEmojiPicker ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'none'
                              }}
                            />
                          </button>
                          
                          {/* Emoji Picker */}
                          {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-2 z-50">
                              <style>{`
                                .emoji-picker-react {
                                  border: none !important;
                                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                                }
                                .emoji-picker-react .emoji-search {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                  background-color: #f8f8f8 !important;
                                }
                                .emoji-picker-react .emoji-search:focus {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                }
                                .emoji-picker-react .emoji-group:before {
                                  color: #666 !important;
                                  font-weight: bold !important;
                                  font-size: 12px !important;
                                }
                                .emoji-picker-react .emoji-categories button {
                                  border-radius: 50% !important;
                                  width: 32px !important;
                                  height: 32px !important;
                                  margin: 2px !important;
                                }
                                .emoji-picker-react .emoji-categories button.active {
                                  background-color: #64B5F6 !important;
                                }
                                .emoji-picker-react .emoji-categories button svg {
                                  width: 16px !important;
                                  height: 16px !important;
                                }
                              `}</style>
                              <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={350}
                                height={450}
                                searchDisabled={false}
                                skinTonesDisabled={true}
                                previewConfig={{
                                  showPreview: false
                                }}
                                searchPlaceHolder="Search Emoji"
                              />
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={handleAttachClick}
                          className="p-2 transition-colors focus:outline-none"
                          style={{ outline: 'none' }}
                        >
                          <img 
                            src={pinIcon} 
                            alt="attachment" 
                            className="w-6 h-6"
                            style={{
                              filter: isAttachActive ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'none'
                            }}
                          />
                        </button>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="...Write your message"
                            className="w-full px-3 py-2 focus:outline-none bg-transparent"
                            style={{ 
                              border: 'none',
                              caretColor: '#64B5F6'
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendVoiceMessage();
                              }
                            }}
                          />
                        </div>
                        <button 
                          onClick={handleSendVoiceMessage}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <img src={bluIcon} alt="send" className="w-7 h-7" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Attachment Badges - Above Message Input Bar (Only show when no files selected) */}
                      {showAttachmentBadges && selectedFiles.length === 0 && (
                        <div className="pl-2 pr-4 pb-3 flex items-center space-x-3">
                          <button onClick={handleAddDocumentsClick} className="flex items-center space-x-2 px-4 py-2" style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}>
                            <img src={documentIcon} alt="Document" className="w-4 h-4" />
                            <span className="text-sm font-medium" style={{ color: '#64B5F6' }}>Add documents</span>
                          </button>
                          <button onClick={handleAddPhotosClick} className="flex items-center space-x-2 px-4 py-2" style={{ backgroundColor: '#F0F8FE', borderRadius: '6px' }}>
                            <img src={photoIcon} alt="Photo" className="w-4 h-4" />
                            <span className="text-sm font-medium" style={{ color: '#64B5F6' }}>Add photos</span>
                          </button>
                        </div>
                      )}

                      {/* Files Display */}
                      {selectedFiles.length > 0 && (
                        <div className="pt-3 pl-2 pr-6 pb-3">
                          {selectedFiles.map((file, index) => {
                            const isImage = file.type.startsWith('image/');
                            if (isImage) {
                              return (
                                <div key={index} className="inline-block relative mr-3 mb-3">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-24 h-24 object-cover"
                                    style={{ borderRadius: '12px' }}
                                  />
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: '#4D4D4D', border: '2px solid #FFFFFF' }}
                                  >
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              );
                            } else {
                              // Document preview
                              const fileName = file.name.split('.');
                              const extension = fileName.pop() || '';
                              const nameWithoutExt = fileName.join('.');
                              const fileSizeMB = file.size / (1024 * 1024);
                              const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
                              const extensionLower = extension.toLowerCase();
                              const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                              return (
                                <div key={index} className="relative mb-3 p-3 flex items-center space-x-3" style={{ backgroundColor: '#FAFAFA', borderRadius: '10px', fontFamily: 'Poppins, sans-serif', maxWidth: '400px' }}>
                                  <DocumentIcon size={48} />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium" style={{ color: '#6A6A6A' }}>
                                      {nameWithoutExt} · {extension}
                                    </p>
                                    <p className="text-xs" style={{ color: '#B0B0B0' }}>
                                      {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center hover:opacity-70"
                                  >
                                    <img src={closeIcon} alt="Close" className="w-5 h-5" />
                                  </button>
                                </div>
                              );
                            }
                          })}
                          {/* Add More Button - Only show for images */}
                          {selectedFiles.some(f => f.type.startsWith('image/')) && (
                            <button
                              onClick={handleAddPhotosClick}
                              className="inline-block w-24 h-24 flex-shrink-0"
                              style={{
                                backgroundColor: '#F0F8FE',
                                border: '2px dashed #64B5F6',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                verticalAlign: 'top'
                              }}
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Normal Message Input */}
                      <div className="flex items-center" style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '6px' }}>
                        <div className="relative emoji-picker-container">
                          <button 
                            onClick={handleEmojiClick}
                            className="p-1.5 hover:text-gray-600"
                          >
                          <img 
                            src={faceIcon} 
                            alt="emoji" 
                            className="w-6 h-6" 
                            style={{ 
                              filter: showEmojiPicker ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)'
                            }}
                          />
                        </button>
                        
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-full left-0 mb-2 z-50">
                            <style>{`
                              .emoji-picker-react {
                                border: none !important;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                              }
                              .emoji-picker-react .emoji-search {
                                border: 1px solid #e5e5e5 !important;
                                box-shadow: none !important;
                                outline: none !important;
                                background-color: #f8f8f8 !important;
                              }
                              .emoji-picker-react .emoji-search:focus {
                                border: 1px solid #e5e5e5 !important;
                                box-shadow: none !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-group:before {
                                color: #666 !important;
                                font-weight: bold !important;
                                font-size: 12px !important;
                              }
                              .emoji-picker-react .emoji-categories button {
                                border-radius: 0 !important;
                                width: 32px !important;
                                height: 32px !important;
                                margin: 2px !important;
                                border: none !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button.active {
                                background-color: #64B5F6 !important;
                                border: none !important;
                                border-radius: 0 !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button:hover {
                                border-radius: 0 !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button:focus {
                                border-radius: 0 !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button svg {
                                width: 16px !important;
                                height: 16px !important;
                              }
                            `}</style>
                            <EmojiPicker
                              onEmojiClick={onEmojiClick}
                              width={350}
                              height={450}
                              searchDisabled={false}
                              skinTonesDisabled={true}
                              previewConfig={{
                                showPreview: false
                              }}
                              searchPlaceHolder="Search Emoji"
                            />
                          </div>
                        )}
                        </div>
                        <button 
                          onClick={handleAttachClick}
                          className="p-2 transition-colors focus:outline-none"
                          style={{ outline: 'none' }}
                        >
                          <img 
                            src={pinIcon} 
                            alt="attachment" 
                            className="w-6 h-6"
                            style={{
                              filter: isAttachActive ? 'brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)' : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%)'
                            }}
                          />
                        </button>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={messageText}
                            onChange={(e) => {
                              setMessageText(e.target.value);
                              handleTypingDetection();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendMessage();
                              }
                            }}
                            placeholder="...Write your message"
                            className="w-full px-3 py-2 focus:outline-none bg-transparent"
                            style={{ 
                              border: 'none',
                              caretColor: '#64B5F6'
                            }}
                          />
                      </div>
                      
                      <button 
                        onClick={messageText.trim() || selectedFiles.length > 0 ? handleSendMessage : handleAudioRecord}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        {messageText.trim() || selectedFiles.length > 0 ? (
                          <img src={bluIcon} alt="send" className="w-7 h-7" />
                        ) : (
                          <img src={audioIcon} alt="audio" className="w-7 h-7" />
                        )}
                      </button>
                      </div>
                    </>
                  )}
                </div>
            </div>
          ) : (
            // Default Secure Messaging View - Empty State with Fixed Height
            <div className="flex flex-col items-center justify-center p-8" style={{ height: 'calc(50vh - 4rem)' }}>
              {/* Secure Messaging Icon */}
              <div className="flex items-center justify-center mb-6">
                <img 
                  src={mainIcon} 
                  alt="Secure Messaging" 
                  className="w-32 h-32"
                />
              </div>

              {/* Secure Messaging Content */}
              <h2 className="text-2xl text-black mb-4">Secure Messaging</h2>
              <div className="max-w-md text-center">
                <div className="flex items-start space-x-2 mb-4">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    End-to-end encryption: Only the sender and recipient can read messages, not the service provider. <span className="underline cursor-pointer" style={{ color: '#64B5F6' }}>Learn more</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-50">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-sm" style={{ color: '#BABABA' }}>
              <div className="flex items-center space-x-2">
                <img 
                  src={lilLogo} 
                  alt="lil" 
                  className="w-6 h-6"
                />
                <span>©</span>
                <span>All rights reserved</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/contact" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Contact Us</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/terms" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Terms and conditions of use</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/privacy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Privacy policies</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/cookies" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default Messages;
