import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import EmojiPicker, { Emoji } from 'emoji-picker-react';
import logo from '../assets/images/pre/logo.png';
import sideIcon from '../assets/images/pre/side.png';
import lilLogo from '../assets/images/pre/lil.png';
import messagesIcon from '../assets/images/pre/messages.png';
import filterIcon from '../assets/images/pre/filter.png';
import ssIcon from '../assets/images/pre/ss.png';
import mainIcon from '../assets/images/pre/main.png';
import avatarIcon from '../assets/images/pre/avatar.png';
// import basketIcon from '../assets/images/pre/basket.png';
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
// import translationToggleIcon from '../assets/images/pre/tt.svg';
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
import avatar from "../assets/images/logos/avatar.png";
import logoIcon from "../assets/images/logos/ba-brand-icon-colored.png";
import messageAvatarIcon from '../assets/images/pre/main.png';
import appNotificationIcon from '../assets/images/pre/nof.svg';

import { useSocket } from '../contexts/socketContext';
import { gcpStorageService } from '../services/gcpStorageService';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import closeIcon from '../assets/images/pre/cc.svg';

// PDF Icon Component
const PDFIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0H4C1.79086 0 0 1.79086 0 4V52C0 54.2091 1.79086 56 4 56H44C46.2091 56 48 54.2091 48 52V16L32 0Z" fill="#FF1607" />
    <path d="M32 0L48 16H38C34.6863 16 32 13.3137 32 10V0Z" fill="#FFFFFF80" />
    <text x="24" y="38" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">PDF</text>
  </svg>
);

// JPG Icon Component
const JPGIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0H4C1.79086 0 0 1.79086 0 4V52C0 54.2091 1.79086 56 4 56H44C46.2091 56 48 54.2091 48 52V16L32 0Z" fill="#E0E0E0" />
    <path d="M32 0L48 16H38C34.6863 16 32 13.3137 32 10V0Z" fill="#BDBDBD" />
    <rect x="2" y="40" width="20" height="14" rx="2" fill="#2196F3" />
    <text x="12" y="51" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">JPG</text>
  </svg>
);

// PNG Icon Component
const PNGIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0H4C1.79086 0 0 1.79086 0 4V52C0 54.2091 1.79086 56 4 56H44C46.2091 56 48 54.2091 48 52V16L32 0Z" fill="#E0E0E0" />
    <path d="M32 0L48 16H38C34.6863 16 32 13.3137 32 10V0Z" fill="#BDBDBD" />
    <rect x="2" y="40" width="20" height="14" rx="2" fill="#2196F3" />
    <text x="12" y="51" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">PNG</text>
  </svg>
);

const Messages: React.FC = (): JSX.Element => {
  useEffect(() => {
    // Only dismiss toasts on mount, not on every render
    const timer = setTimeout(() => {
      try {
        toast.dismiss();
      } catch (e) {
        // Ignore errors if toast is already dismissed
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const socket = useSocket();
  const API_BASE = process.env.REACT_APP_API_URL;
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [productData, setProductData] = useState<any>(null);
  const [preFilledMessage, setPreFilledMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [selectedTab, setSelectedTab] = useState('All');
  type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  const [messageStatuses, setMessageStatuses] = useState<{ [key: string]: MessageStatus }>({});
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
  const [audioPlaybackTime, setAudioPlaybackTime] = useState<{ [key: number]: number }>({});
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState<{ [key: number]: number }>({});
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<{ [key: number]: number }>({});
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
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [labelConversationId, setLabelConversationId] = useState<number | null>(null);
  const [archivedCount, setArchivedCount] = useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const chatListRef = React.useRef<HTMLDivElement>(null);
  const messageRefs = React.useRef<Map<string | number, HTMLDivElement>>(new Map());
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as { conversationId?: string; productData?: any } | undefined;
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  // fetch notifications on mount
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return;

        const json = await res.json();
        if (!mounted || !json.success) return;

        const items = (json.data.items || []).map((n: any) => {
          const created = n.createdAt ? new Date(n.createdAt) : new Date();
          const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          const getDayLabel = (date: Date) => {
            const d = new Date(date); const today = new Date();
            if (d.toDateString() === today.toDateString()) return 'Today';
            const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
            if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
            return d.toLocaleDateString();
          };
          return { ...n, day: getDayLabel(created), time: n.time || formatTime(created) };
        });
        setNotifications(items);
        if (json.data.unreadCount !== undefined) setNotificationCount(json.data.unreadCount);
      } catch (e) {
        console.warn('Failed to load notifications', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Load conversation list for sidebar
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${API_BASE}/chat/conversations`,
          { params: { page: 1, limit: 20 }, headers: { Authorization: `Bearer ${token}` } }
        );
        const convos = res.data?.data || [];
        // Sort: pinned first, then by lastMessageAt
        const sorted = convos.sort((a: any, b: any) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return bTime - aTime;
        });
        setConversations(sorted);

        // Update current conversation if we have one
        if (conversationId) {
          const current = convos.find((c: any) => c.id === conversationId);
          if (current) {
            setCurrentConversation(current);
          }
        } else if (convos.length > 0 && !conversationId) {
          // If no active conversation, set the first one as active
          const first = convos[0];
          setConversationId(first.id);
          setParticipantId(first.otherParticipant?.id || null);
          loadMessages(first.id, 1, true);
        }
      } catch (err) {
        console.warn('Failed to load conversations', err);
      }
    };
    fetchConversations();
  }, [API_BASE]);

  // fetch unread counts function - shared between useEffects
  const fetchUnread = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        setNotificationCount(json.data.unreadCount ?? 0);
      }
    } catch (e) {
      // ignore
    }
  }, [setNotificationCount]);

  // fetch unread counts and archived count
  useEffect(() => {
    const fetchArchivedCount = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          `${API_BASE}/chat/conversations/archived/count`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.success && res.data?.data?.count !== undefined) {
          setArchivedCount(res.data.data.count);
        }
      } catch (e) {
        // ignore
      }
    }

    fetchUnread();
    fetchArchivedCount();
  }, [API_BASE]);

  // socket events
  useEffect(() => {
    if (!socket) return;

    const formatTime = (date: Date) =>
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const getDayLabel = (date: Date) => {
      const d = new Date(date);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return 'Today';
      };
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      };
      return d.toLocaleDateString();
    };

    const onNotification = (payload: any) => {
      const created = payload.createdAt ? new Date(payload.createdAt) : new Date();
      const normalized = {
        ...payload,
        day: getDayLabel(created),
        time: payload.time || formatTime(created),
        id: payload.id || `notif-${Date.now()}-${Math.random()}`
      };

      setNotifications(prev => {
        const existsById = prev.some(n => n.id === normalized.id);
        const existsByMeta = normalized.meta?.messageId ? prev.some(n => n.meta?.messageId === normalized.meta.messageId) : false;
        if (existsById || existsByMeta) return prev;
        return [normalized, ...prev];
      });
      setNotificationCount(prev => prev + 1);
    };

    const onNewMessageNotification = (payload: any) => {
      if (payload?.messageId) {
        const has = notifications.some(n => n.meta?.messageId === payload.messageId);
        if (has) return;
      };

      const created = new Date();
      const normalized = {
        id: payload.id || `tmp-${Date.now()}-${Math.random()}`,
        day: getDayLabel(created),
        time: payload.time || formatTime(created),
        title: payload.senderName || payload.title || 'Someone',
        body: payload.preview || payload.body || '',
        meta: { conversationId: payload.conversationId, messageId: payload.messageId },
        isRead: false,
        actor: payload.actor ?? null
      };

      setNotifications(prev => {
        const existsByMeta = payload?.messageId ? prev.some(n => n.meta?.messageId === payload.messageId) : false;
        if (existsByMeta) return prev;
        return [normalized, ...prev];
      });
      setNotificationCount(prev => prev + 1);
    };

    const onNewProductNotification = (payload: any) => {
      if (payload?.productId) {
        const has = notifications.some(n => n.meta?.productId === payload.productId);
        if (has) return;
      }

      const created = new Date();
      const normalized = {
        id: payload.id || `tmp-${Date.now()}-${Math.random()}`,
        day: getDayLabel(created),
        time: payload.time || formatTime(created),
        title: payload.sellerName || 'A seller',
        body: `just listed "${payload.productTitle || 'a new product'}"`,
        meta: {
          productId: payload.productId,
          productTitle: payload.productTitle,
          productImage: payload.productImage,
          sellerId: payload.sellerId,
          sellerName: payload.sellerName,
          sellerImage: payload.sellerImage
        },
        isRead: false,
        actor: payload.sellerImage ? {
          id: payload.sellerId,
          firstName: payload.sellerName?.split(' ')[0] || '',
          lastName: payload.sellerName?.split(' ').slice(1).join(' ') || '',
          profileImage: payload.sellerImage
        } : null
      };

      setNotifications(prev => {
        const existsByMeta = payload?.productId ? prev.some(n => n.meta?.productId === payload.productId) : false;
        if (existsByMeta) return prev;
        return [normalized, ...prev];
      });
      setNotificationCount(prev => prev + 1);
    };

    const onNotificationCount = (payload: any) => {
      const count = (payload && (payload.totalUnread ?? payload.unreadCount ?? payload.total)) as number | undefined;
      if (typeof count === 'number') {
        setNotificationCount(count);
      }
    };

    socket.on('notification', onNotification);
    socket.on('new_message_notification', onNewMessageNotification);
    socket.on('new_product_notification', onNewProductNotification);
    socket.on('notification_count', onNotificationCount);
    socket.on('notification_count_updated', () => {
      // Refresh notification count when it's updated
      fetchUnread();
    });

    return () => {
      socket.off('notification', onNotification);
      socket.off('new_message_notification', onNewMessageNotification);
      socket.off('new_product_notification', onNewProductNotification);
      socket.off('notification_count', onNotificationCount);
      socket.off('notification_count_updated');
    };
  }, [socket]);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${process.env.REACT_APP_API_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setNotificationCount(0);
      setNotificationTab('all');
    } catch (e) {
      console.warn('Failed to mark all as read', e);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (notificationTab === 'all') return true;
    if (notificationTab === 'unread') return !notif.isRead;
    if (notificationTab === 'messages') return notif.type === 'message' || notif.type === 'NEW_MESSAGE';
    return true;
  });

  const handleNotificationClick = async (notif: any) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));

    if (!notif.id) {
      // nothing to persist
    } else {
      try {
        const token = localStorage.getItem('accessToken');
        await fetch(`${process.env.REACT_APP_API_URL}/notifications/${notif.id}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        console.warn('Failed to mark notification read', e);
      }
    }

    if ((notif.type === 'NEW_MESSAGE' || notif.type === 'message') && notif.meta?.conversationId) {
      navigate('/messages', { state: { conversationId: notif.meta.conversationId } });
      setIsNotificationOpen(false);
    } else {
      navigate('/notifications', { state: { notificationId: notif.id } });
      setIsNotificationOpen(false);
    }
  };

  const getNotificationSenderName = (notif: any) => {
    if ((notif.type === 'NEW_MESSAGE' || notif.type === 'message') && notif.title) {
      return notif.title;
    }

    if (notif.title && notif.title !== 'Notification') {
      return notif.title
    }
  };

  const getNotificationAvatar = (notif: any) => {
    if (notif.actor?.profileImage) {
      return notif.actor.profileImage
    };

    if (notif.senderAvatar) {
      return notif.senderAvatar
    };

    if (notif.meta?.senderImage) {
      return notif.meta.senderImage;
    }

    return avatar;
  };

  // Helper function to check if a message already exists in the array
  const messageExists = (messagesArray: any[], message: any): boolean => {
    return messagesArray.some(m => {
      // If both have real IDs, compare them
      if (m.id && message.id && m.id === message.id) return true;
      // If both have tempIds, compare them
      if (m.tempId && message.tempId && m.tempId === message.tempId) return true;
      // If one has tempId and the other has the same id, they're the same message
      if (m.tempId && message.id && m.tempId === message.id) return true;
      if (m.id && message.tempId && m.id === message.tempId) return true;
      return false;
    });
  };

  // Helper function to deduplicate messages array
  const deduplicateMessages = (messagesArray: any[]): any[] => {
    const seen = new Set<string>();
    return messagesArray.filter(msg => {
      const key = msg.id || msg.tempId;
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // Helper to safely get a sender label from a reply sender field (can be string or object)
  const getReplySenderLabel = (sender: any, isIncoming: boolean) => {
    // If I'm the sender (not incoming), show "You"
    if (!isIncoming) {
      return 'You';
    }
    if (!sender) {
      return 'User';
    }
    if (typeof sender === 'string') {
      return sender;
    }
    // Check if sender is the current user
    if (sender.id && user?.id && String(sender.id) === String(user.id)) {
      return 'You';
    }
    const first = sender.firstName || '';
    const last = sender.lastName || '';
    const name = `${first} ${last}`.trim();
    if (name) return name;
    return 'User';
  };

  // Normalize messages to ensure UI fields exist
  const normalizeMessage = (msg: any, currentUserId?: string | null) => {
    const text = msg?.text ?? msg?.content ?? '';
    const isIncoming = msg?.isIncoming !== undefined
      ? msg.isIncoming
      : (msg?.senderId && currentUserId ? msg.senderId !== currentUserId : false);
    // Ensure reaction, metadata fields, and replyTo are preserved
    const reaction = msg?.reaction || null;
    const isPinned = msg?.isPinned || false;
    const isArchived = msg?.isArchived || false;
    const isImportant = msg?.isImportant || false;
    const label = msg?.label || null;
    const replyTo = msg?.replyTo || null;
    const productData = msg?.productData || null;
    const isProductInquiry = msg?.isProductInquiry !== undefined
      ? Boolean(msg.isProductInquiry)
      : Boolean(productData);

    // Preserve files/images from backend (fileUrl, fileName, etc.)
    // If message has files array from backend, preserve it
    // If message has fileUrl/fileName, convert to files array format
    let files = msg?.files || [];
    let images: any[] = [];
    let documents: any[] = [];

    // If files is an array of file objects with URLs, preserve them
    if (Array.isArray(files) && files.length > 0) {
      files.forEach((file: any) => {
        if (file.fileUrl || file.url) {
          if (file.fileType?.startsWith('image/') || file.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            images.push(file);
          } else {
            documents.push(file);
          }
        }
      });
    }

    // Also check for direct fileUrl/fileName properties (single file)
    if (msg?.fileUrl && !files.length) {
      const fileObj = {
        fileUrl: msg.fileUrl,
        fileName: msg.fileName || 'file',
        fileType: msg.fileType || 'application/octet-stream',
        fileSize: msg.fileSize || 0
      };
      if (msg.fileType?.startsWith('image/') || msg.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        images.push(fileObj);
      } else {
        documents.push(fileObj);
      }
      files = [fileObj];
    }

    // Preserve existing images/documents if they're File objects (from temp messages)
    // Only replace if we have URL-based files from backend
    const finalImages = images.length > 0 ? images : (msg?.images || []);
    const finalDocuments = documents.length > 0 ? documents : (msg?.documents || []);

    return {
      ...msg,
      text,
      isIncoming,
      reaction,
      isPinned,
      isArchived,
      isImportant,
      label,
      replyTo,
      productData,
      isProductInquiry,
      files,
      images: finalImages,
      documents: finalDocuments
    };
  };

  // Normalize status to lowercase for UI
  const normalizeStatus = (status: string | undefined): MessageStatus => {
    if (!status) return 'sent';
    const s = status.toString().toLowerCase();
    if (s === 'failed') return 'failed';
    if (s === 'sending') return 'sending';
    if (s === 'delivered') return 'delivered';
    if (s === 'read') return 'read';
    if (s === 'sent') return 'sent';
    return 'sent';
  };

  // Upsert message statuses into state map
  const upsertMessageStatuses = (msgs: any[]) => {
    setMessageStatuses(prev => {
      const next = { ...prev };
      msgs.forEach(m => {
        if (m?.id) {
          const normalized: MessageStatus = normalizeStatus(m.status as any);
          next[String(m.id)] = normalized;
        }
      });
      return next;
    });
  };

  // Join conversation room when conversationId is set
  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join the conversation room
    socket.emit('join_conversation', conversationId);

    return () => {
      socket.emit('leave_conversation', conversationId);
    };
  }, [socket, conversationId]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    function handleReceiveMessage(msg: any) {
      const normalized = normalizeMessage(msg, user?.id);

      // Update messages if this is the active conversation
      if (!conversationId || normalized.conversationId === conversationId) {
        setMessages(prev => {
          if (messageExists(prev, normalized)) {
            return prev.map(m => {
              if (m.id && normalized.id && m.id === normalized.id) return { ...m, ...normalized };
              if (m.tempId && normalized.tempId && m.tempId === normalized.tempId) return { ...m, ...normalized };
              if (m.tempId && normalized.id && m.tempId === normalized.id) return { ...m, ...normalized, tempId: undefined };
              if (m.id && normalized.tempId && m.id === normalized.tempId) return { ...m, ...normalized };
              return m;
            });
          }
          // Deduplicate after adding to ensure no duplicates
          const merged = deduplicateMessages([...prev, normalized]);
          upsertMessageStatuses([normalized]);
          return merged;
        });
      }

      // Always refresh conversations list to update last message and unread counts
      const refreshConversations = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(
            `${API_BASE}/chat/conversations`,
            { params: { page: 1, limit: 20 }, headers: { Authorization: `Bearer ${token}` } }
          );
          const convos = res.data?.data || [];
          setConversations(convos);
        } catch (err) {
          console.warn('Failed to refresh conversations on receive message', err);
        }
      };
      refreshConversations();
    }
    socket.on('receive_message', handleReceiveMessage);

    // Handle message sent confirmation (for sender's own messages)
    function handleMessageSent(data: any) {
      const normalized = normalizeMessage(data, user?.id);
      if (!conversationId || normalized.conversationId === conversationId) {
        // Preserve files from backend response
        const filesFromBackend = data.files || normalized.files;

        setMessages(prev => {
          // Check if message already exists (avoid duplicates)
          if (messageExists(prev, normalized)) {
            // Update existing message instead of adding duplicate
            return prev.map(m => {
              if (normalized.id && m.id === normalized.id) {
                const updated = { ...normalized, status: 'sent' };
                if (filesFromBackend) updated.files = filesFromBackend;
                return updated;
              }
              if (normalized.tempId && (m.tempId === normalized.tempId || m.id === normalized.tempId)) {
                const updated = { ...normalized, status: 'sent' };
                if (filesFromBackend) updated.files = filesFromBackend;
                return updated;
              }
              return m;
            });
          }

          // Remove temp message and any existing message with the same id
          const filtered = prev.filter(m => {
            // Keep messages that don't match the tempId or the real id
            if (normalized.tempId && (m.tempId === normalized.tempId || m.id === normalized.tempId)) return false;
            if (normalized.id && m.id === normalized.id) return false;
            return true;
          });
          // Add the real message from backend and deduplicate
          const messageToAdd = { ...normalized, status: 'sent' };
          if (filesFromBackend) messageToAdd.files = filesFromBackend;
          const merged = deduplicateMessages([...filtered, messageToAdd]);
          upsertMessageStatuses([{ ...messageToAdd, status: 'sent' }]);
          return merged;
        });
      }
    }
    socket.on('message_sent', handleMessageSent);

    // Handle typing indicators
    function handleUserTyping(data: any) {
      if (!conversationId || data.conversationId === conversationId) {
        setShowTypingIndicator(true);
      }
    }
    function handleUserStopTyping(data: any) {
      if (!conversationId || data.conversationId === conversationId) {
        setShowTypingIndicator(false);
      }
    }
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    // Handle message status updates (delivered, read)
    function handleStatusUpdate(data: any) {
      // Don't filter by conversationId - status updates should work for all messages
      // The messageId is unique enough to identify the message
      const statusKey = String(data.messageId);
      const normalizedStatus = normalizeStatus(data.status);

      // Update messageStatuses state
      setMessageStatuses(prev => {
        const updated = { ...prev, [statusKey]: normalizedStatus };
        return updated;
      });

      // Also update message in messages array (check both id and tempId)
      setMessages(prev =>
        prev.map(msg => {
          if (String(msg.id) === statusKey || String(msg.tempId) === statusKey) {
            return { ...msg, status: normalizedStatus };
          }
          return msg;
        })
      );
    }
    socket.on('message_status_updated', handleStatusUpdate);

    // Handle messages read event (when recipient reads messages)
    function handleMessagesRead(data: any) {
      if (!conversationId || data.conversationId === conversationId) {
        setMessages(prev =>
          prev.map(msg => {
            if (data.messageIds.includes(msg.id)) {
              const updated = { ...msg, readAt: new Date().toISOString(), status: 'read' };
              // Update message statuses
              setMessageStatuses(prevStatuses => ({ ...prevStatuses, [String(msg.id)]: 'read' }));
              return updated;
            }
            return msg;
          })
        );
      }
    }
    socket.on('messages_read', handleMessagesRead);

    // Handle new message notifications (for conversation list updates)
    function handleNewMessageNotif(data: any) {
      // Refresh conversations list to update last message and unread counts
      const refreshConversations = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(
            `${API_BASE}/chat/conversations`,
            { params: { page: 1, limit: 20 }, headers: { Authorization: `Bearer ${token}` } }
          );
          const convos = res.data?.data || [];
          setConversations(convos);
        } catch (err) {
          console.warn('Failed to refresh conversations on new message', err);
        }
      };
      refreshConversations();
    }
    socket.on('new_message_notification', handleNewMessageNotif);

    // Handle reaction events
    function handleReactionAdded(data: any) {
      if (data.messageId && conversationId && String(data.conversationId) === String(conversationId)) {
        setMessages(prevMessages =>
          prevMessages.map(msg => {
            if (String(msg.id) === String(data.messageId)) {
              // Update reactions array if available, or set user's reaction
              if (data.allReactions) {
                const userReaction = data.allReactions.find((r: any) => r.userId === user?.id);
                return {
                  ...msg,
                  reaction: userReaction?.reaction || null,
                  reactions: data.allReactions,
                  // Also update for the sender if it's their reaction
                  ...(data.userId === user?.id ? { reaction: data.reaction } : {})
                };
              }
              // If it's the current user's reaction, update it
              if (String(data.userId) === String(user?.id)) {
                return { ...msg, reaction: data.reaction };
              }
              // For other users' reactions, we still need to update if we have reactions array
              return { ...msg, reactions: data.reactions || msg.reactions };
            }
            return msg;
          })
        );
      }
    }

    function handleReactionRemoved(data: any) {
      if (data.messageId && conversationId) {
        setMessages(prevMessages =>
          prevMessages.map(msg => {
            if (String(msg.id) === String(data.messageId)) {
              // Remove reaction if it's the current user's reaction
              if (String(data.userId) === String(user?.id)) {
                return { ...msg, reaction: undefined };
              }
            }
            return msg;
          })
        );
      }
    }

    function handleMessageMetadataUpdated(data: any) {
      if (data.messageId && conversationId) {
        setMessages(prevMessages =>
          prevMessages.map(msg => {
            if (String(msg.id) === String(data.messageId)) {
              return {
                ...msg,
                isPinned: data.metadata?.isPinned || false,
                isArchived: data.metadata?.isArchived || false,
                isImportant: data.metadata?.isImportant || false,
                label: data.metadata?.label || null
              };
            }
            return msg;
          })
        );
      }
    }

    socket.on('reaction_added', handleReactionAdded);
    socket.on('reaction_removed', handleReactionRemoved);
    socket.on('message_metadata_updated', handleMessageMetadataUpdated);

    // Handle conversation metadata updates
    function handleConversationMetadataUpdated(data: any) {
      const { conversationId, metadata } = data;
      setConversations(prev => prev.map(conv => {
        if (String(conv.id) === String(conversationId)) {
          return { ...conv, ...metadata };
        }
        return conv;
      }));
    }

    // Handle conversation deletion
    function handleConversationDeleted(data: any) {
      const { conversationId } = data;
      setConversations(prev => prev.filter(conv => String(conv.id) !== String(conversationId)));
      if (String(conversationId) === String(conversationId)) {
        setConversationId(null);
        setMessages([]);
      }
    }

    socket.on('conversation_metadata_updated', handleConversationMetadataUpdated);
    socket.on('conversation_deleted', handleConversationDeleted);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
      socket.off('message_status_updated', handleStatusUpdate);
      socket.off('messages_read', handleMessagesRead);
      socket.off('new_message_notification', handleNewMessageNotif);
      socket.off('reaction_added', handleReactionAdded);
      socket.off('conversation_metadata_updated', handleConversationMetadataUpdated);
      socket.off('conversation_deleted', handleConversationDeleted);
      socket.off('reaction_removed', handleReactionRemoved);
      socket.off('message_metadata_updated', handleMessageMetadataUpdated);
    };
  }, [socket, conversationId, user?.id]);

  // websocket connection setup
  // useEffect(() => {
  //   if (socket) {
  //     socket.on('connect', () => {
  //       console.log('Socket connected!');
  //     });
  //     socket.on('disconnect', () => {
  //       console.log('Socket disconnected!');
  //     });
  //   }
  // }, [socket]);

  // Initialize conversation from navigation state
  useEffect(() => {
    const state = location.state as {
      conversationId?: string;
      productData?: any;
      sellerId?: string;
    } | undefined;
    if (state?.conversationId) {
      setConversationId(state.conversationId);
      if (state.sellerId) {
        setParticipantId(state.sellerId);
      }
      // Load initial messages
      loadMessages(state.conversationId, 1);
    }
  }, [location.state]);

  // Load messages from backend
  const loadMessages = async (conversationId: string, pageNum: number, reset = false) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE}/chat/conversations/${conversationId}/messages`,
        {
          params: { page: pageNum, limit: pageSize },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const rawMessages = response.data.data || [];
      const newMessages = rawMessages.map((m: any) => normalizeMessage(m, user?.id));

      setMessages(prev => {
        if (reset) {
          const deduped = deduplicateMessages(newMessages);
          upsertMessageStatuses(deduped);
          return deduped;
        } else {
          const merged = deduplicateMessages([...prev, ...newMessages]);
          upsertMessageStatuses(merged);
          return merged;
        }
      });
      setHasMore(newMessages.length === pageSize);
      setPage(pageNum);

      // Mark messages as read
      if (newMessages.length > 0) {
        markMessagesAsRead(conversationId, newMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string, messages: any[]) => {
    try {
      const unreadMessages = messages.filter(
        msg => !msg.readAt && msg.senderId !== user?.id
      );

      if (unreadMessages.length === 0) return;
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${API_BASE}/chat/conversations/${conversationId}/read`,
        { messageIds: unreadMessages.map(m => m.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Don't update local state here - wait for messages_read socket event from backend
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    if (!conversationId) return;
    // Strictly load from backend 
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${API_BASE}/chat/conversations/${conversationId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const normalized = (res.data.data || []).map((m: any) => normalizeMessage(m, user?.id));
        const deduped = deduplicateMessages(normalized);
        setMessages(deduped);
        upsertMessageStatuses(deduped);
      } catch (err) {
        // Handle error
      }
    };
    fetchMessages();
  }, [conversationId]);

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

  // useEffect(() => {
  //   const userId = 'CURRENT_USER_ID';
  //   async function fetchConvos() {
  //     try {
  //       const { data: convos } = await axios.get(`${API_BASE}/chat/conversations`/*, {headers: {Authorization: `Bearer ${token}`}}*/);
  //       if (convos.length) {
  //         const convoId = convos[0].id;
  //         loadMessages(convoId, 0, true);
  //       }
  //     } catch (err) { toast.error('Conversation load error: ' + (err)); }
  //   }
  //   fetchConvos();
  // }, [API_BASE]);

  const PAGE_SIZE = 20;

  const handleHomepageClick = () => {
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
    setMessagesError(null);
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

  const handleSaveLabel = async () => {
    if (!labelConversationId || !socket || !user) return;

    const conversationId = String(labelConversationId);
    const token = localStorage.getItem('accessToken');

    try {
      // Optimistically update UI
      setConversations(prev => prev.map(conv => {
        if (String(conv.id) === conversationId) {
          return { ...conv, label: labelInput.trim() || null };
        }
        return conv;
      }));

      // Emit to socket
      socket.emit('update_conversation_metadata', {
        conversationId,
        label: labelInput.trim() || null
      });

      // Also update via API
      await axios.patch(
        `${API_BASE}/chat/conversations/${conversationId}/metadata`,
        { label: labelInput.trim() || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Label saved');
      setShowLabelModal(false);
      setLabelInput('');
      setLabelConversationId(null);
    } catch (error: any) {
      console.error('Error saving label:', error);
      toast.error(error.response?.data?.error || 'Failed to save label');
    }
  };

  const handleActionSelect = async (action: string, chatId: number) => {
    if (!socket || !user) return;

    const conversationId = String(chatId);
    const token = localStorage.getItem('accessToken');

    try {
      if (action === 'Add label') {
        // Open label modal
        setLabelConversationId(chatId);
        setShowLabelModal(true);
        setActionsMenuOpen(null);
        setActionsMenuCoords(null);
        return;
      }

      if (action === 'Pin the chat' || action === 'Unpin the chat') {
        const isPinned = action === 'Pin the chat';
        // Optimistically update UI
        setConversations(prev => prev.map(conv => {
          if (String(conv.id) === conversationId) {
            return { ...conv, isPinned };
          }
          return conv;
        }));
        // Update current conversation and isChatPinned state
        if (String(currentConversation?.id) === conversationId) {
          setCurrentConversation((prev: any) => ({ ...prev, isPinned }));
          setIsChatPinned(isPinned);
        }
        // Emit to socket
        socket.emit('update_conversation_metadata', {
          conversationId,
          isPinned
        });
        // Also update via API
        await axios.patch(
          `${API_BASE}/chat/conversations/${conversationId}/metadata`,
          { isPinned },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (action === 'Mute the chat') {
        // Optimistically update UI
        setConversations(prev => prev.map(conv => {
          if (String(conv.id) === conversationId) {
            return { ...conv, isMuted: true };
          }
          return conv;
        }));
        // Emit to socket
        socket.emit('update_conversation_metadata', {
          conversationId,
          isMuted: true
        });
        // Also update via API
        await axios.patch(
          `${API_BASE}/chat/conversations/${conversationId}/metadata`,
          { isMuted: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Chat muted');
      }

      if (action === 'Archive the chat') {
        // Optimistically update UI - remove from list
        setConversations(prev => prev.filter(conv => String(conv.id) !== conversationId));
        // Update archived count
        setArchivedCount(prev => prev + 1);
        // Emit to socket
        socket.emit('update_conversation_metadata', {
          conversationId,
          isArchived: true
        });
        // Also update via API
        await axios.patch(
          `${API_BASE}/chat/conversations/${conversationId}/metadata`,
          { isArchived: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Chat archived');
        // If this was the active conversation, clear it
        if (String(chatId) === String(conversationId)) {
          setConversationId(null);
          setMessages([]);
        }
      }

      if (action === 'Delete the chat') {
        if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
          // Optimistically update UI - remove from list
          setConversations(prev => prev.filter(conv => String(conv.id) !== conversationId));
          // Emit to socket
          socket.emit('delete_conversation', { conversationId });
          // Also delete via API
          await axios.delete(
            `${API_BASE}/chat/conversations/${conversationId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Conversation deleted');
          // If this was the active conversation, clear it
          if (String(chatId) === String(conversationId)) {
            setConversationId(null);
            setMessages([]);
          }
        }
      }

      setActionsMenuOpen(null);
      setActionsMenuCoords(null);
    } catch (error: any) {
      console.error('Error performing action:', error);
      toast.error(error.response?.data?.error || 'Failed to perform action');
    }
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

  // Function to format last message text for sidebar
  const formatLastMessageText = (message: any, isIncoming: boolean = false): string => {
    if (!message) return '';

    // Check for audio message
    if (message.audioUrl || message.messageType === 'AUDIO' || message.type === 'voice') {
      return 'sent an audio';
    }

    // Check for image(s)
    const hasImages = message.imageUrl ||
      (message.files && Array.isArray(message.files) && message.files.some((f: any) =>
        f.fileType?.startsWith('image/') || f.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      )) ||
      (message.fileUrl && message.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i));

    if (hasImages) {
      return 'sent a photo';
    }

    // Check for file(s) - documents
    const hasFiles = message.fileUrl ||
      (message.files && Array.isArray(message.files) && message.files.length > 0) ||
      (message.messageType === 'FILE');

    if (hasFiles && !hasImages) {
      return 'sent a file';
    }

    // If there's text content and it's not encrypted-looking, show it
    const content = message.content || message.text || '';
    if (content && content.trim() && !content.match(/^[A-Za-z0-9+/=]{20,}$/)) {
      // Not encrypted-looking, show the content (don't add prefix for text messages)
      return content;
    }

    // Default fallback - if content looks encrypted or is empty, return empty
    // The UI will show "No messages yet" if empty
    return '';
  };

  // Render sidebar status indicator
  const renderSidebarStatus = (messageId: string | number) => {
    const status = messageStatuses[String(messageId)] || 'sending';

    switch (status) {
      case 'sending':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'read':
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 -ml-2.5" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
  const handleReactionSelect = async (reaction: string) => {
    const messageId = activeReactionMessageId !== null ? activeReactionMessageId : mobileMessageOptionsId;

    if (messageId !== null && socket) {
      // Optimistically update UI
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, reaction }
            : msg
        )
      );

      // Emit to socket to persist and sync
      socket.emit('add_reaction', {
        messageId: String(messageId),
        reaction
      });
    }

    setActiveReactionMessageId(null);
    setMobileMessageOptionsId(null);
    setShowMobileReactionPicker(false);
    setShowReactionEmojiPicker(false);
    setMobileMessageCoords(null);
  };

  // Handle reaction removal
  const handleRemoveReaction = async (messageId: number) => {
    if (socket) {
      // Optimistically update UI
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, reaction: undefined }
            : msg
        )
      );

      // Emit to socket to persist and sync
      socket.emit('remove_reaction', {
        messageId: String(messageId)
      });
    }
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
  const handleMessageOptionSelect = (action: string, messageOrId?: { id: number } | number | string) => {
    // Support being called with either a message object ({ id }) or a raw id (number/string)
    const rawId = typeof messageOrId === 'object' && messageOrId !== null
      ? (messageOrId as any).id
      : messageOrId;
    const messageId = rawId !== undefined && rawId !== null ? String(rawId) : undefined;
    console.log('Selected action:', action);

    if (action === 'reply' && messageId) {
      // Find the message to reply to
      const messageToReply = messages.find(m => String(m.id) === messageId);
      if (messageToReply) {
        // Set reply to message - this will show the reply preview above the input
        setReplyToMessage({
          id: messageToReply.id,
          text: messageToReply.text || messageToReply.content || '',
          content: messageToReply.content || messageToReply.text || '',
          isIncoming: messageToReply.isIncoming,
          // Prefer full sender object if available; otherwise fall back to a minimal shape
          sender: messageToReply.sender || {
            id: messageToReply.senderId,
            firstName: messageToReply.isIncoming ? 'User' : 'You',
            lastName: '',
            profileImage: null
          },
          type: messageToReply.type,
          duration: messageToReply.duration,
          waveformData: messageToReply.waveformData,
          audioUrl: messageToReply.audioUrl
        });
        // Scroll to input area to show reply preview
        setTimeout(() => {
          const inputElement = document.querySelector('input[placeholder*="Write your message"]');
          if (inputElement) {
            inputElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }
    }

    if (action === 'important' && messageId && socket) {
      // Find the message
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const newImportantStatus = !message.isImportant;
        // Optimistically update UI
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId
              ? { ...msg, isImportant: newImportantStatus }
              : msg
          )
        );
        // Emit to socket to persist
        socket.emit('update_message_metadata', {
          messageId: String(messageId),
          isImportant: newImportantStatus
        });
      }
    }

    if (action === 'pin' && messageId && socket) {
      // Find the message
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const newPinnedStatus = !message.isPinned;
        if (newPinnedStatus) {
          // Pin the message
          setPinnedMessage(message);
        } else {
          // Clear pinned message preview if this was the pinned message
          if (pinnedMessage && pinnedMessage.id === messageId) {
            setPinnedMessage(null);
          }
        }
        // Optimistically update UI
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId
              ? { ...msg, isPinned: newPinnedStatus }
              : msg
          )
        );
        // Emit to socket to persist
        socket.emit('update_message_metadata', {
          messageId: String(messageId),
          isPinned: newPinnedStatus
        });
      }
    }

    if (action === 'copy' && messageId) {
      // Find the message
      const message = messages.find(m => String(m.id) === messageId);
      if (message) {
        const textToCopy = message.text || message.content || '';
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            toast.success('Message copied to clipboard');
          }).catch(() => {
            toast.error('Failed to copy message');
          });
        }
      }
    }

    if (action === 'select' && messageId) {
      // Toggle message selection (for bulk actions)
      setSelectedMessages(prev => {
        const messageIdNum = Number(messageId);
        if (prev.has(messageIdNum)) {
          const newSet = new Set(prev);
          newSet.delete(messageIdNum);
          return newSet;
        } else {
          const newSet = new Set(prev);
          newSet.add(messageIdNum);
          return newSet;
        }
      });
    }

    if (action === 'delete' && messageId && socket) {
      // Delete message for current user (soft delete - archive it)
      const message = messages.find(m => String(m.id) === messageId);
      if (message) {
        // Optimistically update UI - remove from view
        setMessages(prevMessages =>
          prevMessages.filter(msg => String(msg.id) !== messageId)
        );
        // Emit to socket to persist
        socket.emit('update_message_metadata', {
          messageId: String(messageId),
          isArchived: true
        });
        toast.success('Message deleted');
      }
    }

    // Close the options menu (both desktop and mobile)
    setActiveMessageOptionsId(null);
    setMobileMessageOptionsId(null);
    setShowMobileReactionPicker(false);
    setMobileMessageCoords(null);
  };

  // Handle important badge removal
  const handleRemoveImportant = async (messageId: number) => {
    if (socket) {
      // Optimistically update UI
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, isImportant: false }
            : msg
        )
      );
      // Emit to socket to persist
      socket.emit('update_message_metadata', {
        messageId: String(messageId),
        isImportant: false
      });
    }
  };

  // Handle pin badge removal
  const handleRemovePin = async (messageId: number) => {
    if (socket) {
      // Optimistically update UI
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
      // Emit to socket to persist
      socket.emit('update_message_metadata', {
        messageId: String(messageId),
        isPinned: false
      });
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

  // Close chat on Escape key (desktop only)
  useEffect(() => {
    const handleEscapeChat = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && conversationId && window.innerWidth >= 768) {
        setConversationId(null);
        setParticipantId(null);
        setCurrentConversation(null);
        setMessages([]);
        setActiveChatId(null);
      }
    };

    document.addEventListener('keydown', handleEscapeChat);
    return () => {
      document.removeEventListener('keydown', handleEscapeChat);
    };
  }, [conversationId]);

  const MessageStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'sending':
        return <span className="text-gray-400 text-xs">Sending...</span>;
      case 'sent':
        return <span className="text-gray-400 text-xs">Sent</span>;
      case 'delivered':
        return <span className="text-gray-400 text-xs">Delivered</span>;
      case 'read':
        return <span className="text-blue-500 text-xs">Read</span>;
      case 'failed':
        return <span className="text-red-500 text-xs">Failed</span>;
      default:
        return null;
    }
  };

  // Render message status indicator
  const renderMessageStatus = (messageId: string | number) => {
    // Check both messageStatuses and message.status
    const message = messages.find(m => String(m.id) === String(messageId) || String(m.tempId) === String(messageId));
    const status = messageStatuses[String(messageId)] || message?.status || 'sending';

    switch (status) {
      case 'sending':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'sent':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'read':
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 -ml-2.5" style={{ color: '#64B5F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Function to scroll to a specific message
  const scrollToMessage = useCallback((messageId: string | number) => {
    const messageElement = messageRefs.current.get(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the message briefly
      messageElement.style.backgroundColor = 'rgba(100, 181, 246, 0.2)';
      setTimeout(() => {
        messageElement.style.backgroundColor = '';
      }, 2000);
    }
  }, []);

  // conversation click handler
  const handleConversationClick = useCallback((conv: any) => {
    setCurrentConversation(conv);
    setConversationId(conv.id);
    setParticipantId(conv.otherParticipant?.id || null);
    setIsChatPinned(conv.isPinned || false);

    // Load messages for this conversation
    loadMessages(conv.id, 1, true).then(() => {
      // Mark messages as read when conversation is opened
      if (conv.unreadCount > 0) {
        markMessagesAsRead(conv.id, []);
      }
    });
    // Mobile: Open conversation view
    if (window.innerWidth < 768) {
      setShowMobileConversation(true);
    }
  }, [loadMessages, markMessagesAsRead]);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  // Handle incoming product data from Product Detail page
  useEffect(() => {
    if (location.state) {
      const { productData, preFilledMessage, conversationId: stateConversationId } = location.state;

      // Set conversationId from state if provided
      if (stateConversationId && !conversationId) {
        setConversationId(stateConversationId);
        // Find and set the conversation
        const conv = conversations.find((c: any) => String(c.id) === String(stateConversationId));
        if (conv) {
          setCurrentConversation(conv);
          setParticipantId(conv.otherParticipant?.id || null);
          setIsChatPinned(conv.isPinned || false);
          loadMessages(conv.id, 1, true);
        }
      }

      if (productData) {
        // Normalize productData to ensure all fields are included
        const normalizedProductData = {
          id: productData.id,
          name: productData.name || productData.title,
          title: productData.title || productData.name,
          price: productData.price,
          currency: productData.currency || 'USD',
          description: productData.description || '',
          // Extract image URLs from images array if needed
          image: (() => {
            // Try imageUrls first (from ProductDetail)
            if (productData.imageUrls && productData.imageUrls.length > 0) {
              return productData.imageUrls[0];
            }
            // Try direct image property
            if (productData.image) {
              return productData.image;
            }
            // Try images array
            if (productData.images) {
              try {
                // Handle JSON string
                const imagesArray = typeof productData.images === 'string'
                  ? JSON.parse(productData.images)
                  : productData.images;

                if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                  const firstImg = imagesArray[0];
                  return typeof firstImg === 'string' ? firstImg : firstImg?.url || firstImg?.key;
                }
              } catch (e) {
                console.warn('Error parsing product images:', e);
              }
            }
            return null;
          })(),
          images: (() => {
            // Try imageUrls first
            if (productData.imageUrls && productData.imageUrls.length > 0) {
              return productData.imageUrls;
            }
            // Try images array
            if (productData.images) {
              try {
                const imagesArray = typeof productData.images === 'string'
                  ? JSON.parse(productData.images)
                  : productData.images;

                if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                  return imagesArray.map((img: any) => {
                    if (typeof img === 'string') return img;
                    return img?.url || img?.key;
                  }).filter(Boolean);
                }
              } catch (e) {
                console.warn('Error parsing product images:', e);
              }
            }
            // Fallback to image property
            return productData.image ? [productData.image] : [];
          })(),
          category: productData.category,
          location: productData.location,
          origin: productData.origin,
          quantity: productData.quantity,
          saleType: productData.saleType,
          deliveryAvailable: productData.deliveryAvailable,
          seller: productData.seller
        };
        setProductData(normalizedProductData);
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

  const handleSendMessage = async (content: string) => {
    // Ensure conversationId is set
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      // Try to get it from currentConversation
      if (currentConversation?.id) {
        activeConversationId = currentConversation.id;
        setConversationId(activeConversationId);
      } else if (location.state?.conversationId) {
        activeConversationId = location.state.conversationId;
        setConversationId(activeConversationId);
      } else {
        toast.error("Please select a conversation first.");
        return;
      }
    }

    // Allow sending if there are files even without text content
    if (!socket || !activeConversationId || (!content.trim() && selectedFiles.length === 0 && !replyToMessage)) {
      console.error('Cannot send message:', { socket: !!socket, conversationId: activeConversationId, hasContent: !!content.trim(), hasFiles: selectedFiles.length > 0 });
      return;
    }

    setMessagesError(null);
    if (!user?.id || !activeConversationId) {
      toast.error("User not authenticated or no active chat.");
      return;
    }

    // Allow sending attachments without text, but not completely empty messages
    if (!content.trim() && selectedFiles.length === 0 && !replyToMessage) {
      toast.info("Cannot send empty message.");
      return;
    }

    if (!socket) {
      toast.error('WebSocket not connected. Please refresh the page.');
      return;
    }

    try {
      let filePayloads: { fileName: string; fileUrl: string; fileType: string; fileSize: number; }[] = [];

      // Handle file uploads first
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(`${API_BASE}/upload/chat`, {
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              userId: user.id
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            // Handle different response structures
            const responseData = response.data?.data || response.data;
            const uploadUrl = responseData?.uploadUrl || responseData?.url;
            const viewUrl = responseData?.viewUrl || responseData?.fileUrl || uploadUrl;

            if (!uploadUrl) {
              throw new Error('Upload URL not received from server');
            }

            await gcpStorageService.uploadFile(file, uploadUrl);
            filePayloads.push({
              fileName: file.name,
              fileUrl: viewUrl || uploadUrl,
              fileType: file.type,
              fileSize: file.size
            });
          } catch (err: any) {
            console.error('File upload error:', err);
            toast.error('File upload failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
            setMessagesError('File upload failed.');
            return; // Stop sending message if file upload fails
          }
        }
      }

      // Allow empty content if files are present
      const messageContent = (content.trim() || preFilledMessage.trim() || '');
      const tempId = `temp_${Date.now()}_${Math.random()}`;

      // Prepare productData for sending - ensure it includes all required fields
      let productDataToSend: any = null;
      if (productData && !isMessageSent) {
        productDataToSend = {
          id: productData.id,
          name: productData.name || productData.title,
          title: productData.title || productData.name,
          price: productData.price,
          currency: productData.currency || 'USD',
          description: productData.description || '',
          image: productData.image || null,
          images: productData.images || (productData.image ? [productData.image] : []),
          category: productData.category,
          location: productData.location,
          origin: productData.origin,
          quantity: productData.quantity,
          saleType: productData.saleType,
          deliveryAvailable: productData.deliveryAvailable,
          seller: productData.seller
        };
      }

      // Create temporary message for optimistic UI (will be replaced by backend response)
      // Include selected files for preview while uploading
      const images: File[] = [];
      const documents: File[] = [];
      selectedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          images.push(file);
        } else {
          documents.push(file);
        }
      });

      const tempMessage = {
        id: tempId,
        tempId,
        content: messageContent,
        text: messageContent,
        conversationId: activeConversationId,
        senderId: user.id,
        isIncoming: false,
        status: 'sending' as const,
        timestamp: new Date().toISOString(),
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: {
          id: user.id,
          firstName: user.firstName || 'You',
          lastName: user.lastName || '',
          profileImage: user.profileImage || null
        },
        files: filePayloads,
        images: images.length > 0 ? images : undefined,
        documents: documents.length > 0 ? documents : undefined,
        messageType: filePayloads.length > 0 ? 'FILE' : 'TEXT',
        productData: productDataToSend,
        isProductInquiry: !!productDataToSend,
        replyTo: replyToMessage ? {
          id: replyToMessage.id,
          text: replyToMessage.text || replyToMessage.content,
          sender: replyToMessage.sender,
          type: replyToMessage.type
        } : undefined
      };

      // Add temp message to UI (will be replaced by real message from backend)
      // Check if message already exists before adding (shouldn't happen, but safe)
      setMessages(prev => {
        if (messageExists(prev, tempMessage)) {
          return prev; // Don't add if already exists
        }
        return deduplicateMessages([...prev, tempMessage]);
      });
      // Set temp status to sending
      setMessageStatuses(prev => ({ ...prev, [tempId]: 'sending' }));

      // Clear input fields
      setMessageText('');
      setPreFilledMessage('');
      setSelectedFiles([]);
      setShowFilePreview(false);
      setReplyToMessage(null);
      setHasIncomingReply(false);
      setIsReplyRead(false);
      // Clear productData after sending
      if (productDataToSend) {
        setProductData(null);
      }

      // Emit socket event to send message
      socket.emit('send_message', {
        tempId,
        conversationId: activeConversationId,
        senderId: user.id,
        receiverId: participantId || undefined,
        content: messageContent || '', // Ensure content is always a string
        messageType: filePayloads.length > 0 ? 'FILE' : 'TEXT',
        files: filePayloads.length > 0 ? filePayloads : undefined, // Only send files if there are any
        replyToId: replyToMessage?.id,
        productData: productDataToSend
      }, (response: any) => {
        if (!response?.success) {
          // Remove temp message and show error
          setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
          toast.error('Failed to send message: ' + (response?.error || 'Unknown error'));
        }
        // If success, the message_sent or receive_message event will update the UI
      });

      setIsMessageSent(true);

    } catch (err: any) {
      console.error('Error in handleSendMessage:', err);
      toast.error('An error occurred while sending your message: ' + (err?.response?.data?.message || err.message || err));
      setMessagesError('Failed to send message.');
    }
  };

  const handleSendButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (messageText.trim()) {
      handleSendMessage(messageText);
    } else if (selectedFiles.length > 0) {
      // Handle file upload
      handleSendMessage('');
    } else {
      handleAudioRecord();
    }
  };

  // Auto-mark messages as read when conversation is opened
  useEffect(() => {
    if (!conversationId || !user?.id || messages.length === 0) return;

    const unreadMessages = messages.filter(
      msg => !msg.readAt && msg.senderId !== user.id
    );

    if (unreadMessages.length > 0) {
      markMessagesAsRead(conversationId, unreadMessages);
    }
  }, [conversationId, messages, user?.id]);

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
        replyTo: replyToMessage
          ? {
            text: replyToMessage.text,
            // Store a simple label; rendering code will handle string vs object uniformly
            sender: getReplySenderLabel(replyToMessage.sender, replyToMessage.isIncoming),
            type: replyToMessage.type,
            duration: replyToMessage.duration,
            waveformData: replyToMessage.waveformData,
            audioUrl: replyToMessage.audioUrl
          }
          : null
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

      // Voice message sent - conversation will update via socket events

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

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

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
                        src={
                          currentConversation?.otherParticipant?.profileImage ||
                          eboAvatar
                        }
                        alt={
                          currentConversation?.otherParticipant?.firstName ||
                          "Seller"
                        }
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                      />
                    </div>

                    {/* Name and Rating */}
                    <div className="flex items-center justify-center space-x-1.5 mb-2">
                      <h3 className="text-base font-medium text-gray-900">
                        {currentConversation?.otherParticipant
                          ? `${currentConversation.otherParticipant.firstName ||
                            ""
                            } ${currentConversation.otherParticipant.lastName ||
                            ""
                            }`.trim()
                          : "Unknown User"}
                      </h3>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                        <span style={{ fontSize: '10px', color: '#64B5F6' }}>
                          {currentConversation?.otherParticipant?.location || 'London | United Kingdom'}
                        </span>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="flex items-center justify-center space-x-2 text-sm mb-4">
                      <img
                        src={profileIcon}
                        alt="Profile"
                        className="w-4 h-4"
                        style={{ filter: 'brightness(0) saturate(100%) invert(44%) sepia(0%) saturate(0%) hue-rotate(208deg) brightness(94%) contrast(86%)' }}
                      />
                      <span style={{ color: '#BABABA' }}>
                        Joined BAO' Afrik in {currentConversation?.otherParticipant?.createdAt
                          ? new Date(currentConversation.otherParticipant.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                          : 'June 2018'}
                      </span>
                    </div>

                    {/* Bio - Shortened */}
                    <p className="text-xs text-center mb-3" style={{ color: '#BABABA', justifyContent: 'center' }}>
                      {currentConversation?.otherParticipant?.bio || 'Passionate about discovering unique products and always on the lookout for great deals. I enjoy exploring new brands, trying out innovative items, and supporting businesses that deliver quality and creativity.'}
                    </p>

                    {/* See User Profile Button */}
                    <div className="flex justify-center">
                      <button
                        className="px-5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: '#F0F8FE',
                          color: '#64B5F6'
                        }}
                        onClick={() => {
                          const participant = currentConversation?.otherParticipant;
                          if (participant) {
                            const sellerSlug = `${participant.firstName} ${participant.lastName}`
                              .toLowerCase()
                              .trim()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '');

                            // Store seller data in sessionStorage for SellerProfile.tsx
                            sessionStorage.setItem(`seller_${sellerSlug}_data`, JSON.stringify(participant));
                            sessionStorage.setItem(`seller_${sellerSlug}_id`, participant.id);

                            navigate(`/seller/${sellerSlug}`);
                          }
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
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                    // Use id if available, otherwise use tempId, fallback to index for uniqueness
                    const messageKey = message.id || message.tempId || `msg-${index}-${message.timestamp || Date.now()}`;
                    return (
                      <div
                        key={messageKey}
                        ref={(el) => {
                          if (el && message.id) {
                            messageRefs.current.set(message.id, el);
                          }
                        }}
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
                              {message.images.map((image: any, imgIndex: number) => {
                                // Handle both File objects and URL objects from backend
                                let imageUrl: string;
                                if (image instanceof File || image instanceof Blob) {
                                  imageUrl = URL.createObjectURL(image);
                                } else if (typeof image === 'string') {
                                  imageUrl = image;
                                } else {
                                  imageUrl = image.fileUrl || image.url || '';
                                }
                                const imageName = image.name || image.fileName || `image-${imgIndex}`;
                                return (
                                  <a
                                    key={imgIndex}
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={imageName}
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={imageName}
                                      className="object-cover"
                                      style={{
                                        borderRadius: '12px',
                                        maxWidth: '160px',
                                        maxHeight: '160px'
                                      }}
                                    />
                                  </a>
                                );
                              })}
                            </div>
                          )}

                          {/* Files from backend (files array with URLs) */}
                          {message.files && message.files.length > 0 && !message.images?.length && (
                            <div className={`flex flex-wrap gap-1 mb-2 ${message.isIncoming ? 'justify-start' : 'justify-end'}`}>
                              {message.files
                                .filter((file: any) => file.fileType?.startsWith('image/') || file.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                                .map((file: any, imgIndex: number) => (
                                  <a
                                    key={imgIndex}
                                    href={file.fileUrl || file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={file.fileName || `image-${imgIndex}`}
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                  >
                                    <img
                                      src={file.fileUrl || file.url}
                                      alt={file.fileName || `image-${imgIndex}`}
                                      className="object-cover"
                                      style={{
                                        borderRadius: '12px',
                                        maxWidth: '160px',
                                        maxHeight: '160px'
                                      }}
                                    />
                                  </a>
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
                                          <rect x="1" y="4" width="2" height="4" fill="#64B5F6" />
                                          <rect x="5" y="2" width="2" height="8" fill="#64B5F6" />
                                          <rect x="9" y="0" width="2" height="12" fill="#64B5F6" />
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
                                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }} />
                                        </svg>
                                      ) : (
                                        <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                          <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }} />
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
                                      [3, 5, 3, 6, 9, 11, 13, 11, 9, 6, 5, 3, 6, 8, 9, 8, 6, 5, 3, 5].map((h, i) => {
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
                                      {/* Replied Message Text Above */}
                                      <div
                                        className="cursor-pointer hover:opacity-80 transition-opacity mb-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (message.replyTo?.id) {
                                            scrollToMessage(message.replyTo.id);
                                          }
                                        }}
                                      >
                                        {message.replyTo.type === 'voice' ? (
                                          /* Voice Note Reply - Screenshot Structure - TWO LINES */
                                          <div className="flex items-start">
                                            {/* White vertical line on LEFT - spans both sender label and audio preview */}
                                            <div
                                              className="rounded-full mr-1.5"
                                              style={{
                                                width: '2px',
                                                backgroundColor: message.isIncoming ? '#64B5F6' : '#FFFFFF',
                                                flexShrink: 0,
                                                alignSelf: 'stretch'
                                              }}
                                            ></div>

                                            <div className="flex-1">
                                              {/* Sender label */}
                                              <div style={{ fontSize: '10px', color: message.isIncoming ? '#64B5F6' : '#CFE8FC', fontWeight: 500, marginBottom: '4px' }}>
                                                {getReplySenderLabel(message.replyTo.sender, message.isIncoming)}
                                              </div>
                                              {/* Audio preview */}
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
                                                    [2, 3, 2, 4, 6, 7, 8, 7, 6, 4, 6, 5, 3, 6, 8, 9, 8, 6, 5, 3].map((h, i) => {
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
                                          /* Text Reply - Show replied message text */
                                          <div className="flex items-stretch">
                                            {/* Vertical line - spans both sender label and message text */}
                                            <div
                                              className="rounded-full mr-1.5"
                                              style={{
                                                width: '2px',
                                                backgroundColor: message.isIncoming ? '#64B5F6' : '#FFFFFF',
                                                flexShrink: 0,
                                                alignSelf: 'stretch'
                                              }}
                                            ></div>

                                            {/* Quoted message info */}
                                            <div className="flex-1">
                                              <p style={{ fontSize: '10px', fontWeight: 500, marginBottom: '2px', color: message.isIncoming ? '#64B5F6' : 'rgba(255, 255, 255, 0.9)' }}>
                                                {getReplySenderLabel(message.replyTo.sender, message.isIncoming)}
                                              </p>
                                              <p style={{ fontSize: '10px', color: message.isIncoming ? '#6A6A6A' : 'rgba(255, 255, 255, 0.6)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.3' }}>
                                                {message.replyTo.text}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Reply Text Below */}
                                      {message.text && (
                                        <p
                                          style={{ fontSize: '12px', marginBottom: 0, color: message.isIncoming ? '#6A6A6A' : '#FFFFFF' }}
                                        >
                                          {message.text}
                                        </p>
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
                                      {message.documents.map((doc: any, docIndex: number) => {
                                        // Handle both File objects and URL objects from backend
                                        const fileName = (doc.name || doc.fileName || 'file').split('.');
                                        const extension = fileName.pop() || '';
                                        const nameWithoutExt = fileName.join('.');
                                        const fileSize = doc.size || doc.fileSize || 0;
                                        const fileSizeMB = fileSize / (1024 * 1024);
                                        const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
                                        const extensionLower = extension.toLowerCase();
                                        const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                                        const fileUrl = doc.fileUrl || doc.url || (doc instanceof File ? URL.createObjectURL(doc) : null);
                                        return (
                                          <a
                                            key={docIndex}
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={doc.name || doc.fileName || `file-${docIndex}`}
                                            className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}
                                          >
                                            <DocumentIcon size={32} />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs truncate" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                                                {nameWithoutExt} · {extension}
                                              </p>
                                              <p style={{ fontSize: '10px', color: '#B8DDFB' }}>
                                                {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                                              </p>
                                            </div>
                                          </a>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Files from backend (files array with URLs) - documents */}
                                  {message.files && message.files.length > 0 && !message.documents?.length && (
                                    <div className={message.text ? 'mt-2' : ''}>
                                      {message.files
                                        .filter((file: any) => !file.fileType?.startsWith('image/') && !file.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                                        .map((file: any, docIndex: number) => {
                                          const fileName = (file.fileName || 'file').split('.');
                                          const extension = fileName.pop() || '';
                                          const nameWithoutExt = fileName.join('.');
                                          const fileSizeMB = (file.fileSize || 0) / (1024 * 1024);
                                          const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
                                          const extensionLower = extension.toLowerCase();
                                          const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                                          return (
                                            <a
                                              key={docIndex}
                                              href={file.fileUrl || file.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              download={file.fileName || `file-${docIndex}`}
                                              className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
                                              style={{ fontFamily: 'Poppins, sans-serif' }}
                                            >
                                              <DocumentIcon size={32} />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-xs truncate" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                                                  {nameWithoutExt} · {extension}
                                                </p>
                                                <p style={{ fontSize: '10px', color: '#B8DDFB' }}>
                                                  {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                                                </p>
                                              </div>
                                            </a>
                                          );
                                        })}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          <div className={`flex items-center mt-1 space-x-1 text-xs ${message.isIncoming ? 'justify-start' : 'justify-end'}`} style={{ color: '#6A6A6A' }}>
                            <span>{message.timeString || message.formattedTime || message.timestamp || new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {!message.isIncoming && message.id && renderMessageStatus(String(message.id))}

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
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <button
                            onClick={() => mobileMessageOptionsId !== undefined && handleMessageOptionSelect('reply', { id: mobileMessageOptionsId })}
                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <img src={replyIcon} alt="Reply" className="w-3.5 h-3.5 mr-2" />
                            <span className="text-xs" style={{ color: '#6B7280' }}>Reply the message</span>
                          </button>

                          <button
                            onClick={() => mobileMessageOptionsId !== undefined && handleMessageOptionSelect('important', { id: mobileMessageOptionsId })}
                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <img src={starIcon} alt="Star" className="w-3.5 h-3.5 mr-2" />
                            <span className="text-xs" style={{ color: '#6B7280' }}>Mark as important</span>
                          </button>

                          <button
                            onClick={() => mobileMessageOptionsId !== undefined && handleMessageOptionSelect('copy', { id: mobileMessageOptionsId })}
                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <img src={copyIcon} alt="Copy" className="w-3.5 h-3.5 mr-2" />
                            <span className="text-xs" style={{ color: '#6B7280' }}>Copy the message</span>
                          </button>

                          <button
                            onClick={() => mobileMessageOptionsId !== undefined && handleMessageOptionSelect('select', { id: mobileMessageOptionsId })}
                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <img src={tickIcon} alt="Select" className="w-3.5 h-3.5 mr-2" />
                            <span className="text-xs" style={{ color: '#6B7280' }}>Select the message</span>
                          </button>

                          <button
                            onClick={() => mobileMessageOptionsId !== undefined && handleMessageOptionSelect('pin', { id: mobileMessageOptionsId })}
                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <img src={pinMenuIcon} alt="Pin" className="w-3.5 h-3.5 mr-2" />
                            <span className="text-xs" style={{ color: '#6B7280' }}>
                              {messages.find(m => m.id === mobileMessageOptionsId)?.isPinned ? 'Unpin the message' : 'Pin the message'}
                            </span>
                          </button>

                          <button
                            onClick={() => mobileMessageOptionsId !== undefined && handleMessageOptionSelect('delete', { id: mobileMessageOptionsId })}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                        Premium White Pepper sourced from the fertile soils of Africa.<br />
                        Known for its smooth, aromatic heat and rich flavor...
                      </p>
                      <a href="#" style={{ fontSize: '9px', marginTop: '4px', display: 'block', color: '#83C4F8' }}>
                        baoafrik.com/product-id-link?
                      </a>
                    </div>
                  </div>
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
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }} />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }} />
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
                        [3, 5, 3, 6, 9, 11, 13, 11, 9, 6, 5, 3, 6, 8, 9, 8, 6, 5, 3, 5].map((h, i) => (
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
                            handleSendMessage(messageText);
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
                <>
                  {/* Product Card Preview - Mobile */}
                  {productData && (
                    <div className="mb-2 px-2 py-1.5 rounded-lg relative" style={{ backgroundColor: '#F0F8FE', border: '1px solid #64B5F6' }}>
                      <button
                        onClick={() => setProductData(null)}
                        className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center hover:opacity-70 z-10"
                      >
                        <img src={replyCloseIcon} alt="Close" className="w-3 h-3" />
                      </button>
                      <div className="flex space-x-2 pr-5">
                        <div className="relative flex-shrink-0">
                          <img
                            src={productData.image || productData.images?.[0] || ''}
                            alt={productData.name || productData.title}
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <div style={{ fontSize: '9px', fontWeight: 600, color: '#64B5F6' }}>
                              {productData.currency || 'USD'} {productData.price}
                            </div>
                            {productData.location && (
                              <div className="flex items-center space-x-0.5" style={{ fontSize: '7px', color: '#64B5F6' }}>
                                <img src={locIcon} alt="Location" className="w-1.5 h-1.5" />
                                <span>{productData.location}</span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-[9px] font-medium truncate" style={{ color: '#64B5F6', marginBottom: '1px' }}>
                            {productData.name || productData.title}
                          </h4>
                          {productData.category && (
                            <p style={{ fontSize: '7px', color: '#64B5F6' }}>
                              Category: {productData.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reply Preview - Mobile */}
                  {replyToMessage && (
                    <div className="mb-2 px-2 py-1.5 rounded-lg" style={{ backgroundColor: '#F0F8FE', border: '1px solid #64B5F6' }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-stretch">
                            <div
                              className="rounded-full mr-1.5"
                              style={{
                                width: '2px',
                                backgroundColor: '#64B5F6',
                                flexShrink: 0,
                                alignSelf: 'stretch'
                              }}
                            ></div>
                            <div className="flex-1">
                              <p className="text-[10px] font-medium mb-0.5" style={{ color: '#64B5F6' }}>
                                {getReplySenderLabel(replyToMessage.sender, replyToMessage.isIncoming)}
                              </p>
                              <p className="text-[10px] truncate" style={{ color: '#6A6A6A' }}>
                                {replyToMessage.text || replyToMessage.content || (replyToMessage.type === 'voice' ? 'Voice message' : '')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setReplyToMessage(null)}
                          className="ml-1.5 flex-shrink-0 hover:opacity-70"
                        >
                          <img src={replyCloseIcon} alt="Close" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Normal Message Input for Mobile */}
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
                            handleSendMessage(messageText);
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
                      onClick={handleSendButtonClick}
                      className="p-1.5 text-blue-600 hover:text-blue-800"
                    >
                      {messageText.trim() || selectedFiles.length > 0 ? (
                        <img src={bluIcon} alt="send" className="w-6 h-6" />
                      ) : (
                        <img src={audioIcon} alt="audio" className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </>
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
          className={`${showMobileConversation && productData ? 'hidden md:flex' : 'flex'} w-full md:w-1/4 bg-white md:border-r-2 border-gray-300 flex-col h-screen top-0 relative`}
        >
          {/* Header */}
          <header className="bg-white">
            <div className="w-full pl-6 pr-4 sm:pl-6 sm:pr-6 lg:pl-6 lg:pr-8">
              <div className="flex items-center justify-between h-16">
                {/* Desktop - Logo and sidebar button */}
                <div className="hidden md:flex items-center space-x-36 pr-0">
                  <Link to="/">
                    <img
                      src={logo}
                      alt="bao'Afrik"
                      className="h-8 w-auto"
                    /></Link>
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
            {conversations.length > 0 ? (
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
                          className={`text-sm font-medium pb-1 relative ${selectedTab === 'All'
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
                          className={`text-sm font-medium pb-1 relative flex items-center space-x-1 ${selectedTab === 'Unreads'
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
                            {conversations.filter((c: any) => c.unreadCount > 0).length}
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

                {/* Chat Entries */}
                <div className="flex-1 overflow-y-auto p-1">
                  {conversations
                    .filter((conv: any) => {
                      // Exclude archived conversations
                      if (conv.isArchived) return false;
                      if (selectedTab === 'Unreads') {
                        return conv.unreadCount > 0;
                      }
                      if (!chatSearchQuery) return true;
                      const name = `${conv.otherParticipant?.firstName || ''} ${conv.otherParticipant?.lastName || ''}`.trim();
                      const lastMsg = conv.lastMessage?.content || '';
                      return name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                        lastMsg.toLowerCase().includes(chatSearchQuery.toLowerCase());
                    })
                    .map((conv: any) => {
                      const otherParticipant = conv.otherParticipant;
                      const participantName = `${otherParticipant?.firstName || ''} ${otherParticipant?.lastName || ''}`.trim() || 'Unknown User';
                      const participantAvatar = otherParticipant?.profileImage || eboAvatar;
                      const lastMessage = conv.lastMessage;
                      const isIncoming = lastMessage && lastMessage.senderId !== user?.id;
                      const lastMessageText = formatLastMessageText(lastMessage, isIncoming);
                      const lastMessageTime = lastMessage?.createdAt
                        ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : (conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
                      const unreadCount = conv.unreadCount || 0;
                      const isActive = conversationId === conv.id;

                      return (
                        <div
                          key={conv.id}
                          className={`p-2 rounded-lg cursor-pointer transition-colors md:hover:bg-gray-50 mb-1`}
                          style={{
                            backgroundColor: window.innerWidth >= 768
                              ? (actionsMenuOpen === conv.id
                                ? '#FFFFFF'
                                : isActive
                                  ? '#F5F5F5'
                                  : '#FFFFFF')
                              : '#FFFFFF',
                            boxShadow: actionsMenuOpen === conv.id
                              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                              : 'none',
                            zIndex: actionsMenuOpen === conv.id ? 45 : 'auto',
                            position: actionsMenuOpen === conv.id ? 'relative' : 'static'
                          }}
                          onClick={async () => {
                            setActiveChatId(conv.id);
                            setConversationId(conv.id);
                            setParticipantId(otherParticipant?.id || null);
                            setCurrentConversation(conv);
                            // Load messages for this conversation
                            await loadMessages(conv.id, 1, true);
                            // Refresh conversations to update unread counts
                            try {
                              const token = localStorage.getItem("accessToken");
                              const res = await axios.get(
                                `${API_BASE}/chat/conversations`,
                                { params: { page: 1, limit: 20 }, headers: { Authorization: `Bearer ${token}` } }
                              );
                              const convos = res.data?.data || [];
                              setConversations(convos);
                              // Update current conversation if it's still active
                              const updated = convos.find((c: any) => c.id === conv.id);
                              if (updated) {
                                setCurrentConversation(updated);
                              }
                            } catch (err) {
                              console.warn('Failed to refresh conversations', err);
                            }
                            // Mobile: Open conversation view
                            if (window.innerWidth < 768) {
                              setShowMobileConversation(true);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <img
                                src={participantAvatar}
                                alt={participantName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white px-1" style={{ backgroundColor: '#64B5F6' }}>
                                  {unreadCount > 9 ? '9+' : String(unreadCount)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 flex-1 min-w-0">
                                  {conv.isPinned && (
                                    <img src={pinBadgeIcon} alt="Pinned" className="w-3 h-3 flex-shrink-0" />
                                  )}
                                  {conv.label && (
                                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}>
                                      {conv.label}
                                    </span>
                                  )}
                                  <h3 className="text-sm md:text-base font-medium md:font-semibold text-gray-900 truncate">{participantName}</h3>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">{lastMessageTime}</span>
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
                                <p className="text-xs md:text-sm truncate">
                                  {lastMessageText ? (
                                    <>
                                      {isIncoming ? null : (
                                        <span
                                          className="px-1 py-0.5 rounded text-xs font-medium mr-1"
                                          style={{
                                            backgroundColor: '#E3F2FD',
                                            color: '#64B5F6'
                                          }}
                                        >
                                          You
                                        </span>
                                      )}
                                      <span style={{ color: '#4D4D4D' }}>{lastMessageText}</span>
                                    </>
                                  ) : (
                                    <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No messages yet</span>
                                  )}
                                </p>
                                <div className="flex items-center ml-2">
                                  {isIncoming && unreadCount > 0 ? (
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#64B5F6' }}></div>
                                  ) : lastMessage && !isIncoming ? (
                                    lastMessage.id ? renderSidebarStatus(lastMessage.id) : (
                                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          {conversations.length > 0 && (
            <div className="hidden md:block mt-auto bg-white px-4 py-3">
              <div className="border-t border-gray-300 mx-1 mb-3"></div>
              {/* Archived */}
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={archiveIcon} alt="Archived" className="w-5 h-5" style={{ color: '#6A6A6A' }} />
                  <span className="text-sm" style={{ color: '#6A6A6A' }}>Archived</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}>{archivedCount}</span>
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
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}>{archivedCount}</span>
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

          {/* Label Modal */}
          {showLabelModal && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-20 z-50"
                onClick={() => {
                  setShowLabelModal(false);
                  setLabelInput('');
                  setLabelConversationId(null);
                }}
              ></div>

              {/* Modal */}
              <div
                className="fixed bg-white p-4 shadow-lg rounded-lg z-50"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  minWidth: '300px',
                  maxWidth: '90%'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold" style={{ color: '#212121' }}>Add Label</h3>
                  <button
                    onClick={() => {
                      setShowLabelModal(false);
                      setLabelInput('');
                      setLabelConversationId(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  placeholder="Enter label name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveLabel();
                    }
                  }}
                  autoFocus
                />

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowLabelModal(false);
                      setLabelInput('');
                      setLabelConversationId(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLabel}
                    className="px-4 py-2 text-sm text-white rounded-lg"
                    style={{ backgroundColor: '#64B5F6' }}
                  >
                    Save
                  </button>
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
                  {/* <div className="relative language-selector">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <span>{selectedLanguage}</span>
                      <img src={translationToggleIcon} alt="Toggle" className="w-4 h-4" />
                    </button>

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
                  </div> */}

                  {/* Become Seller Button */}
                  {/* <Link
                              to="/register"
                              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                              style={{ backgroundColor: '#FEF6E9' }}
                            >
                              <img
                                src={basketIcon}
                                alt="Basket"
                                className="w-5 h-5"
                                style={{ filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)' }}
                              />
                              <span className="text-sm font-normal" style={{ color: '#F9A825' }}>Start Selling</span>
                            </Link> */}

                  {/* Notification Icon */}
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200 relative"
                    title="Notifications"
                    aria-label="View notifications"
                  >
                    <img
                      src={notificationIcon}
                      alt="Notifications"
                      className="w-5 h-5"
                      style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)' }}
                    />
                  </button>
                  {isNotificationOpen && (
                    <div
                      className="fixed right-8 top-20 w-96 bg-white shadow-lg border border-gray-200 z-50 notification-dropdown"
                      style={{
                        borderRadius: '20px',
                        maxHeight: '600px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Header */}
                      <div className="px-6 pt-5 pb-3">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold" style={{ color: '#212121' }}>Notifications</h3>
                          <button
                            onClick={() => setIsNotificationOpen(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center space-x-6 border-b border-gray-200 relative">
                          <button
                            onClick={() => setNotificationTab('all')}
                            className="pb-2 font-normal transition-colors relative"
                            style={{
                              color: notificationTab === 'all' ? '#64B5F6' : '#BABABA',
                              fontSize: '12px'
                            }}
                          >
                            All
                            {notificationTab === 'all' && (
                              <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                            )}
                          </button>
                          <button
                            onClick={() => setNotificationTab('unread')}
                            className="pb-2 font-normal transition-colors relative"
                            style={{
                              color: notificationTab === 'unread' ? '#64B5F6' : '#BABABA',
                              fontSize: '12px'
                            }}
                          >
                            Unreads
                            {notificationTab === 'unread' && (
                              <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                            )}
                          </button>
                          <button
                            onClick={() => setNotificationTab('messages')}
                            className="pb-2 font-normal transition-colors relative"
                            style={{
                              color: notificationTab === 'messages' ? '#64B5F6' : '#BABABA',
                              fontSize: '12px'
                            }}
                          >
                            Messages
                            {notificationTab === 'messages' && (
                              <div className="absolute bottom-0 h-0.5" style={{ backgroundColor: '#64B5F6', left: '-4px', right: '-4px' }} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Notification List */}
                      <div
                        className="flex-1"
                        style={{
                          overflowY: 'auto',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                        }}
                      >
                        <style>
                          {`
                                      .notification-dropdown::-webkit-scrollbar {
                                        display: none;
                                      }
                                    `}
                        </style>
                        {/* Render notifications grouped by day */}
                        {['Today', 'Yesterday'].map(day => {
                          const dayNotifs = filteredNotifications.filter(n => n.day === day);
                          if (dayNotifs.length === 0) return null;

                          return (
                            <div key={day} className={day === 'Today' ? 'pt-3 pb-1' : 'pt-2 pb-2'}>
                              <p className="text-xs font-medium mb-2 px-6" style={{ color: '#B0B0B0' }}>{day}</p>

                              {dayNotifs.map((notif, idx) => (
                                <div
                                  key={notif.id || idx}
                                  className="transition-colors cursor-pointer"
                                  style={{ backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF' }}
                                  onClick={() => handleNotificationClick(notif)}
                                >
                                  <div className="flex items-start space-x-4 py-3 px-6">
                                    <div className="relative flex-shrink-0">
                                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                                        backgroundColor: (notif.type === 'message' || notif.type === 'NEW_MESSAGE') ? '#E3F2FD' : '#F9A825',
                                        border: '2px solid white'
                                      }}>
                                        {notif.type === 'message' ? (
                                          <img src={getNotificationAvatar(notif)} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                                        ) : (
                                          <img src={logoIcon} alt="Logo" className="w-7 h-7" style={{ filter: 'brightness(0) invert(1)' }} />
                                        )}
                                      </div>
                                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF' }}>
                                        <img src={notif.type === 'message' ? messageAvatarIcon : appNotificationIcon} alt="Icon" className="w-3 h-3" />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <p style={{ fontSize: '14px' }}>
                                            <span className="font-medium" style={{ color: notif.isRead ? '#939393' : '#616161' }}>
                                              {getNotificationSenderName(notif)}
                                            </span>
                                            <span style={{ color: '#939393' }}> {notif.body || notif.text || ''}</span>
                                          </p>
                                        </div>
                                        <div className="flex flex-col items-end ml-4 flex-shrink-0" style={{ gap: notif.isRead ? '4px' : '8px' }}>
                                          <span style={{ color: '#9E9E9E', fontSize: '12px' }}>{notif.time}</span>
                                          {!notif.isRead && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#64B5F6' }} />}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-b border-gray-100" />
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                        <button onClick={markAllAsRead} className="text-xs hover:opacity-70 transition-opacity" style={{ color: '#939393' }}>
                          Mark all as read
                        </button>
                        <button
                          onClick={() => {
                            navigate('/notifications');
                            setIsNotificationOpen(false);
                          }}
                          className="text-xs flex items-center space-x-1 hover:opacity-70 transition-opacity"
                          style={{ color: '#64B5F6' }}
                        >
                          <span>See all notifications</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Profile Picture */}
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user?.profileImage || avatarIcon}
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
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuDropdownOpen && (
                      <div className="fixed right-8 top-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 max-h-screen overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #f3f4f6' }}>
                        {/* Start selling button with exit */}
                        {/* <div className="px-3 pb-3 flex items-center justify-between">
                                    <Link
                                      to="/register"
                                      className="inline-flex items-center px-3 py-1.5 rounded-lg font-normal text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                      style={{ backgroundColor: '#FFF8F0', color: '#F9A822' }}
                                      onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.backgroundColor = '#FFF0E6';
                                      }}
                                      onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.backgroundColor = '#FFF8F0';
                                      }}
                                      onClick={() => setIsMenuDropdownOpen(false)}
                                    >
                                      <svg className="w-3 h-3 mr-1.5 border border-orange-500 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#F9A822' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
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
                                  </div> */}

                        {/* Profile Section */}
                        <div className="flex items-center justify-around">
                          <div className="flex justify-center items-center gap-2">
                            <img
                              src={user?.profileImage || avatarIcon}
                              alt="User avatar"
                              className="w-12 h-12 rounded-full object-cover"
                              width="48"
                              height="48"
                            />
                            <div className="flex-col">
                              <p className="text-xs text-gray-500">My profile</p>
                              <h3 className="text-sm font-bold text-gray-900">
                                {user?.firstName && user?.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user?.firstName
                                    ? user.firstName
                                    : user?.lastName
                                      ? user.lastName
                                      : user?.email
                                        ? user.email.split("@")[0]
                                        : "User"}
                              </h3>
                            </div>
                          </div>
                          <div style={{ position: 'relative', zIndex: 999 }}>
                            <Link to="/profile-setup"
                            >
                              <div className="w-10 h-10 rounded flex items-center justify-center"
                                style={{ backgroundColor: "#E3F2FD" }}>
                                <svg
                                  className="w-5 h-5 pointer-events-none"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ color: "#64B5F6" }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* Create a new listing button */}
                        <div className="px-3 py-3">
                          <Link
                            to="/create-listing"
                            className="block w-full px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center justify-center space-x-1.5">
                              <span>Create a new listing</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
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
                              <img src={messageIcon} alt="Message" className="w-4 h-4" style={{ color: '#64B5F6' }} />
                              <div>
                                <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Chats</div>
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
                              <img src={boxIcon} alt="Box" className="w-4 h-4" style={{ color: '#64B5F6' }} />
                              <div>
                                <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>My listings</div>
                              </div>
                            </div>
                          </Link>

                          {/* My requests */}
                          <Link
                            to="/requests"
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={groupIcon} alt="Group" className="w-4 h-4" style={{ color: '#64B5F6' }} />
                              <div>
                                <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>My requests</div>
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
                              <img src={frameIcon} alt="Frame" className="w-4 h-4" style={{ color: '#64B5F6' }} />
                              <div>
                                <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Bookmarks</div>
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
                              <img src={podsIcon} alt="Pods" className="w-4 h-4" style={{ color: '#64B5F6' }} />
                              <div>
                                <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Help Center</div>
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
                              <img src={settingIcon} alt="Setting" className="w-4 h-4" style={{ color: '#64B5F6' }} />
                              <div>
                                <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Settings</div>
                              </div>
                            </div>
                          </Link>

                          {/* Log Out */}
                          <div className="px-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setIsMenuDropdownOpen(false);
                                logout();
                              }}
                              className="w-full bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6A6A6A' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <div className="text-left">
                                  <div className="font-medium text-xs" style={{ color: '#6A6A6A' }}>Log Out</div>
                                  <div className="text-xs" style={{ color: '#6A6A6A' }}>Log out of BAO Afrik</div>
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
            {(productData || conversationId) ? (
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
                            src={currentConversation?.otherParticipant?.profileImage || productData?.seller?.profileImage || eboAvatar}
                            alt={currentConversation?.otherParticipant ? `${currentConversation.otherParticipant.firstName} ${currentConversation.otherParticipant.lastName}` : (productData?.seller?.name || 'User')}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                          />

                          {/* Name and Rating */}
                          <div className="flex items-center justify-center space-x-2 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {currentConversation?.otherParticipant
                                ? `${currentConversation.otherParticipant.firstName || ''} ${currentConversation.otherParticipant.lastName || ''}`.trim() || 'User'
                                : (productData?.seller?.name || 'User')}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                              <span style={{ color: "#64B5F6" }}>
                                user-randomlink.com
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <img
                                src={locIcon}
                                alt="Location"
                                className="w-4 h-4"
                              />
                              <span style={{ color: "#64B5F6" }}>
                                {currentConversation?.otherParticipant?.location || 'London | United Kingdom'}
                              </span>
                            </div>
                          </div>

                          {/* Join Date */}
                          <div className="flex items-center justify-center space-x-2 text-sm mb-4">
                            <img
                              src={profileIcon}
                              alt="Profile"
                              className="w-4 h-4"
                            />
                            <span style={{ color: "#BABABA" }}>
                              Joined BAO' Afrik in {currentConversation?.otherParticipant?.createdAt
                                ? new Date(currentConversation.otherParticipant.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                : 'June 2018'}
                            </span>
                          </div>

                          {/* Description */}
                          <div className="text-left">
                            <p
                              className="text-sm leading-relaxed mb-4 text-justify"
                              style={{ color: "#BABABA", justifyContent: "center" }}
                            >
                              {currentConversation?.otherParticipant?.bio || 'Passionate about discovering unique products and always on the lookout for great deals. I enjoy exploring new brands, trying out innovative items, and supporting businesses that deliver quality and creativity.'}
                            </p>
                          </div>

                          {/* See User Profile Button */}
                          <button
                            className="px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                              backgroundColor: "#F0F8FE",
                              color: "#64B5F6",
                            }}
                            onClick={() => {
                              const participant = currentConversation?.otherParticipant;
                              if (participant) {
                                const sellerSlug = `${participant.firstName} ${participant.lastName}`
                                  .toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, '-')
                                  .replace(/[^a-z0-9-]/g, '');

                                // Store seller data in sessionStorage for SellerProfile.tsx
                                sessionStorage.setItem(`seller_${sellerSlug}_data`, JSON.stringify(participant));
                                sessionStorage.setItem(`seller_${sellerSlug}_id`, participant.id);

                                navigate(`/seller/${sellerSlug}`);
                              }
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
                          src={currentConversation?.otherParticipant?.profileImage || productData?.seller?.profileImage || eboAvatar}
                          alt={currentConversation?.otherParticipant ? `${currentConversation.otherParticipant.firstName} ${currentConversation.otherParticipant.lastName}` : (productData?.seller?.name || 'User')}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {/* Name and Rating */}
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {currentConversation?.otherParticipant
                              ? `${currentConversation.otherParticipant.firstName || ''} ${currentConversation.otherParticipant.lastName || ''}`.trim() || 'User'
                              : (productData?.seller?.name || 'User')}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                        // Use id if available, otherwise use tempId, fallback to index for uniqueness
                        const messageKey = message.id || message.tempId || `msg-${index}-${message.timestamp || Date.now()}`;
                        return (
                          <div
                            key={messageKey}
                            ref={(el) => {
                              if (el && message.id) {
                                messageRefs.current.set(message.id, el);
                              }
                            }}
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
                                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                          </svg>
                                        </button>
                                      </div>

                                      <div className="space-y-0.5">
                                        <button
                                          onClick={() => mobileMessageOptionsId !== undefined && handleMessageOptionSelect('reply', message.id)}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={replyIcon} alt="Reply" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>Reply the message</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={starIcon} alt="Star" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>Mark as important</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={copyIcon} alt="Copy" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>Copy the message</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={tickIcon} alt="Select" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>Select the message</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={pinMenuIcon} alt="Pin" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>
                                            {messages.find(m => m.id === activeMessageOptionsId)?.isPinned ? 'Unpin the message' : 'Pin the message'}
                                          </span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
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
                                  {message.images.map((image: any, imgIndex: number) => {
                                    // Handle both File objects and URL objects from backend
                                    let imageUrl: string;
                                    if (image instanceof File || image instanceof Blob) {
                                      imageUrl = URL.createObjectURL(image);
                                    } else if (typeof image === 'string') {
                                      imageUrl = image;
                                    } else {
                                      imageUrl = image.fileUrl || image.url || '';
                                    }
                                    const imageName = image.name || image.fileName || `image-${imgIndex}`;
                                    return (
                                      <a
                                        key={imgIndex}
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={imageName}
                                        className="cursor-pointer hover:opacity-90 transition-opacity"
                                      >
                                        <img
                                          src={imageUrl}
                                          alt={imageName}
                                          className="object-cover"
                                          style={{
                                            borderRadius: '12px',
                                            maxWidth: '300px',
                                            maxHeight: '300px'
                                          }}
                                        />
                                      </a>
                                    );
                                  })}
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
                                              backgroundColor: message.isIncoming ? '#64B5F6' : '#FFFFFF',
                                              flexShrink: 0,
                                              alignSelf: 'stretch'
                                            }}
                                          ></div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium mb-0.5" style={{ color: message.isIncoming ? '#64B5F6' : 'rgba(255, 255, 255, 0.9)' }}>
                                              {getReplySenderLabel(message.replyTo.sender, message.isIncoming)}
                                            </p>
                                            <p className="text-xs" style={{ color: message.isIncoming ? '#6A6A6A' : 'rgba(255, 255, 255, 0.6)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.3' }}>
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
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }} />
                                              </svg>
                                            ) : (
                                              // Play icon
                                              <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                                <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }} />
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
                                            [4, 6, 4, 8, 12, 14, 16, 14, 12, 8, 6, 4, 8, 10, 12, 10, 8, 6, 4, 6].map((h, i) => {
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
                                          {/* Replied Message Text Above */}
                                          <div
                                            className="cursor-pointer hover:opacity-80 transition-opacity mb-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (message.replyTo?.id) {
                                                scrollToMessage(message.replyTo.id);
                                              }
                                            }}
                                          >
                                            {message.replyTo.type === 'voice' ? (
                                              /* Voice Note Reply - Screenshot Structure - TWO LINES */
                                              <div className="flex items-start">
                                                {/* White vertical line on LEFT - spans both sender label and audio preview */}
                                                <div
                                                  className="rounded-full mr-2"
                                                  style={{
                                                    width: '2px',
                                                    backgroundColor: message.isIncoming ? '#64B5F6' : '#FFFFFF',
                                                    flexShrink: 0,
                                                    alignSelf: 'stretch'
                                                  }}
                                                ></div>

                                                <div className="flex-1">
                                                  {/* Sender label */}
                                                  <div className="text-xs font-medium mb-1" style={{ color: '#CFE8FC' }}>
                                                    {getReplySenderLabel(message.replyTo.sender, message.isIncoming)}
                                                  </div>
                                                  {/* Audio preview */}
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
                                                        [3, 4, 3, 5, 8, 10, 12, 10, 8, 5, 4, 3, 6, 8, 9, 8, 6, 5, 3, 5].map((h, i) => {
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
                                              /* Text Reply - Show replied message text */
                                              <div className="flex items-stretch">
                                                {/* Vertical line - spans both sender label and message text */}
                                                <div
                                                  className="rounded-full mr-2"
                                                  style={{
                                                    width: '2px',
                                                    backgroundColor: message.isIncoming ? '#64B5F6' : '#FFFFFF',
                                                    flexShrink: 0,
                                                    alignSelf: 'stretch'
                                                  }}
                                                ></div>

                                                {/* Quoted message info */}
                                                <div className="flex-1">
                                                  <p className="text-xs font-medium mb-0.5" style={{ color: message.isIncoming ? '#64B5F6' : 'rgba(255, 255, 255, 0.9)' }}>
                                                    {getReplySenderLabel(message.replyTo.sender, message.isIncoming)}
                                                  </p>
                                                  <p className="text-xs" style={{ color: message.isIncoming ? '#6A6A6A' : 'rgba(255, 255, 255, 0.6)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.3' }}>
                                                    {message.replyTo.text}
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                          {/* Reply Text Below */}
                                          {message.text && (
                                            <p
                                              className="text-sm mb-3"
                                              style={{ color: message.isIncoming ? '#6A6A6A' : '#FFFFFF' }}
                                            >
                                              {message.text}
                                            </p>
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
                                                Premium White Pepper sourced from the fertile soils of Africa.<br />
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
                                          {message.documents.map((doc: any, docIndex: number) => {
                                            // Handle both File objects and URL objects from backend
                                            const fileName = (doc.name || doc.fileName || 'file').split('.');
                                            const extension = fileName.pop() || '';
                                            const nameWithoutExt = fileName.join('.');
                                            const fileSize = doc.size || doc.fileSize || 0;
                                            const fileSizeMB = fileSize / (1024 * 1024);
                                            const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
                                            const extensionLower = extension.toLowerCase();
                                            const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                                            // Handle both File objects and URL objects from backend
                                            let fileUrl: string | undefined = undefined;
                                            if (doc instanceof File || doc instanceof Blob) {
                                              fileUrl = URL.createObjectURL(doc);
                                            } else if (typeof doc === 'string') {
                                              fileUrl = doc;
                                            } else {
                                              fileUrl = doc.fileUrl || doc.url || undefined;
                                            }
                                            // Skip rendering if no valid URL
                                            if (!fileUrl) return null;
                                            return (
                                              <a
                                                key={docIndex}
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download={doc.name || doc.fileName || `file-${docIndex}`}
                                                className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
                                                style={{ fontFamily: 'Poppins, sans-serif' }}
                                              >
                                                <DocumentIcon size={40} />
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm truncate" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                                                    {nameWithoutExt} · {extension}
                                                  </p>
                                                  <p className="text-xs" style={{ color: '#B8DDFB' }}>
                                                    {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                                                  </p>
                                                </div>
                                              </a>
                                            );
                                          })}
                                        </div>
                                      )}

                                      {/* Files from backend (files array with URLs) - documents */}
                                      {message.files && message.files.length > 0 && !message.documents?.length && (
                                        <div className={message.text || message.replyTo ? 'mt-3' : ''}>
                                          {message.files
                                            .filter((file: any) => !file.fileType?.startsWith('image/') && !file.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                                            .map((file: any, docIndex: number) => {
                                              const fileName = (file.fileName || 'file').split('.');
                                              const extension = fileName.pop() || '';
                                              const nameWithoutExt = fileName.join('.');
                                              const fileSizeMB = (file.fileSize || 0) / (1024 * 1024);
                                              const estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
                                              const extensionLower = extension.toLowerCase();
                                              const DocumentIcon = extensionLower === 'pdf' ? PDFIcon : extensionLower === 'jpg' || extensionLower === 'jpeg' ? JPGIcon : extensionLower === 'png' ? PNGIcon : PDFIcon;
                                              return (
                                                <a
                                                  key={docIndex}
                                                  href={file.fileUrl || file.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  download={file.fileName || `file-${docIndex}`}
                                                  className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
                                                  style={{ fontFamily: 'Poppins, sans-serif' }}
                                                >
                                                  <DocumentIcon size={40} />
                                                  <div className="flex-1 min-w-0">
                                                    <p className="text-sm truncate" style={{ color: '#FFFFFF', fontWeight: '400' }}>
                                                      {nameWithoutExt} · {extension}
                                                    </p>
                                                    <p className="text-xs" style={{ color: '#B8DDFB' }}>
                                                      {estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'} - {fileSizeMB >= 1 ? fileSizeMB.toFixed(1) : fileSizeMB.toFixed(2)} MB
                                                    </p>
                                                  </div>
                                                </a>
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
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                                  {message.timeString || message.formattedTime || message.timestamp || new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {!message.isIncoming && message.id && renderMessageStatus(String(message.id))}

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
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={starIcon} alt="Star" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>Mark as important</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={copyIcon} alt="Copy" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>Copy the message</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={tickIcon} alt="Select" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>Select the message</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
                                          className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                          <img src={pinMenuIcon} alt="Pin" className="w-4 h-4 mr-2" />
                                          <span className="text-xs" style={{ color: '#6B7280' }}>
                                            {messages.find(m => m.id === activeMessageOptionsId)?.isPinned ? 'Unpin the message' : 'Pin the message'}
                                          </span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (activeMessageOptionsId != null) {
                                              handleMessageOptionSelect('important', { id: activeMessageOptionsId });
                                            }
                                          }}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                                Premium White Pepper sourced from the fertile soils of Africa.<br />
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
                                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" style={{ fillRule: 'evenodd' }} />
                                </svg>
                              ) : (
                                // Play icon
                                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
                                  <path d="M8 5v14l11-7z" style={{ fillRule: 'evenodd' }} />
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
                                [6, 8, 4, 6, 12, 16, 14, 18, 20, 16, 12, 8, 6, 10, 14, 12, 8, 6, 4, 8].map((h, i) => (
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
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

                      {/* Product Card Preview */}
                      {productData && (
                        <div className="mb-2 px-3 py-2 rounded-lg relative" style={{ backgroundColor: '#F0F8FE', border: '1px solid #64B5F6' }}>
                          <button
                            onClick={() => setProductData(null)}
                            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center hover:opacity-70 z-10"
                          >
                            <img src={replyCloseIcon} alt="Close" className="w-4 h-4" />
                          </button>
                          <div className="flex space-x-2 pr-6">
                            <div className="relative flex-shrink-0">
                              <img
                                src={productData.image || productData.images?.[0] || ''}
                                alt={productData.name || productData.title}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div style={{ fontSize: '10px', fontWeight: 600, color: '#64B5F6' }}>
                                  {productData.currency || 'USD'} {productData.price}
                                </div>
                                {productData.location && (
                                  <div className="flex items-center space-x-0.5" style={{ fontSize: '8px', color: '#64B5F6' }}>
                                    <img src={locIcon} alt="Location" className="w-2 h-2" />
                                    <span>{productData.location}</span>
                                  </div>
                                )}
                              </div>
                              <h4 className="text-xs font-medium truncate" style={{ color: '#64B5F6', marginBottom: '2px' }}>
                                {productData.name || productData.title}
                              </h4>
                              {productData.category && (
                                <p style={{ fontSize: '8px', color: '#64B5F6' }}>
                                  Category: {productData.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reply Preview */}
                      {replyToMessage && (
                        <div className="mb-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#F0F8FE', border: '1px solid #64B5F6' }}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-stretch">
                                <div
                                  className="rounded-full mr-2"
                                  style={{
                                    width: '2px',
                                    backgroundColor: '#64B5F6',
                                    flexShrink: 0,
                                    alignSelf: 'stretch'
                                  }}
                                ></div>
                                <div className="flex-1">
                                  <p className="text-xs font-medium mb-0.5" style={{ color: '#64B5F6' }}>
                                    {getReplySenderLabel(replyToMessage.sender, replyToMessage.isIncoming)}
                                  </p>
                                  <p className="text-xs truncate" style={{ color: '#6A6A6A' }}>
                                    {replyToMessage.text || replyToMessage.content || (replyToMessage.type === 'voice' ? 'Voice message' : '')}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setReplyToMessage(null)}
                              className="ml-2 flex-shrink-0 hover:opacity-70"
                            >
                              <img src={replyCloseIcon} alt="Close" className="w-4 h-4" />
                            </button>
                          </div>
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
                                handleSendMessage(messageText);
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
                          onClick={handleSendButtonClick}
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
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
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
      <ToastContainer position="bottom-right" autoClose={4000} />
    </>
  );
};

export default Messages;