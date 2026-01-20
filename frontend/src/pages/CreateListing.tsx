import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';

import logo from '../assets/images/pre/logo.png';
import shippxIcon from '../assets/images/pre/shippx.svg';
import locIcon from '../assets/images/pre/Loc.svg';
import imageIcon from '../assets/images/pre/image.svg';
import trashIcon from '../assets/images/pre/trash.svg';
import draftsIcon from '../assets/images/pre/drafts.svg';
import draft2Icon from '../assets/images/pre/draft2.svg';
import flyIcon from '../assets/images/pre/fly.svg';
// import basketIcon from '../assets/images/pre/basket.png';
import avatarIcon from '../assets/images/pre/avatar.png';
import notificationIcon from '../assets/images/pre/notification.svg';
// import translationToggleIcon from '../assets/images/pre/tt.svg';
import arrowLeftIcon from '../assets/images/pre/arrow-left.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';
import lilLogo from '../assets/images/pre/lil.png';
import searchNormalIcon from '../assets/images/pre/search-normal.svg';
import messageIcon from '../assets/images/pre/message.svg';
import boxIcon from '../assets/images/pre/box.svg';
import groupIcon from '../assets/images/pre/group.svg';
import frameIcon from '../assets/images/pre/frame.svg';
import podsIcon from '../assets/images/pre/pods.svg';
import settingIcon from '../assets/images/pre/setting.svg';

import loadIcon from '../assets/images/pre/load.svg';
import a1 from '../assets/images/pre/a1.png';

import verityIcon from '../assets/images/pre/verity.svg';
import redtrashIcon from '../assets/images/pre/redtrash.svg';
import avatar from "../assets/images/logos/avatar.png";
import logoIcon from "../assets/images/logos/ba-brand-icon-colored.png";
import messageAvatarIcon from '../assets/images/pre/main.png';
import appNotificationIcon from '../assets/images/pre/nof.svg';
import listingtoastIcon from '../assets/images/pre/listingtoast.svg';

import { Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from '../contexts/ToastContext';
import { useNotificationToast } from '../contexts/NotificationToastContext';

interface DraftListing {
  id: string;
  title: string;
  price: string;
  currency: string;
  image: string;
  description: string;
  country: string;
  flag: string;
}

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [location, setLocation] = useState('London, United Kingdom');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [showMobileDrafts, setShowMobileDrafts] = useState(false);
  const [draftListings, setDraftListings] = useState<DraftListing[]>([]);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isOriginDropdownOpen, setIsOriginDropdownOpen] = useState(false);
  const [isSaleTypeDropdownOpen, setIsSaleTypeDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedImagesTotal, setDraggedImagesTotal] = useState(0);
  const [currentDraggedImageIndex, setCurrentDraggedImageIndex] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showNotification, setShowNotification] = useState(false);
  const [createdProductData, setCreatedProductData] = useState<{
    id: string;
    title: string;
    price: string;
    currency: string;
    image: string;
    status: 'inactive' | 'active';
    rating: number;
    reviews: number;
    createdAt: number;
    priceValue: number;
    messages: number;
    category: string;
    reviewStatus: 'pending' | 'success';
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPostingListing, setIsPostingListing] = useState(false);
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [productData, setProductData] = useState<any>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const { addToast } = useToast();
  const { showNotification: showNotificationToast } = useNotificationToast();
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<DraftListing | null>(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement | null>(null);

  const ukCities: Array<{ value: string; label: string }> = [
    { value: 'london', label: 'London, United Kingdom' },
    { value: 'birmingham', label: 'Birmingham, United Kingdom' },
    { value: 'manchester', label: 'Manchester, United Kingdom' },
    { value: 'glasgow', label: 'Glasgow, United Kingdom' },
    { value: 'liverpool', label: 'Liverpool, United Kingdom' },
    { value: 'leeds', label: 'Leeds, United Kingdom' },
    { value: 'newcastle', label: 'Newcastle, United Kingdom' },
    { value: 'sheffield', label: 'Sheffield, United Kingdom' },
    { value: 'bristol', label: 'Bristol, United Kingdom' },
    { value: 'belfast', label: 'Belfast, United Kingdom' },
    { value: 'edinburgh', label: 'Edinburgh, United Kingdom' },
    { value: 'cardiff', label: 'Cardiff, United Kingdom' },
    { value: 'leicester', label: 'Leicester, United Kingdom' },
    { value: 'coventry', label: 'Coventry, United Kingdom' },
    { value: 'nottingham', label: 'Nottingham, United Kingdom' },
    { value: 'southampton', label: 'Southampton, United Kingdom' },
    { value: 'plymouth', label: 'Plymouth, United Kingdom' },
    { value: 'derby', label: 'Derby, United Kingdom' },
    { value: 'reading', label: 'Reading, United Kingdom' },
    { value: 'york', label: 'York, United Kingdom' }
  ];

  const clearListingsCache = () => {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('listings-')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore cache clear errors
    }
  };

  // Check if all required fields are filled
  const isFormComplete =
    title.trim() !== '' &&
    description.trim() !== '' &&
    price.trim() !== '' &&
    quantity > 0 &&
    category !== '' &&
    origin !== '' &&
    (isEditMode || imageUrls.length > 0);

  // auto-fill product data for editing
  useEffect(() => {
    if (isEditMode && id) {
      fetchProductData(id);
    }
  }, [isEditMode, id]);

  // fetch unread counts function
  const fetchUnread = React.useCallback(async () => {
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
  }, []);

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

  // fetch unread counts on mount
  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

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
  }, [socket, fetchUnread]);

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

  // persist notification after marking as read
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

  // fetch drafts on mount
  useEffect(() => {
    let mounted = true;

    const fetchDrafts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/products/my-products?status=DRAFT`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return;

        const json = await res.json();
        if (!mounted || !json.success) return;

        // trasform API products to DraftListing format
        const drafts: DraftListing[] = (json.data.products || []).map((product: any) => ({
          id: product.id,
          title: product.title || 'Undefined',
          price: product.price?.toString() || 'N/A',
          currency: product.currency || 'GCP',
          image: product.images?.[0]?.url || a1,
          description: product.description || '',
          country: product.origin || 'Cameroon',
          flag: `https://flagcdn.com/w20/${getCountryFlagCode(product.origin)}.png`
        }));

        setDraftListings(drafts);
      } catch (e) {
        console.warn('Failed to load drafts', e);
      }
    };

    fetchDrafts();
    return () => { mounted = false; };
  }, []);

  const getCountryFlagCode = (countryName?: string): string => {
    if (!countryName) return 'cm';
    const countryMap: Record<string, string> = {
      'cameroon': 'cm',
      'nigeria': 'ng',
      'ghana': 'gh',
      'kenya': 'ke',
      'benin': 'bj',
      'egypt': 'eg',
      'morocco': 'ma',
      'ethiopia': 'et',
      'south africa': 'za',
      'tunisia': 'tn',
      'algeria': 'dz',
    };
    return countryMap[countryName.toLowerCase()] || 'cm';
  };

  const fetchProductData = async (productId: string) => {
    setIsLoadingProduct(true);
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }

      const result = await response.json();

      if (result.success) {
        const product = result.data;
        setProductData(product);

        setTitle(product.title || '');
        setDescription(product.description || '');
        setPrice(product.price?.toString() || '');
        setCurrency(product.currency || 'GCP');
        setQuantity(product.quantity || 1);
        setCategory(product.category || '');
        setOrigin(product.origin || '');
        // setSaleType(product.saleType || 'Default');
        setDeliveryAvailable(product.deliveryAvailable || false);
        setLocation(product.location || 'London,  United Kingdom');

        if (product.images && product.images.length > 0) {
          const existingImageUrls = product.images.map((img: any) => img.url);
          setImageUrls(existingImageUrls);

          const primaryIndex = product.images.findIndex((img: any) => img.isPrimary);
          setPrimaryImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: "Failed to load",
        message: "Unable to retrieve product data. Please check your internet connection.",
        duration: 2000
      });
      navigate('/my-listings');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const categories = [
    { value: 'Beauty & Wellness', label: 'Beauty & Wellness' },
    { value: 'Books & Media', label: 'Books & Media' },
    { value: 'Fashion & Textiles', label: 'Fashion & Textiles' },
    { value: 'Food & Spices', label: 'Food & Spices' },
    { value: 'Home & Decor', label: 'Home & Decor' }
  ];

  const currencies = [
    // { value: 'USD', label: 'US Dollar', flagCode: 'us' },
    // { value: 'CAD', label: 'Canadian Dollar', flagCode: 'ca' },
    { value: 'GBP', label: 'Pound Sterling', flagCode: 'gb' },
    // { value: 'EUR', label: 'Euro', flagCode: 'eu' }
  ];

  const countries = [
    { value: 'algeria', label: 'Algeria', flagCode: 'dz' },
    { value: 'angola', label: 'Angola', flagCode: 'ao' },
    { value: 'benin', label: 'Benin', flagCode: 'bj' },
    { value: 'botswana', label: 'Botswana', flagCode: 'bw' },
    { value: 'burkina faso', label: 'Burkina Faso', flagCode: 'bf' },
    { value: 'burundi', label: 'Burundi', flagCode: 'bi' },
    { value: 'cabo verde', label: 'Cabo Verde', flagCode: 'cv' },
    { value: 'cameroon', label: 'Cameroon', flagCode: 'cm' },
    { value: 'central african republic', label: 'Central African Republic', flagCode: 'cf' },
    { value: 'chad', label: 'Chad', flagCode: 'td' },
    { value: 'comoros', label: 'Comoros', flagCode: 'km' },
    { value: 'congo brazzaville', label: 'Congo (Brazzaville)', flagCode: 'cg' },
    { value: 'congo kinshasa', label: 'Congo (Kinshasa)', flagCode: 'cd' },
    { value: 'cote divoire', label: "Côte d'Ivoire", flagCode: 'ci' },
    { value: 'djibouti', label: 'Djibouti', flagCode: 'dj' },
    { value: 'egypt', label: 'Egypt', flagCode: 'eg' },
    { value: 'equatorial guinea', label: 'Equatorial Guinea', flagCode: 'gq' },
    { value: 'eritrea', label: 'Eritrea', flagCode: 'er' },
    { value: 'eswatini', label: 'Eswatini', flagCode: 'sz' },
    { value: 'ethiopia', label: 'Ethiopia', flagCode: 'et' },
    { value: 'gabon', label: 'Gabon', flagCode: 'ga' },
    { value: 'gambia', label: 'Gambia', flagCode: 'gm' },
    { value: 'ghana', label: 'Ghana', flagCode: 'gh' },
    { value: 'guinea', label: 'Guinea', flagCode: 'gn' },
    { value: 'guinea bissau', label: 'Guinea-Bissau', flagCode: 'gw' },
    { value: 'kenya', label: 'Kenya', flagCode: 'ke' },
    { value: 'lesotho', label: 'Lesotho', flagCode: 'ls' },
    { value: 'liberia', label: 'Liberia', flagCode: 'lr' },
    { value: 'libya', label: 'Libya', flagCode: 'ly' },
    { value: 'madagascar', label: 'Madagascar', flagCode: 'mg' },
    { value: 'malawi', label: 'Malawi', flagCode: 'mw' },
    { value: 'mali', label: 'Mali', flagCode: 'ml' },
    { value: 'mauritania', label: 'Mauritania', flagCode: 'mr' },
    { value: 'mauritius', label: 'Mauritius', flagCode: 'mu' },
    { value: 'morocco', label: 'Morocco', flagCode: 'ma' },
    { value: 'mozambique', label: 'Mozambique', flagCode: 'mz' },
    { value: 'namibia', label: 'Namibia', flagCode: 'na' },
    { value: 'niger', label: 'Niger', flagCode: 'ne' },
    { value: 'nigeria', label: 'Nigeria', flagCode: 'ng' },
    { value: 'rwanda', label: 'Rwanda', flagCode: 'rw' },
    { value: 'sao-tome and principe', label: 'São Tomé and Príncipe', flagCode: 'st' },
    { value: 'senegal', label: 'Senegal', flagCode: 'sn' },
    { value: 'seychelles', label: 'Seychelles', flagCode: 'sc' },
    { value: 'sierra leone', label: 'Sierra Leone', flagCode: 'sl' },
    { value: 'somalia', label: 'Somalia', flagCode: 'so' },
    { value: 'south africa', label: 'South Africa', flagCode: 'za' },
    { value: 'south sudan', label: 'South Sudan', flagCode: 'ss' },
    { value: 'sudan', label: 'Sudan', flagCode: 'sd' },
    { value: 'tanzania', label: 'Tanzania', flagCode: 'tz' },
    { value: 'togo', label: 'Togo', flagCode: 'tg' },
    { value: 'tunisia', label: 'Tunisia', flagCode: 'tn' },
    { value: 'uganda', label: 'Uganda', flagCode: 'ug' },
    { value: 'zambia', label: 'Zambia', flagCode: 'zm' },
    { value: 'zimbabwe', label: 'Zimbabwe', flagCode: 'zw' }
  ];

  const renderDraftCountryBadge = (label: string, flagUrl: string) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E1E1E1',
        padding: '3px 12px',
        borderRadius: '999px',
        fontSize: '11px',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '26px'
      }}
    >
      <img
        src={flagUrl}
        alt={`${label} flag`}
        style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
      />
      <span style={{ color: '#939393', fontWeight: 300 }}>{label}</span>
    </span>
  );

  const buildDraftPrefillPayload = (draft: DraftListing) => {
    const payload: Record<string, string> = {};
    if (draft.title) payload.title = draft.title;
    if (draft.description) payload.description = draft.description;
    if (draft.price && draft.price.toLowerCase() !== 'n/a') {
      payload.price = draft.price;
      if (draft.currency) payload.currency = draft.currency;
    }
    if (draft.country) payload.country = draft.country;
    if (draft.image) payload.image = draft.image;
    return payload;
  };

  const applyPrefillToForm = (prefill: Record<string, any>) => {
    // Set basic fields
    if (prefill.title) setTitle(prefill.title);
    if (prefill.description) setDescription(prefill.description);
    if (prefill.price) setPrice(prefill.price.toString());
    if (prefill.currency) setCurrency(prefill.currency);
    if (prefill.quantity) setQuantity(Number(prefill.quantity) || 1);
    if (prefill.category) setCategory(prefill.category);
    if (prefill.location) setLocation(prefill.location);
    if (typeof prefill.deliveryAvailable === 'boolean') setDeliveryAvailable(prefill.deliveryAvailable);
    
    // Handle country/origin
    if (prefill.country) {
      const originOption = countries.find(
        (country) => country.label.toLowerCase() === prefill.country.toLowerCase()
      );
      if (originOption) setOrigin(originOption.value);
    }
    if (prefill.origin) {
      const originOption = countries.find(
        (country) => country.label.toLowerCase() === prefill.origin.toLowerCase() ||
                     country.value.toLowerCase() === prefill.origin.toLowerCase()
      );
      if (originOption) setOrigin(originOption.value);
    }
    
    // Handle images
    if (prefill.image) {
      setImageUrls([prefill.image]);
      setImages([]);
      setPrimaryImageIndex(0);
    }
    if (prefill.images && Array.isArray(prefill.images) && prefill.images.length > 0) {
      setImageUrls(prefill.images);
      setImages([]);
      setPrimaryImageIndex(0);
    }
    
    // Set editing draft ID if this is an edit/repost
    if (prefill.id) {
      setEditingDraftId(prefill.id);
    }
  };

  const handleDraftApply = (draft: DraftListing) => {
    const prefillData = buildDraftPrefillPayload(draft);
    applyPrefillToForm(prefillData);
    setEditingDraftId(draft.id);
    setIsDraftsModalOpen(false);
  };

  const handleDraftDelete = (draft: DraftListing) => {
    setDraftToDelete(draft);
    setIsDeleteSuccess(false);
  };

  const handleConfirmDelete = async () => {
    if (!draftToDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${draftToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        addToast({ type: 'error', title: 'Delete failed', message: 'Failed to delete draft. Please try again', duration: 2000 });
        return;
      }

      setIsDeleteSuccess(true);
      setDraftListings((prev) => prev.filter((draft) => draft.id !== draftToDelete.id));
      addToast({ type: 'success', title: 'Deleted', message: 'Draft deleted successfully', duration: 2000 });
    } catch (e) {
      console.error('Delete draft error', e);
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete draft', duration: 2000 });
    }
  };

  const handleDeleteClose = () => {
    setDraftToDelete(null);
    setIsDeleteSuccess(false);
  };

  const validateImageFile = (file: File): { valid: boolean; message?: string } => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        message: `Invalid file type: Only JPG/JPEG, PNG, and WebP images are allowed.`
      };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB 
    if (file.size > maxSize) {
      return {
        valid: false,
        message: `File too large: (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is 5MB.`
      };
    }

    return { valid: true };
  };

  const processImageFile = (file: File, index: number, totalFiles: number) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      addToast({
        type: 'error',
        title: 'Invalid file',
        message: validation.message || 'Invalid file',
        duration: 3000
      });
      return;
    }

    setIsImageLoading(true);
    setUploadProgress(0);
    setCurrentDraggedImageIndex(index + 1);
    setDraggedImagesTotal(totalFiles);

    // Simulate progress updates with realistic timing
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random increment between 5-20
      if (progress > 100) progress = 100;
      setUploadProgress(Math.floor(progress));

      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 200); // Update every 200ms

    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        setImages(prev => [...prev, file]);
        setImageUrls(prev => {
          const newUrls = [...prev, event.target?.result as string];
          // Set the newly uploaded image as primary if it's the first one
          if (prev.length === 0) {
            setPrimaryImageIndex(0);
          }
          return newUrls;
        });

        // Reset counters when all images are done
        if (index === totalFiles - 1) {
          setIsImageLoading(false);
          setUploadProgress(0);
          setDraggedImagesTotal(0);
          setCurrentDraggedImageIndex(0);
        }
      }, 1000);
    };

    reader.onerror = () => {
      addToast({
        type: 'error',
        title: 'Error reading file',
        message: `Could not read file: ${file.name}`,
        duration: 3000
      });
      clearInterval(progressInterval);
      setIsImageLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Check total number of images won't exceed 10
    if (images.length + files.length > 10) {
      addToast({
        type: 'error',
        title: 'Upload limit',
        message: 'You can only upload up to 10 images in total',
        duration: 3000
      });
      return;
    }

    // Process each file
    files.forEach((file, index) => {
      processImageFile(file, index, files.length);
    });

    // Reset the input value to allow re-uploading the same file
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));

    // Adjust primary image index if necessary
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(prev => prev - 1);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set to false if we're leaving the drop zone entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(e.dataTransfer.files);

    // Check total number of images won't exceed 10
    if (images.length + files.length > 10) {
      addToast({
        type: 'error',
        title: 'Upload limit',
        message: 'You can only upload up to 10 images in total',
        duration: 3000
      });
      return;
    }

    // Process each file
    files.forEach((file, index) => {
      // Only process image files
      if (file.type.startsWith('image/')) {
        processImageFile(file, index, files.length);
      } else {
        addToast({
          type: 'error',
          title: 'Invalid file type',
          message: `Only images (JPG, PNG, and WebP) are supported.`,
          duration: 3000
        });
      }
    });
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

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

  const uploadProductImages = async (productId: string, imageFiles: File[]) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const uploadPromises = imageFiles.map(async (file) => {
        const presignedResponse = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/images/upload-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error('Failed to get upload URL');
        }

        const presignedResult = await presignedResponse.json();

        if (!presignedResult.success || !presignedResult.data?.uploadUrl) {
          throw new Error('Invalid response from upload service');
        }

        const presignedData = presignedResult.data;
        const uploadResponse = await fetch(presignedData.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const addImageResponse = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            images: [{
              url: presignedData.viewUrl,
              key: presignedData.key,
              isPrimary: false,
              order: 0
            }]
          }),
        });

        if (!addImageResponse.ok) {
          throw new Error('Failed to add image to product');
        }

        return addImageResponse.json();
      });

      await Promise.all(uploadPromises);

    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setIsPostingListing(false);

    try {
      const token = localStorage.getItem('accessToken');

      const priceClean = typeof price === 'string' ? price.trim() : String(price);
      const priceNum = priceClean === '' || priceClean.toLowerCase() === 'n/a' ? null : Number(priceClean.replace(/,/g, ''));
      const qty = quantity ? Number(quantity) : 0;

      const payload: any = {
        title: title?.trim() || '',
        description: description?.trim() || '',
        price: priceNum,
        currency,
        quantity: qty,
        category: category || '',
        origin: origin || '',
        location: location || '',
        deliveryAvailable: Boolean(deliveryAvailable),
        status: 'DRAFT'
      };

      // When editing a draft, use editingDraftId; otherwise use URL param id for edit mode
      const draftId = editingDraftId || (isEditMode && id ? id : null);
      const url = draftId ? `${process.env.REACT_APP_API_URL}/products/${draftId}` : `${process.env.REACT_APP_API_URL}/products`;
      const method = draftId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }));

      if (!response.ok) {
        const serverMsg = result.message || 'Failed to save draft';
        const serverErrors = result.errors || result.validation || result.details;
        addToast({
          type: 'error',
          title: 'Failed to save draft',
          message: serverErrors ? `${serverMsg}: ${JSON.stringify(serverErrors)}` : serverMsg,
          duration: 2500
        });
        setIsSavingDraft(false);
        return;
      }

      if (result.success) {
        const productId = editingDraftId || result.data.id || id;
        const savedProduct = result.data;

        // Upload new images if any
        if (images.length > 0 && productId) {
          try {
            await uploadProductImages(productId, images)
          } catch (imgErr) {
            console.warn('Image upload failed but draft was saved', imgErr);
          }
        }

        const newDraft: DraftListing = {
          id: productId,
          title: savedProduct.title || title || 'Untitled',
          price: savedProduct.price?.toString() || price || 'N/A',
          currency: savedProduct.currency || currency,
          image: savedProduct.images?.[0]?.url || (imageUrls.length > 0 ? imageUrls[0] : a1),
          description: savedProduct.description || description,
          country: savedProduct.origin || origin || 'Cameroon',
          flag: `https://flagcdn.com/w20/${getCountryFlagCode(savedProduct.origin || origin)}.png`
        };

        // Refresh drafts list to update count
        const refreshDrafts = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.REACT_APP_API_URL}/products/my-products?status=DRAFT`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const json = await res.json();
              if (json.success && json.data?.products) {
                const drafts: DraftListing[] = (json.data.products || []).map((product: any) => ({
                  id: product.id,
                  title: product.title || 'Undefined',
                  price: product.price?.toString() || 'N/A',
                  currency: product.currency || 'GCP',
                  image: product.images?.[0]?.url || a1,
                  description: product.description || '',
                  country: product.origin || 'Cameroon',
                  flag: `https://flagcdn.com/w20/${getCountryFlagCode(product.origin)}.png`
                }));
                setDraftListings(drafts);
              }
            }
          } catch (e) {
            console.warn('Failed to refresh drafts', e);
          }
        };
        await refreshDrafts();

        // Notify MyListings to refetch drafts
        if (editingDraftId) {
          sessionStorage.setItem('draft-updated', JSON.stringify({
            productId,
            timestamp: Date.now()
          }));
        } else {
          sessionStorage.setItem('draft-created', JSON.stringify({
            productId,
            timestamp: Date.now()
          }));
        }

        if (isEditMode && id && productId) {
          sessionStorage.setItem(`draft-status-change-${productId}`, JSON.stringify({
            productId,
            newStatus: 'DRAFT',
            timestamp: Date.now()
          }));
        }

        addToast({
          type: 'success',
          title: 'Draft Saved',
          message: `${isEditMode ? 'Draft updated' : 'Draft saved'} successfully! The draft count has been updated.`,
          duration: 2000
        });
        navigate('/my-listings');
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: (error && (error.message || String(error))) || `Failed to ${isEditMode ? 'update' : 'save'} draft`,
        duration: 2000
      });
    } finally {
      setIsSavingDraft(false);
      // Ensure MyListings uses fresh data next time
      clearListingsCache();
    }
  };

  const handlePostListing = async () => {
    // if (!validateRequiredFields()) return;
    setIsPostingListing(true);
    setIsSavingDraft(false);

    try {
      const token = localStorage.getItem('accessToken');

      // Coerce types / sanitize fields to match backend validation
      const priceClean = typeof price === 'string' ? price.trim() : String(price);
      const priceNum = priceClean === '' || priceClean.toLowerCase() === 'n/a' ? null : Number(priceClean.replace(/,/g, ''));
      if (priceNum !== null && Number.isNaN(priceNum)) {
        addToast({ type: 'error', title: 'Invalid price', message: 'Please enter a valid numeric price or leave blank for N/A', duration: 2000 });
        setIsPostingListing(false);
        return;
      }
      const qty = Number(quantity) || 0;
      if (!Number.isFinite(qty) || qty < 0) {
        addToast({ type: 'error', title: 'Invalid quantity', message: 'Please enter a valid quantity', duration: 2000 });
        setIsPostingListing(false);
        return;
      }

      // Ensure category is one of allowed values
      const allowedCategories = categories.map(c => c.value);
      if (!category || !allowedCategories.includes(category)) {
        addToast({ type: 'error', title: 'Invalid category', message: 'Please choose a valid category', duration: 2000 });
        setIsPostingListing(false);
        return;
      }

      // Ensure origin is valid (optional)
      if (origin && !countries.some(c => c.value === origin)) {
        addToast({ type: 'error', title: 'Invalid origin', message: 'Please choose a valid origin country', duration: 2000 });
        setIsPostingListing(false);
        return;
      }

      // Build payload with correct types (omit undefined/null if required)
      const payload: any = {
        title: title?.trim() || '',
        description: description?.trim() || '',
        price: priceNum,
        currency,
        quantity: qty,
        category,
        origin: origin || undefined,
        location: location || undefined,
        // saleType,
        deliveryAvailable: Boolean(deliveryAvailable)
      };

      const productId = editingDraftId || id;
      const url = productId ? `${process.env.REACT_APP_API_URL}/products/${productId}` : `${process.env.REACT_APP_API_URL}/products`;
      const method = productId ? 'PUT' : 'POST';

      const createResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const createResult = await createResponse.json().catch(() => ({ success: false, message: 'Invalid server response' }));

      if (!createResponse.ok) {
        const serverMsg = createResult.message || 'Failed to create product';
        const serverErrors = createResult.errors || createResult.validation || createResult.details;
        addToast({
          type: 'error',
          title: 'Failed to post listing',
          message: serverErrors ? `${serverMsg}: ${JSON.stringify(serverErrors)}` : serverMsg,
          duration: 2000
        });
        setIsPostingListing(false);
        return;
      }

      if (createResult.success) {
        // Use editingDraftId if it exists, otherwise use the response ID or URL param id
        const productId = editingDraftId || createResult.data?.id || id;

        if (!productId) {
          addToast({ type: 'error', title: 'Error', message: 'Product ID not found', duration: 2000 });
          setIsPostingListing(false);
          return;
        }

        // Upload images if present
        if (images.length > 0 && productId) {
          await uploadProductImages(productId, images);
        }

        // Publish the product
        const publishResponse = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'PUBLISHED' })
        });

        const publishResult = await publishResponse.json().catch(() => ({ success: false, message: 'Invalid publish response' }));
        if (!publishResponse.ok) {
          addToast({ type: 'error', title: 'Publish failed', message: publishResult.message || 'Failed to publish product', duration: 2000 });
          setIsPostingListing(false);
          return;
        }

        const actualProductId = productId;
        const productTitle = publishResult.data?.title || title || 'Your listing';

        // Remove draft from list if it was a draft
        if (editingDraftId) {
          setDraftListings(prev => prev.filter(d => d.id !== editingDraftId));
          setEditingDraftId(null);
        }

        // Refresh drafts list to update count
        const refreshDrafts = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.REACT_APP_API_URL}/products/my-products?status=DRAFT`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const json = await res.json();
              if (json.success && json.data?.products) {
                const drafts: DraftListing[] = (json.data.products || []).map((product: any) => ({
                  id: product.id,
                  title: product.title || 'Undefined',
                  price: product.price?.toString() || 'N/A',
                  currency: product.currency || 'GCP',
                  image: product.images?.[0]?.url || a1,
                  description: product.description || '',
                  country: product.origin || 'Cameroon',
                  flag: `https://flagcdn.com/w20/${getCountryFlagCode(product.origin)}.png`
                }));
                setDraftListings(drafts);
              }
            }
          } catch (e) {
            console.warn('Failed to refresh drafts', e);
          }
        };
        refreshDrafts();

        // Ensure MyListings uses fresh data for the newly created/updated product
        clearListingsCache();

        // Get product image for navigation
        const productImage = publishResult.data?.images?.[0]?.url || imageUrls[primaryImageIndex] || imageUrls[0] || '';

        // Store product data for navigation after modal
        // Initially show as 'inactive' while "under review", will update to 'active' after review period
        const productData = {
          id: actualProductId,
          title: productTitle,
          price: publishResult.data?.price?.toString() || price || '0',
          currency: publishResult.data?.currency || currency,
          image: productImage,
          status: 'inactive' as const,
          rating: 0,
          reviews: 0,
          createdAt: Date.now(),
          priceValue: parseFloat(publishResult.data?.price?.toString() || price || '0'),
          messages: 0,
          category: publishResult.data?.category || category || '',
          reviewStatus: 'pending' as const // Initially pending review
        };
        setCreatedProductData(productData);

        // Show success modal instead of navigating immediately
        setShowSuccessModal(true);
        setShowNotification(true); // Show "under review" banner
        setCountdown(10);

        // After 30 seconds, hide "under review" banner and show "available on marketplace" notification
        // Also update the product status to active since it's now reviewed
        const reviewTimeout = setTimeout(() => {
          // Hide the "under review" banner
          setShowNotification(false);
          
          // Update product data to active status (product is now available on marketplace)
          setCreatedProductData(prev => prev ? {
            ...prev,
            status: 'active' as const,
            reviewStatus: 'success' as const
          } : null);
          
          // Show notification that listing is now available
          showNotificationToast({
            type: 'app',
            mainText: `Your listing "${productTitle}" is available on the marketplace!`,
            subText: 'Click to view',
            onClick: () => navigate('/my-listings'),
            duration: 8000
          });
        }, 30000);
        
        // Store timeout ID for cleanup if component unmounts
        (window as any).__reviewTimeout = reviewTimeout;

        setIsPostingListing(false);
      }
    } catch (error: any) {
      console.error('Post listing error', error);
      showNotificationToast({
        type: 'app',
        mainText: 'Action Failed',
        subText: (error && (error.message || String(error))) || 'Failed to post listing. Please try again.',
        duration: 2000
      });
      setIsPostingListing(false);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (showSuccessModal && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccessModal && countdown === 0 && createdProductData) {
      // Clear cache before navigating to ensure fresh data
      clearListingsCache();
      // Navigate to my-listings after posting with refresh flag
      navigate('/my-listings', { state: { forceRefresh: true, newListingId: createdProductData.id } });
      // Reset modal state
      setShowSuccessModal(false);
      setCreatedProductData(null);
    }
  }, [showSuccessModal, countdown, navigate, createdProductData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.location-dropdown-container');
      if (isLocationDropdownOpen && dropdown && !dropdown.contains(target) && !target.closest('button[onclick*="setIsLocationDropdownOpen"]')) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationDropdownOpen]);

  const handleBackToHomepage = () => {
    // Clear cache before navigating to ensure fresh data
    clearListingsCache();
    // Navigate to my-listings after posting with refresh flag
    navigate('/my-listings', { state: { forceRefresh: true, newListingId: createdProductData?.id } });
    // Reset modal state
    setShowSuccessModal(false);
    setCreatedProductData(null);
  };

  const handleAddNewListing = () => {
    // Reset form
    setTitle('');
    setDescription('');
    setPrice('');
    setCurrency('GCP');
    setQuantity(1);
    setCategory('');
    setOrigin('');
    setDeliveryAvailable(false);
    setLocation('London, United Kingdom');
    setImages([]);
    setImageUrls([]);
    setPrimaryImageIndex(0);
    setShowSuccessModal(false);
    setShowNotification(false);
    setCountdown(10);
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest('.language-selector');
      const menuDropdown = target.closest('.menu-dropdown');
      const categoryDropdown = target.closest('.category-dropdown');
      const originDropdown = target.closest('.origin-dropdown');
      const saleTypeDropdown = target.closest('.sale-type-dropdown');
      const currencyDropdown = target.closest('.currency-dropdown');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }

      if (!menuDropdown && isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }

      if (!categoryDropdown && isCategoryDropdownOpen) {
        setIsCategoryDropdownOpen(false);
      }

      if (!originDropdown && isOriginDropdownOpen) {
        setIsOriginDropdownOpen(false);
      }

      if (!saleTypeDropdown && isSaleTypeDropdownOpen) {
        setIsSaleTypeDropdownOpen(false);
      }

      if (!currencyDropdown && isCurrencyDropdownOpen) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isMenuDropdownOpen, isCategoryDropdownOpen, isOriginDropdownOpen, isSaleTypeDropdownOpen, isCurrencyDropdownOpen]);

  // mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // synce drafts from localStorage
  useEffect(() => {
    const stateDraft = (routerLocation.state as { draft?: Record<string, string> } | null)?.draft;

    if (stateDraft) {
      applyPrefillToForm(stateDraft);
      setIsDraftsModalOpen(true);
      navigate(routerLocation.pathname, { replace: true, state: {} });
    }
  }, [routerLocation.state, routerLocation.pathname, navigate]);

  const renderDraftCard = (draft: DraftListing) => (
    <div
      key={draft.id}
      className="flex items-center gap-4"
      style={{
        border: '1px solid #E9E9E9',
        borderRadius: '14px',
        padding: '16px 20px',
        backgroundColor: '#FFFFFF',
        width: '100%'
      }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '12px',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <img src={draft.image} alt={draft.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100px',
          minWidth: 0
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap- 2 min-w-0" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#1E1E1E', fontSize: '15px' }}>
            <span>{draft.title}</span>
            <span style={{ color: '#B0B0B0', flexShrink: 0 }}>·</span>
            <span style={{ color: '#B0B0B0', flexShrink: 0 }}>
              {draft.currency} {draft.price}
            </span>
          </div>
          <div className="flex items-center gap-2 flexShrink: 0">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2 py-1 whitespace-nowrap"
              style={{
                backgroundColor: '#F4F4F4',
                color: '#939393',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'Poppins, sans-serif',
                flexShrink: 0
              }}
              onClick={() => handleDraftApply(draft)}
            >
              <img src={draft2Icon} alt="Edit" className="w-3 h-3" />
              Use
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#FFE9E9',
                flexShrink: 0
              }}
              onClick={() => handleDraftDelete(draft)}
            >
              <img
                src={trashIcon}
                alt="Delete"
                className="w-3.5 h-3.5"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)'
                }}
              />
            </button>
          </div>
        </div>
        <div style={{ alignSelf: 'flex-start', marginTop: '4px', marginBottom: '2px' }}>
          {renderDraftCountryBadge(draft.country, draft.flag)}
        </div>
        <p
          style={{
            color: '#B0B0B0',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 300,
            marginTop: '0',
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word'
          }}
        >
          {draft.description}
        </p>
      </div>
    </div>
  );

  // Mobile Drafts View - Exact copy from MyListings
  if (showMobileDrafts && isMobile) {
    return (
      <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Mobile Drafts Header */}
        <div className="lg:hidden fixed top-4 left-4 right-4 z-50 flex items-center justify-between mb-16">
          <button
            type="button"
            onClick={() => setShowMobileDrafts(false)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
            aria-label="Back"
          >
            <img src={backArrowIcon} alt="Back" className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
              aria-label="Search"
            >
              <img src={searchNormalIcon} alt="Search" className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
              aria-label="More options"
            >
              <svg width="16" height="4" viewBox="0 0 24 4" fill="none">
                <circle cx="4" cy="2" r="2" fill="#171717" />
                <circle cx="12" cy="2" r="2" fill="#171717" />
                <circle cx="20" cy="2" r="2" fill="#171717" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="pt-20 px-4 mb-6">
          <h1
            className="text-lg font-semibold"
            style={{ color: '#171717', fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            Drafts ({draftListings.length})
          </h1>
        </div>

        {/* Drafts List */}
        <div className="px-4 pb-20 space-y-4">
          {draftListings.map((draft) => (
            <div
              key={draft.id}
              className="bg-white flex gap-3"
            >
              {/* Draft Image */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img src={draft.image} alt={draft.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Draft Info - Right of image */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Title and Price */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#1E1E1E', fontSize: '14px', fontWeight: 500 }}>
                    {draft.title}
                  </span>
                  <span style={{ color: '#B0B0B0', fontSize: '14px' }}>·</span>
                  <span style={{ color: '#B0B0B0', fontSize: '12px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                    {draft.currency} {draft.price}
                  </span>
                </div>

                {/* Country tag if exists */}
                {draft.country && (
                  <div className="inline-flex items-center gap-1 py-0.5 rounded-full mb-1" style={{ border: '1px solid #E1E1E1', paddingLeft: '6px', paddingRight: '8px', width: 'fit-content' }}>
                    <img
                      src={draft.flag}
                      alt={draft.country}
                      className="w-3 h-3 rounded-full object-cover"
                    />
                    <span style={{ color: '#939393', fontSize: '10px', fontFamily: 'Poppins, sans-serif' }}>
                      {draft.country}
                    </span>
                  </div>
                )}

                {/* Description - smaller, center-right, 2 lines max */}
                <p
                  style={{
                    color: '#B0B0B0',
                    fontSize: '10px',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '1.4',
                    marginBottom: '6px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {draft.description || '(Empty)'}
                </p>

                {/* Action Buttons - Bottom right */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: '#F4F4F4',
                      color: '#939393',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontFamily: 'Poppins, sans-serif',
                      border: 'none',
                      cursor: 'pointer',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      paddingTop: '4px',
                      paddingBottom: '4px'
                    }}
                    onClick={() => {
                      handleDraftApply(draft);
                      setShowMobileDrafts(false);
                    }}
                  >
                    <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center"
                    style={{
                      backgroundColor: '#FFE9E9',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      paddingTop: '4px',
                      paddingBottom: '4px'
                    }}
                    onClick={() => handleDraftDelete(draft)}
                  >
                    <img src={trashIcon} alt="Delete" className="w-3.5 h-3.5" style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(46%) saturate(3205%) hue-rotate(332deg) brightness(103%) contrast(102%)' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="bg-white mt-auto">
          <div className="px-4 py-5">
            <div className="flex flex-col items-center text-xs space-y-2" style={{ color: '#BABABA' }}>
              <div className="flex items-center space-x-1.5">
                <img src={lilLogo} alt="Bao Afrik" className="w-5 h-5" />
                <span>©</span>
                <span className="text-[11px]">All rights reserved</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] flex-wrap justify-center">
                <Link to="/contact" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Contact Us</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/terms" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Terms and conditions of use</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/privacy" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Privacy policies</Link>
                <span style={{ color: '#BABABA' }}>|</span>
                <Link to="/cookies" className="hover:text-gray-900 whitespace-nowrap" style={{ color: '#BABABA' }}>Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const renderDraftsModal = () => {
    if (!isDraftsModalOpen) return null;

    // Desktop modal view
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center lg:flex"
        style={{ backgroundColor: '#0000001A' }}
        onClick={() => setIsDraftsModalOpen(false)}
      >
        <div
          className="relative w-full max-w-2xl"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '30px',
            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
            padding: '28px'
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                color: '#1E1E1E',
                fontSize: '18px'
              }}
            >
              Drafts ({draftListings.length})
            </h2>
            <button
              aria-label="Close drafts"
              onClick={() => setIsDraftsModalOpen(false)}
              style={{
                color: '#BABABA',
                fontSize: '26px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
          <div
            className="drafts-scroll"
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              paddingRight: '8px'
            }}
          >
            {draftListings.map((draft) => renderDraftCard(draft))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoadingProduct) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .create-listing-input::placeholder {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        @media (max-width: 1023px) {
          .create-listing-input::placeholder {
            font-size: 0.7rem;
          }
        }
        .create-listing-textarea::placeholder {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        .create-listing-select option:first-child {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        .create-listing-select:invalid {
          color: #D9D9D9;
          font-size: 0.85rem;
        }
        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        /* Drag and drop cursor */
        .image-upload-area {
          cursor: pointer;
        }
        .image-upload-area.dragging-over {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g><path fill="white" stroke="black" stroke-width="2" d="M8 6 v12 l2 2 v6 a2 2 0 004 0 v-8 h2 v4 a2 2 0 004 0 v-4 h2 v2 a2 2 0 004 0 v-2 h1 v-1 a2 2 0 00-4 0 v-9 l-2-2 h-8 l-5-1 z"/></g></svg>') 12 12, grab !important;
        }
        /* Custom select dropdown arrow */
        .create-listing-select,
        select.custom-select-arrow {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.5em;
          padding-right: 3rem;
        }
        /* Category select dropdown styling */
        .create-listing-select option {
          color: #6A6A6A;
          padding: 12px 16px;
          border-radius: 8px;
        }
        .create-listing-select option:checked,
        .create-listing-select option:hover {
          background-color: #F0F8FE !important;
          color: #6A6A6A;
        }
        /* Custom focus ring color */
        input:focus,
        textarea:focus,
        select:focus {
          --tw-ring-color: #97CDF9 !important;
          box-shadow: 0 0 0 2px #97CDF9 !important;
        }
        /* Price input container focus */
        .price-input-container:focus-within {
          --tw-ring-color: #97CDF9 !important;
          box-shadow: 0 0 0 2px #97CDF9 !important;
        }
        /* Remove any divider line in price input */
        .price-input-container select,
        .price-input-container input {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .price-input-container select:focus,
        .price-input-container input:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>

      <header className="hidden lg:block flex-shrink-0 rounded-t-2xl" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 -ml-16">
              <img src={logo} alt="bao'Afrik" className="h-8 w-auto" />
            </Link>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-4 -mr-12">
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

              {/* Start Selling Button */}
              {/* <Link
                to="/create-listing"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#FEF6E9' }}
              >
                <img src={basketIcon} alt="Basket" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(59%) sepia(94%) saturate(423%) hue-rotate(359deg) brightness(98%) contrast(98%)' }} />
                <span className="text-sm font-normal" style={{ color: '#F9A825' }}>
                  Start Selling
                </span>
              </Link> */}

              {/* Notification Icon */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200 relative"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <img
                    src={notificationIcon}
                    alt="Notifications"
                    className="w-6 h-6"
                    style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)' }}
                  />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
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
              </div>

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
                    <div className="px-3 pb-3 flex items-center justify-between">
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
                          onClick={() => setIsMenuDropdownOpen(false)}
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

      {/* Page Content - Scrollable */}
      <div className="flex-1 overflow-y-auto py-3 px-4 lg:py-6 sm:px-6 lg:px-8 bg-white lg:bg-[#F5F5F5]">
        {!showSuccessModal ? (
          <div className="max-w-7xl mx-auto">
            {/* Mobile Top Bar - Back Arrow and Drafts Button */}
            <div className="flex items-center justify-between mb-3 lg:hidden px-2">
              {/* Back Arrow */}
              <img
                src={arrowLeftIcon}
                alt="Back"
                className="w-5 h-5 cursor-pointer ml-2"
                onClick={handleHomepageClick}
              />
              {/* Drafts Button */}
              <button
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg mr-2"
                style={{ backgroundColor: '#F0F8FE' }}
                onClick={() => {
                  if (isMobile) {
                    setShowMobileDrafts(true);
                  } else {
                    setIsDraftsModalOpen(true);
                  }
                }}
              >
                <img src={draftsIcon} alt="Drafts" className="w-3.5 h-3.5" />
                <span className="font-medium text-xs" style={{ color: '#64B5F6' }}>
                  Drafts
                </span>
                <span
                  className="px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#CFE8FC', color: '#64B5F6', fontSize: '0.7rem' }}
                >
                  {draftListings.length}
                </span>
              </button>
            </div>

            {/* Desktop Breadcrumbs and Drafts Button */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-xs">
                <img
                  src={arrowLeftIcon}
                  alt="Back"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleHomepageClick}
                />
                <span
                  className="hover:text-gray-700 cursor-pointer"
                  style={{ color: '#BABABA' }}
                  onClick={handleHomepageClick}
                >
                  Homepage
                </span>
                <span className="text-gray-400">/</span>
                <span
                  className="hover:text-gray-700 cursor-pointer"
                  style={{ color: '#BABABA' }}
                  onClick={handleMenuClick}
                >
                  Menu
                </span>
                <span className="text-gray-400">/</span>
                <span className="font-medium" style={{ color: '#4D4D4D' }}>Create a new listing</span>
              </nav>

              {/* Drafts Button */}
              <button
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: '#F0F8FE' }}
                onClick={() => setIsDraftsModalOpen(true)}
              >
                <img src={draftsIcon} alt="Drafts" className="w-4 h-4" />
                <span className="font-medium text-xs" style={{ color: '#64B5F6' }}>
                  Drafts
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#CFE8FC', color: '#64B5F6', fontSize: '0.72rem' }}
                >
                  {draftListings.length}
                </span>
              </button>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl lg:border lg:border-gray-300 lg:shadow-sm pt-4 lg:pt-10 px-4 lg:px-6 pb-6 lg:pb-16">
              {/* Desktop Form Header */}
              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Title Section */}
                <div className="flex items-start space-x-3 pl-8">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: '#F0F8FE' }}
                  >
                    <img src={shippxIcon} alt="Shipping" className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-medium text-gray-900">
                      Create a new listing
                    </h1>
                    <p className="mt-1 text-xs" style={{ color: '#BABABA' }}>Add a new product</p>
                  </div>
                </div>

                {/* Location Section */}
                <div className="relative location-dropdown-container">
                  <div className="flex items-start justify-between mt-4" style={{ maxWidth: '560px' }}>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <img src={locIcon} alt="Location" className="w-4 h-4" />
                        <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Your location</span>
                      </div>
                      <input
                        type="text"
                        value={location}
                        readOnly
                        className="text-xs font-medium border-none focus:outline-none ml-6 cursor-default"
                        style={{ color: '#64B5F6', backgroundColor: 'transparent' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                      className="px-4 py-3 rounded-lg text-xs font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                    >
                      Change location
                    </button>
                  </div>
                  {/* Location Dropdown */}
                  {isLocationDropdownOpen && (
                    <div
                      ref={locationDropdownRef}
                      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg location-dropdown-scroll"
                      style={{
                        borderRadius: '12px',
                        top: '100%',
                        right: 0,
                        width: 'auto',
                        minWidth: '280px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                      }}
                    >
                      {ukCities.map((loc, index) => (
                        <div
                          key={loc.value}
                          className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                            } ${index === ukCities.length - 1 ? 'rounded-b-xl' : ''
                            }`}
                          style={{
                            backgroundColor: 'transparent'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setLocation(loc.label);
                              setIsLocationDropdownOpen(false);
                            }}
                            className="w-full text-left transition-colors relative"
                            style={{
                              color: '#6A6A6A',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              padding: '10px 16px',
                              fontWeight: 500
                            }}
                          >
                            {location === loc.label && (
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '8px',
                                  right: '8px',
                                  top: '4px',
                                  bottom: '4px',
                                  backgroundColor: '#F0F8FE',
                                  borderRadius: '8px',
                                  zIndex: -1
                                }}
                              />
                            )}
                            <span style={{ position: 'relative', zIndex: 1 }}>{loc.label}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Title Section */}
              <div className="lg:hidden mb-6">
                <h1 className="text-lg font-semibold text-gray-900">
                  Create a new listing
                </h1>
                <p className="mt-0.5 text-xs" style={{ color: '#BABABA' }}>Add a new product</p>
              </div>

              {/* Mobile Form Layout */}
              <div className="lg:hidden space-y-3">
                {/* Image Upload Box - Mobile */}
                <div>
                  <div
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`text-center relative image-upload-area ${isDraggingOver ? 'dragging-over' : ''}`}
                    style={{
                      backgroundColor: isImageLoading ? 'transparent' : (isDraggingOver ? 'transparent' : (imageUrls.length > 0 ? 'transparent' : 'white')),
                      background: (isImageLoading || isDraggingOver)
                        ? 'repeating-linear-gradient(-45deg, #F5FBFF, #F5FBFF 18px, #F8FCFF 18px, #F8FCFF 36px)'
                        : (imageUrls.length > 0 ? 'transparent' : 'white'),
                      border: (isImageLoading || isDraggingOver) ? '2px dashed #83C4F8' : '1px solid #E9E9E9',
                      borderRadius: '20px',
                      height: imageUrls.length > 0 ? '260px' : '240px',
                      display: imageUrls.length > 0 ? 'flex' : 'flex',
                      justifyContent: imageUrls.length > 0 ? 'center' : 'center',
                      alignItems: imageUrls.length > 0 ? 'center' : 'center',
                      padding: imageUrls.length > 0 ? '0' : '60px 16px'
                    }}
                  >
                    {isImageLoading ? (
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-xs mb-6" style={{ color: '#83C4F8', fontWeight: 500 }}>
                          Image loading
                        </p>
                        <div className="relative mb-4">
                          {/* Gray base circle */}
                          <svg width="78" height="78" className="transform -rotate-90">
                            <circle
                              cx="39"
                              cy="39"
                              r="36"
                              fill="none"
                              stroke="#E9E9E9"
                              strokeWidth="3"
                            />
                            {/* Blue progress arc */}
                            <circle
                              cx="39"
                              cy="39"
                              r="36"
                              fill="none"
                              stroke="#83C4F8"
                              strokeWidth="3"
                              strokeDasharray={`${(uploadProgress / 100) * 226} 226`}
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Icon in center */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img
                              src={loadIcon}
                              alt="Loading"
                              style={{
                                width: '32px',
                                height: '32px',
                                filter: 'brightness(0) saturate(100%) invert(70%) sepia(36%) saturate(624%) hue-rotate(172deg) brightness(100%) contrast(96%)'
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-normal" style={{ color: '#83C4F8' }}>
                            {uploadProgress}%
                          </p>
                          {draggedImagesTotal >= 2 && (
                            <p className="text-base font-normal" style={{ color: '#83C4F8' }}>
                              {currentDraggedImageIndex}/{draggedImagesTotal}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : imageUrls.length > 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <img
                          src={imageUrls[primaryImageIndex]}
                          alt="Upload"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={imageIcon}
                          alt="Upload"
                          className="mb-4 opacity-60"
                          style={{ width: '64px', height: '64px' }}
                        />
                        <label className="inline-block">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <span
                            className="px-4 py-1.5 rounded-lg font-medium cursor-pointer inline-block text-xs"
                            style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                          >
                            Upload Photos
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-400 text-xs">
                      You can add up to 10 photos (JPEG, JPG, PNG)
                    </p>
                    {imageUrls.length > 0 && (
                      <div
                        className="px-3 py-1 rounded-md"
                        style={{
                          backgroundColor: '#F0F8FE',
                          color: '#64B5F6',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        {imageUrls.length}/10
                      </div>
                    )}
                  </div>

                  {/* Image Preview Section - Mobile - Exactly like desktop structure */}
                  {imageUrls.length > 0 && (
                    <div className="flex gap-3 mt-4" style={{ paddingTop: '25px', paddingBottom: '15px' }}>
                      <style>{`
                        .mobile-image-preview-scroll::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>

                      {/* Conditionally wrap in scrollable container when 4+ images */}
                      {imageUrls.length >= 4 ? (
                        <div
                          className="relative"
                          style={{
                            width: imageUrls.length >= 10 ? '378px' : '294px',
                            height: '100px',
                            paddingTop: '15px',
                            paddingBottom: '15px',
                            marginTop: '-15px',
                            marginBottom: '-15px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            className="mobile-image-preview-scroll flex gap-3"
                            style={{
                              overflowX: 'auto',
                              overflowY: 'visible',
                              scrollbarWidth: 'none',
                              msOverflowStyle: 'none',
                              WebkitOverflowScrolling: 'touch',
                              height: '70px',
                              paddingLeft: '15px',
                              paddingRight: '15px',
                              marginLeft: '-15px',
                              marginRight: '-15px'
                            }}
                          >
                            {imageUrls.map((url, index) => (
                              <div
                                key={index}
                                className="relative"
                                style={{
                                  width: '70px',
                                  height: '70px',
                                  flexShrink: 0,
                                  borderRadius: '12px',
                                  overflow: 'visible'
                                }}
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  style={{ borderRadius: '12px' }}
                                />

                                {/* Light gray smoky overlay - only on primary image */}
                                {index === primaryImageIndex && (
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                      borderRadius: '12px'
                                    }}
                                  />
                                )}

                                {/* Remove button (X) */}
                                <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute flex items-center justify-center"
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    backgroundColor: '#4D4D4D',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    top: '-9px',
                                    right: '-9px',
                                    zIndex: 20
                                  }}
                                >
                                  <svg
                                    width="6"
                                    height="6"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  >
                                    <path d="M1 1L9 9M9 1L1 9" />
                                  </svg>
                                </button>

                                {/* Primary/Checkmark button - only show on primary image */}
                                {index === primaryImageIndex && (
                                  <button
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: '#F9A825',
                                      borderRadius: '50%',
                                      border: '2px solid white',
                                      zIndex: 10
                                    }}
                                  >
                                    <svg
                                      width="10"
                                      height="8"
                                      viewBox="0 0 12 10"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M1 5L4 8L11 1" />
                                    </svg>
                                  </button>
                                )}

                                {/* Clickable overlay to set as primary - only show on non-primary images */}
                                {index !== primaryImageIndex && (
                                  <div
                                    onClick={() => handleSetPrimaryImage(index)}
                                    className="absolute inset-0 cursor-pointer"
                                    style={{
                                      borderRadius: '12px',
                                      zIndex: 5
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Fade effect on left - Mobile - exactly like desktop */}
                          <div
                            className="absolute left-0 pointer-events-none"
                            style={{
                              width: '40px',
                              height: '100px',
                              top: '0',
                              background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                              zIndex: 15
                            }}
                          />

                          {/* Fade effect on right - Mobile - exactly like desktop */}
                          <div
                            className="absolute right-0 pointer-events-none"
                            style={{
                              width: '40px',
                              height: '100px',
                              top: '0',
                              background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                              zIndex: 15
                            }}
                          />
                        </div>
                      ) : (
                        // Show images without scrollable container when 1-3 images - Mobile
                        imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative"
                            style={{
                              width: '70px',
                              height: '70px',
                              flexShrink: 0,
                              borderRadius: '12px',
                              overflow: 'visible'
                            }}
                          >
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              style={{ borderRadius: '12px' }}
                            />

                            {/* Light gray smoky overlay - only on primary image */}
                            {index === primaryImageIndex && (
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                  borderRadius: '12px'
                                }}
                              />
                            )}

                            {/* Remove button (X) */}
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute flex items-center justify-center"
                              style={{
                                width: '18px',
                                height: '18px',
                                backgroundColor: '#4D4D4D',
                                borderRadius: '50%',
                                border: '2px solid white',
                                top: '-9px',
                                right: '-9px',
                                zIndex: 20
                              }}
                            >
                              <svg
                                width="6"
                                height="6"
                                viewBox="0 0 10 10"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                              >
                                <path d="M1 1L9 9M9 1L1 9" />
                              </svg>
                            </button>

                            {/* Primary/Checkmark button - only show on primary image */}
                            {index === primaryImageIndex && (
                              <button
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: '#F9A825',
                                  borderRadius: '50%',
                                  border: '2px solid white',
                                  zIndex: 10
                                }}
                              >
                                <svg
                                  width="10"
                                  height="8"
                                  viewBox="0 0 12 10"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M1 5L4 8L11 1" />
                                </svg>
                              </button>
                            )}

                            {/* Clickable overlay to set as primary - only show on non-primary images */}
                            {index !== primaryImageIndex && (
                              <div
                                onClick={() => handleSetPrimaryImage(index)}
                                className="absolute inset-0 cursor-pointer"
                                style={{
                                  borderRadius: '12px',
                                  zIndex: 5
                                }}
                              />
                            )}
                          </div>
                        ))
                      )}

                      {/* Upload Next Images Interface - Mobile - Fixed at 4th position (outside container, like desktop) */}
                      {imageUrls.length < 10 && (
                        <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                          <label
                            className="flex items-center justify-center cursor-pointer"
                            style={{
                              width: '70px',
                              height: '70px',
                              backgroundColor: '#F0F8FE',
                              border: '2px dashed #64B5F6',
                              borderRadius: '12px'
                            }}
                          >
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 32 32"
                              fill="none"
                              stroke="#64B5F6"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <path d="M16 8V24M8 16H24" />
                            </svg>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Location Section */}
                <div className="relative location-dropdown">
                  <div className="flex items-start justify-between mt-4 mb-4">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-0.5" style={{ marginLeft: '-2px' }}>
                        <img src={locIcon} alt="Location" className="w-3 h-3 hidden" />
                        <span className="text-xs font-medium" style={{ color: '#6A6A6A', fontSize: '0.7rem' }}>Your location</span>
                      </div>
                      <input
                        type="text"
                        value={location}
                        readOnly
                        className="text-xs font-medium border-none focus:outline-none cursor-default"
                        style={{ color: '#64B5F6', backgroundColor: 'transparent' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: '#F0F8FE',
                        color: '#64B5F6',
                        fontSize: '0.7rem',
                        border: isLocationDropdownOpen ? '1px solid #97CDF9' : 'none',
                        boxShadow: isLocationDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                      }}
                    >
                      Change location
                    </button>
                  </div>
                  {/* Location Dropdown */}
                  {isLocationDropdownOpen && (
                    <div
                      ref={locationDropdownRef}
                      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg location-dropdown-scroll"
                      style={{
                        borderRadius: '12px',
                        top: '100%',
                        right: 0,
                        width: 'auto',
                        minWidth: '240px',
                        maxHeight: '180px',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                      }}
                    >
                      {ukCities.map((loc, index) => (
                        <div
                          key={loc.value}
                          className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                            } ${index === ukCities.length - 1 ? 'rounded-b-xl' : ''
                            }`}
                          style={{
                            backgroundColor: 'transparent'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setLocation(loc.label);
                              setIsLocationDropdownOpen(false);
                            }}
                            className="w-full text-left transition-colors relative"
                            style={{
                              color: '#6A6A6A',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              padding: '10px 16px',
                              fontWeight: 500
                            }}
                          >
                            {location === loc.label && (
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '8px',
                                  right: '8px',
                                  top: '4px',
                                  bottom: '4px',
                                  backgroundColor: '#F0F8FE',
                                  borderRadius: '8px',
                                  zIndex: -1
                                }}
                              />
                            )}
                            <span style={{ position: 'relative', zIndex: 1 }}>{loc.label}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Title Input */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter product name"
                    className="create-listing-input w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Mobile Description */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="... Describe your product"
                    rows={3}
                    className="create-listing-textarea w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                {/* Mobile Price and Quantity Section - Side by Side */}
                <div className="flex items-start gap-3">
                  {/* Mobile Price Section */}
                  <div className="flex-1" style={{ minWidth: '0' }}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                      Price
                    </label>
                    <div className="relative w-full">
                      <div className="price-input-container flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:border-transparent">
                        {/* Currency Dropdown */}
                        <div className="relative currency-dropdown" style={{ position: 'static' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                            }}
                            className="pl-2 pr-1 py-2 border-none focus:outline-none bg-white flex items-center"
                            style={{ color: '#E4E4E4', fontSize: '0.7rem', cursor: 'pointer' }}
                          >
                            <span>{currency}</span>
                            {/* <svg
                              className="w-2.5 h-2.5 ml-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: '#6B7280' }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg> */}
                          </button>

                          {/* Dropdown Menu */}
                          {isCurrencyDropdownOpen && (
                            <div
                              className="absolute z-50 bg-white border border-gray-200 shadow-lg overflow-hidden"
                              style={{ borderRadius: '10px', minWidth: '220px', left: '0', top: 'calc(100% + 6px)' }}
                            >
                              {currencies.map((curr, index) => (
                                <div
                                  key={curr.value}
                                  className={`w-full ${index === 0 ? 'rounded-t-lg' : ''
                                    } ${index === currencies.length - 1 ? 'rounded-b-lg' : ''
                                    }`}
                                  style={{
                                    backgroundColor: 'transparent'
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCurrency(curr.value);
                                      setIsCurrencyDropdownOpen(false);
                                    }}
                                    className="w-full text-left transition-colors relative flex items-center"
                                    style={{
                                      color: '#6A6A6A',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem',
                                      padding: '8px 12px',
                                      fontWeight: 500
                                    }}
                                  >
                                    {currency === curr.value && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: '6px',
                                          right: '6px',
                                          top: '3px',
                                          bottom: '3px',
                                          backgroundColor: '#F0F8FE',
                                          borderRadius: '6px',
                                          zIndex: 0
                                        }}
                                      />
                                    )}
                                    <img
                                      src={`https://flagcdn.com/w40/${curr.flagCode}.png`}
                                      alt=""
                                      style={{
                                        width: '20px',
                                        height: '15px',
                                        marginRight: '10px',
                                        position: 'relative',
                                        zIndex: 1
                                      }}
                                    />
                                    <span style={{ position: 'relative', zIndex: 1 }}>
                                      {curr.label} · {curr.value}
                                    </span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div style={{ width: '1px', height: '24px', backgroundColor: '#D1D5DB', marginLeft: '6px', marginRight: '6px', flexShrink: 0 }}></div>
                        <input
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Insert Pricing"
                          className="create-listing-input flex-1 pl-2 pr-2 py-2 border-none focus:outline-none focus:ring-0"
                          style={{ borderLeft: 'none', boxShadow: 'none', fontSize: '0.7rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quantity */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                      Quantity
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg font-medium text-base flex-shrink-0"
                        style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Clear leading zeros when user types
                          if (value && value.startsWith('0') && value.length > 1) {
                            setQuantity(parseInt(value.replace(/^0+/, '')) || 1);
                          } else {
                            setQuantity(parseInt(value) || 1);
                          }
                        }}
                        className="px-2.5 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ width: '100%', fontSize: '0.75rem' }}
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg font-medium text-base flex-shrink-0"
                        style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Categories */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                    Categories
                  </label>
                  <div className="relative category-dropdown w-full">
                    {/* Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                      style={{
                        borderColor: isCategoryDropdownOpen ? '#97CDF9' : '#D1D5DB',
                        boxShadow: isCategoryDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                      }}
                    >
                      <span style={{ color: category ? '#6A6A6A' : '#D9D9D9', fontSize: '0.75rem' }}>
                        {category ? categories.find(c => c.value === category)?.label : 'Choose category'}
                      </span>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B7280' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isCategoryDropdownOpen && (
                      <div
                        className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 shadow-lg overflow-hidden"
                        style={{ borderRadius: '10px' }}
                      >
                        {categories.map((cat, index) => (
                          <div
                            key={cat.value}
                            className={`w-full ${index === 0 ? 'rounded-t-lg' : ''
                              } ${index === categories.length - 1 ? 'rounded-b-lg' : ''
                              }`}
                            style={{
                              backgroundColor: 'transparent'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setCategory(cat.value);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className="w-full text-left transition-colors relative"
                              style={{
                                color: '#6A6A6A',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                padding: '8px 12px',
                                fontWeight: 500
                              }}
                            >
                              {category === cat.value && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: '6px',
                                    right: '6px',
                                    top: '3px',
                                    bottom: '3px',
                                    backgroundColor: '#F0F8FE',
                                    borderRadius: '6px',
                                    zIndex: -1
                                  }}
                                />
                              )}
                              <span style={{ position: 'relative', zIndex: 1 }}>{cat.label}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Origin of product */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                    Origin of product
                  </label>
                  <div className="relative origin-dropdown w-full">
                    {/* Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => setIsOriginDropdownOpen(!isOriginDropdownOpen)}
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                      style={{
                        borderColor: isOriginDropdownOpen ? '#97CDF9' : '#D1D5DB',
                        boxShadow: isOriginDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                      }}
                    >
                      {origin ? (
                        <div className="flex items-center">
                          <img
                            src={`https://flagcdn.com/w40/${countries.find(c => c.value === origin)?.flagCode}.png`}
                            srcSet={`https://flagcdn.com/w80/${countries.find(c => c.value === origin)?.flagCode}.png 2x`}
                            alt={`${countries.find(c => c.value === origin)?.label} flag`}
                            style={{
                              width: '18px',
                              height: '13px',
                              marginRight: '8px',
                              borderRadius: '4px',
                              objectFit: 'cover'
                            }}
                          />
                          <span style={{ color: '#6A6A6A', fontSize: '0.75rem', fontWeight: 500 }}>
                            {countries.find(c => c.value === origin)?.label}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#D9D9D9', fontSize: '0.75rem' }}>
                          Choose origin of product
                        </span>
                      )}
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B7280' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOriginDropdownOpen && (
                      <div
                        className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 shadow-lg overflow-y-auto origin-dropdown-scroll"
                        style={{
                          borderRadius: '10px',
                          maxHeight: '200px'
                        }}
                      >
                        <style>{`
                        .origin-dropdown-scroll::-webkit-scrollbar {
                          width: 16px;
                        }
                        .origin-dropdown-scroll::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .origin-dropdown-scroll::-webkit-scrollbar-thumb {
                          background: #E4E4E4;
                          border-radius: 10px;
                          border: 6px solid white;
                          background-clip: padding-box;
                        }
                        .origin-dropdown-scroll::-webkit-scrollbar-thumb:hover {
                          background: #D1D5DB;
                          border: 6px solid white;
                          background-clip: padding-box;
                        }
                        .flag-emoji {
                          font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Apple Color Emoji", "Twemoji Mozilla", sans-serif;
                        }
                      `}</style>
                        {countries.map((country, index) => (
                          <div
                            key={country.value}
                            className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                              } ${index === countries.length - 1 ? 'rounded-b-xl' : ''
                              }`}
                            style={{
                              backgroundColor: 'transparent'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOrigin(country.value);
                                setIsOriginDropdownOpen(false);
                              }}
                              className="w-full text-left transition-colors relative flex items-center"
                              style={{
                                color: '#6A6A6A',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                padding: '8px 16px',
                                fontWeight: 500
                              }}
                            >
                              {origin === country.value && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: '8px',
                                    right: '8px',
                                    top: '4px',
                                    bottom: '4px',
                                    backgroundColor: '#F0F8FE',
                                    borderRadius: '8px',
                                    zIndex: 0
                                  }}
                                />
                              )}
                              <img
                                src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                                srcSet={`https://flagcdn.com/w80/${country.flagCode}.png 2x`}
                                alt={`${country.label} flag`}
                                style={{
                                  width: '24px',
                                  height: '18px',
                                  marginRight: '12px',
                                  position: 'relative',
                                  zIndex: 1,
                                  objectFit: 'cover',
                                  borderRadius: '2px'
                                }}
                              />
                              <span style={{ position: 'relative', zIndex: 1 }}>{country.label}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Type of sale */}
                {/* <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A6A6A' }}>
                    Type of sale
                  </label>
                  <div className="relative sale-type-dropdown w-full">
                    <button
                      type="button"
                      onClick={() => setIsSaleTypeDropdownOpen(!isSaleTypeDropdownOpen)}
                      className="w-full px-2.5 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                      style={{
                        borderColor: isSaleTypeDropdownOpen ? '#97CDF9' : '#D1D5DB',
                        boxShadow: isSaleTypeDropdownOpen ? '0 0 0 2px #97CDF9' : 'none',
                        paddingTop: saleType === 'Urgent' ? '4px' : '8px',
                        paddingBottom: saleType === 'Urgent' ? '4px' : '8px'
                      }}
                    >
                      <div className="flex items-center">
                        {saleType === 'Urgent' ? (
                          <div
                            className="flex items-center"
                            style={{
                              backgroundColor: '#FEF6E9',
                              color: '#F9A825',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 500
                            }}
                          >
                            <span>Urgent</span>
                            <img
                              src={path2Icon}
                              alt=""
                              style={{
                                width: '11px',
                                height: '11px',
                                marginLeft: '5px'
                              }}
                            />
                          </div>
                        ) : (
                          <span style={{ color: saleType ? '#6A6A6A' : '#D9D9D9', fontSize: '0.75rem' }}>
                            {saleType ? saleTypes.find(s => s.value === saleType)?.label : 'Choose type of sale'}
                          </span>
                        )}
                      </div>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B7280' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isSaleTypeDropdownOpen && (
                      <div
                        className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 shadow-lg overflow-hidden"
                        style={{ borderRadius: '10px' }}
                      >
                        {saleTypes.map((type, index) => (
                          <div
                            key={type.value}
                            className={`w-full ${index === 0 ? 'rounded-t-lg' : ''
                              } ${index === saleTypes.length - 1 ? 'rounded-b-lg' : ''
                              }`}
                            style={{
                              backgroundColor: 'transparent'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSaleType(type.value);
                                setIsSaleTypeDropdownOpen(false);
                              }}
                              className="w-full text-left transition-colors relative flex items-center"
                              style={{
                                color: type.value === 'Default' ? '#6A6A6A' : '#999999',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                padding: '10px 12px',
                                fontWeight: 500
                              }}
                            >
                              {saleType === type.value && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: '6px',
                                    right: '6px',
                                    top: '3px',
                                    bottom: '3px',
                                    backgroundColor: '#F0F8FE',
                                    borderRadius: '6px',
                                    zIndex: 0
                                  }}
                                />
                              )}
                              <span style={{ position: 'relative', zIndex: 1 }}>{type.label}</span>
                              {type.icon && (
                                <img
                                  src={type.icon}
                                  alt=""
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    position: 'relative',
                                    zIndex: 1,
                                    opacity: 0.7,
                                    marginLeft: '6px'
                                  }}
                                />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div> */}

                {/* Mobile Delivery available */}
                <div className="py-3 mb-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-medium" style={{ color: '#6A6A6A' }}>
                        Delivery available
                      </label>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Lorem ipsum dolor sit amet consectutor
                      </p>
                    </div>
                    <button
                      onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${deliveryAvailable ? '' : 'bg-gray-300'
                        }`}
                      style={deliveryAvailable ? { backgroundColor: '#4CD964' } : {}}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${deliveryAvailable ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Mobile Buttons */}
                <div className="flex flex-col items-center space-y-2.5 mt-4">
                  <button
                    onClick={handlePostListing}
                    disabled={isSavingDraft || isPostingListing || !isFormComplete}
                    className="flex items-center justify-center space-x-2 w-full py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{
                      backgroundColor: (isFormComplete && !isSavingDraft && !isPostingListing) ? '#F9A825' : '#E9E9E9',
                      color: (isFormComplete && !isSavingDraft && !isPostingListing) ? '#FFFFFF' : '#6A6A6A',
                      cursor: (isSavingDraft || isPostingListing || !isFormComplete) ? 'not-allowed' : 'pointer',
                      minHeight: '40px',
                      position: 'relative'
                    }}
                  >
                    {isPostingListing ? (
                      <div className="flex items-center justify-center w-full">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <>
                        <span>Post listing</span>
                        <img
                          src={flyIcon}
                          alt="Post"
                          className="w-4 h-4"
                          style={{
                            filter: (isFormComplete && !isSavingDraft && !isPostingListing) ? 'brightness(0) invert(1)' : 'none'
                          }}
                        />
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || isPostingListing}
                    className="flex items-center justify-center w-full py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{
                      color: (isSavingDraft || isPostingListing) ? '#B0B0B0' : '#939393',
                      cursor: (isSavingDraft || isPostingListing) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSavingDraft ? (
                      <div className="flex items-center justify-center w-full">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#939393' }}></div>
                      </div>
                    ) : (
                      <span>Save as draft</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Desktop Form Columns */}
              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4 pl-8">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter product name"
                      className="create-listing-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Image Upload Box */}
                  <div>
                    <div
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`rounded-2xl text-center relative image-upload-area ${isDraggingOver ? 'dragging-over' : ''}`}
                      style={{
                        backgroundColor: isImageLoading ? 'transparent' : (isDraggingOver ? 'transparent' : (imageUrls.length > 0 ? 'transparent' : '#F5F5F5')),
                        background: (isImageLoading || isDraggingOver)
                          ? 'repeating-linear-gradient(-45deg, #F5FBFF, #F5FBFF 18px, #F8FCFF 18px, #F8FCFF 36px)'
                          : (imageUrls.length > 0 ? 'transparent' : '#F5F5F5'),
                        border: (isImageLoading || isDraggingOver) ? '2px dashed #83C4F8' : 'none',
                        borderRadius: '16px',
                        height: imageUrls.length > 0 ? '433px' : 'auto',
                        display: imageUrls.length > 0 ? 'flex' : 'block',
                        justifyContent: imageUrls.length > 0 ? 'center' : 'normal',
                        alignItems: imageUrls.length > 0 ? 'center' : 'normal',
                        padding: imageUrls.length > 0 ? '0' : '128px 80px'
                      }}
                    >
                      {isImageLoading ? (
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-xs mb-6" style={{ color: '#83C4F8', fontWeight: 500 }}>
                            Image loading
                          </p>
                          <div className="relative mb-4">
                            {/* Gray base circle */}
                            <svg width="78" height="78" className="transform -rotate-90">
                              <circle
                                cx="39"
                                cy="39"
                                r="36"
                                fill="none"
                                stroke="#E9E9E9"
                                strokeWidth="3"
                              />
                              {/* Blue progress arc */}
                              <circle
                                cx="39"
                                cy="39"
                                r="36"
                                fill="none"
                                stroke="#83C4F8"
                                strokeWidth="3"
                                strokeDasharray={`${(uploadProgress / 100) * 226} 226`}
                                strokeLinecap="round"
                              />
                            </svg>
                            {/* Icon in center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img
                                src={loadIcon}
                                alt="Loading"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  filter: 'brightness(0) saturate(100%) invert(70%) sepia(36%) saturate(624%) hue-rotate(172deg) brightness(100%) contrast(96%)'
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-base font-normal" style={{ color: '#83C4F8' }}>
                              {uploadProgress}%
                            </p>
                            {draggedImagesTotal >= 2 && (
                              <p className="text-base font-normal" style={{ color: '#83C4F8' }}>
                                {currentDraggedImageIndex}/{draggedImagesTotal}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : imageUrls.length > 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                          <img
                            src={imageUrls[primaryImageIndex]}
                            alt="Upload"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <>
                          <img
                            src={imageIcon}
                            alt="Upload"
                            className="mx-auto mb-4 opacity-60"
                            style={{ width: '24px', height: '24px' }}
                          />
                          <p className="text-xs mb-2" style={{ color: '#2D2D2D' }}>
                            Drag and drop product images here
                          </p>
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-8 border-t border-gray-300"></div>
                            <p className="text-gray-400 text-sm px-3">OR</p>
                            <div className="w-8 border-t border-gray-300"></div>
                          </div>
                          <label className="inline-block">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <span
                              className="px-6 py-2.5 rounded-lg font-medium cursor-pointer inline-block"
                              style={{ backgroundColor: '#F0F8FE', color: '#64B5F6' }}
                            >
                              Upload Photos
                            </span>
                          </label>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-gray-400 text-xs">
                        You can add up to 10 photos (JPEG, JPG, PNG)
                      </p>
                      {imageUrls.length > 0 && (
                        <div
                          className="px-3 py-1 rounded-md"
                          style={{
                            backgroundColor: '#F0F8FE',
                            color: '#64B5F6',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        >
                          {imageUrls.length}/10
                        </div>
                      )}
                    </div>

                    {/* Image Preview Section */}
                    {imageUrls.length > 0 && (
                      <div className="flex gap-6 mt-4" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                        <style>{`
                        .image-preview-scroll::-webkit-scrollbar {
                          display: none;
                        }
        .drafts-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .drafts-scroll::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>

                        {/* Conditionally wrap in scrollable container when 4+ images */}
                        {imageUrls.length >= 4 ? (
                          <div
                            className="relative"
                            style={{
                              width: imageUrls.length >= 10 ? '540px' : '420px',
                              height: '130px',
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              marginTop: '-15px',
                              marginBottom: '-15px',
                              overflow: 'hidden'
                            }}
                          >
                            <div
                              className="image-preview-scroll flex gap-6"
                              style={{
                                overflowX: 'auto',
                                overflowY: 'visible',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                height: '100px',
                                paddingLeft: '15px',
                                paddingRight: '15px',
                                marginLeft: '-15px',
                                marginRight: '-15px'
                              }}
                            >
                              {imageUrls.map((url, index) => (
                                <div
                                  key={index}
                                  className="relative"
                                  style={{
                                    width: '100px',
                                    height: '100px',
                                    flexShrink: 0,
                                    borderRadius: '12px',
                                    overflow: 'visible'
                                  }}
                                >
                                  <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    style={{ borderRadius: '12px' }}
                                  />

                                  {/* Light gray smoky overlay - only on primary image */}
                                  {index === primaryImageIndex && (
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        borderRadius: '12px'
                                      }}
                                    />
                                  )}

                                  {/* Remove button (X) */}
                                  <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute flex items-center justify-center"
                                    style={{
                                      width: '22px',
                                      height: '22px',
                                      backgroundColor: '#4D4D4D',
                                      borderRadius: '50%',
                                      border: '2px solid white',
                                      top: '-11px',
                                      right: '-11px',
                                      zIndex: 20
                                    }}
                                  >
                                    <svg
                                      width="8"
                                      height="8"
                                      viewBox="0 0 10 10"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    >
                                      <path d="M1 1L9 9M9 1L1 9" />
                                    </svg>
                                  </button>

                                  {/* Primary/Checkmark button - only show on primary image */}
                                  {index === primaryImageIndex && (
                                    <button
                                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                      style={{
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: '#F9A825',
                                        borderRadius: '50%',
                                        border: '2px solid white',
                                        zIndex: 10
                                      }}
                                    >
                                      <svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M1 5L4 8L11 1" />
                                      </svg>
                                    </button>
                                  )}

                                  {/* Clickable overlay to set as primary - only show on non-primary images */}
                                  {index !== primaryImageIndex && (
                                    <div
                                      onClick={() => handleSetPrimaryImage(index)}
                                      className="absolute inset-0 cursor-pointer"
                                      style={{
                                        borderRadius: '12px',
                                        zIndex: 5
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Fade effect on left - only with 4+ images */}
                            <div
                              className="absolute left-0 pointer-events-none"
                              style={{
                                width: '40px',
                                height: '130px',
                                top: '0',
                                background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                                zIndex: 15
                              }}
                            />

                            {/* Fade effect on right - only with 4+ images */}
                            <div
                              className="absolute right-0 pointer-events-none"
                              style={{
                                width: '40px',
                                height: '130px',
                                top: '0',
                                background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                                zIndex: 15
                              }}
                            />
                          </div>
                        ) : (
                          // Show images without scrollable container when 1-3 images
                          imageUrls.map((url, index) => (
                            <div
                              key={index}
                              className="relative"
                              style={{
                                width: '100px',
                                height: '100px',
                                flexShrink: 0,
                                borderRadius: '12px',
                                overflow: 'visible'
                              }}
                            >
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                                style={{ borderRadius: '12px' }}
                              />

                              {/* Light gray smoky overlay - only on primary image */}
                              {index === primaryImageIndex && (
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                    borderRadius: '12px'
                                  }}
                                />
                              )}

                              {/* Remove button (X) */}
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute flex items-center justify-center"
                                style={{
                                  width: '22px',
                                  height: '22px',
                                  backgroundColor: '#4D4D4D',
                                  borderRadius: '50%',
                                  border: '2px solid white',
                                  top: '-11px',
                                  right: '-11px',
                                  zIndex: 20
                                }}
                              >
                                <svg
                                  width="8"
                                  height="8"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                >
                                  <path d="M1 1L9 9M9 1L1 9" />
                                </svg>
                              </button>

                              {/* Primary/Checkmark button - only show on primary image */}
                              {index === primaryImageIndex && (
                                <button
                                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    backgroundColor: '#F9A825',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    zIndex: 10
                                  }}
                                >
                                  <svg
                                    width="12"
                                    height="10"
                                    viewBox="0 0 12 10"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M1 5L4 8L11 1" />
                                  </svg>
                                </button>
                              )}

                              {/* Clickable overlay to set as primary - only show on non-primary images */}
                              {index !== primaryImageIndex && (
                                <div
                                  onClick={() => handleSetPrimaryImage(index)}
                                  className="absolute inset-0 cursor-pointer"
                                  style={{
                                    borderRadius: '12px',
                                    zIndex: 5
                                  }}
                                />
                              )}
                            </div>
                          ))
                        )}

                        {/* Upload Next Images Interface - Fixed at 4th position */}
                        {imageUrls.length < 10 && (
                          <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                            <label
                              className="flex items-center justify-center cursor-pointer"
                              style={{
                                width: '100px',
                                height: '100px',
                                backgroundColor: '#F0F8FE',
                                border: '2px dashed #64B5F6',
                                borderRadius: '12px'
                              }}
                            >
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                stroke="#64B5F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                              >
                                <path d="M16 8V24M8 16H24" />
                              </svg>
                            </label>
                            <span
                              className="text-xs font-medium mt-2"
                              style={{ color: '#64B5F6' }}
                            >
                              Upload Photos
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="... Describe your product"
                      rows={4}
                      className="create-listing-textarea px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      style={{ width: '100%', maxWidth: '560px' }}
                    />
                  </div>

                  {/* Price and Quantity Row */}
                  <div className="flex items-start space-x-6">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                        Price
                      </label>
                      <div className="relative" style={{ maxWidth: '280px' }}>
                        <div className="price-input-container flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:border-transparent">
                          {/* Currency Dropdown */}
                          <div className="relative currency-dropdown" style={{ position: 'static' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                              }}
                              className="pl-4 pr-1 py-3 border-none focus:outline-none bg-white flex items-center"
                              style={{ color: '#E4E4E4', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              <span className="font-bold">{currency}</span>
                              {/* <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: '#6B7280' }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg> */}
                            </button>

                            {/* Dropdown Menu */}
                            {isCurrencyDropdownOpen && (
                              <div
                                className="absolute z-50 bg-white border border-gray-200 shadow-lg overflow-hidden"
                                style={{ borderRadius: '12px', minWidth: '250px', left: '0', top: 'calc(100% + 8px)' }}
                              >
                                {currencies.map((curr, index) => (
                                  <div
                                    key={curr.value}
                                    className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                                      } ${index === currencies.length - 1 ? 'rounded-b-xl' : ''
                                      }`}
                                    style={{
                                      backgroundColor: 'transparent'
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCurrency(curr.value);
                                        setIsCurrencyDropdownOpen(false);
                                      }}
                                      className="w-full text-left transition-colors relative flex items-center"
                                      style={{
                                        color: '#6A6A6A',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        padding: '10px 16px',
                                        fontWeight: 500
                                      }}
                                    >
                                      {currency === curr.value && (
                                        <div
                                          style={{
                                            position: 'absolute',
                                            left: '8px',
                                            right: '8px',
                                            top: '4px',
                                            bottom: '4px',
                                            backgroundColor: '#F0F8FE',
                                            borderRadius: '8px',
                                            zIndex: 0
                                          }}
                                        />
                                      )}
                                      <img
                                        src={`https://flagcdn.com/w40/${curr.flagCode}.png`}
                                        alt=""
                                        style={{
                                          width: '24px',
                                          height: '18px',
                                          marginRight: '12px',
                                          position: 'relative',
                                          zIndex: 1
                                        }}
                                      />
                                      <span style={{ position: 'relative', zIndex: 1 }}>
                                        {curr.label} · {curr.value}
                                      </span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div style={{ width: '1px', height: '28px', backgroundColor: '#D1D5DB', marginLeft: '10px', marginRight: '10px', flexShrink: 0 }}></div>
                          <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Insert Pricing"
                            className="create-listing-input flex-1 pl-3 pr-3 py-2.5 border-none focus:outline-none focus:ring-0 text-sm"
                            style={{ borderLeft: 'none', boxShadow: 'none' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                        Quantity
                      </label>
                      <div className="flex items-center space-x-2" style={{ maxWidth: '180px' }}>
                        <button
                          onClick={() => setQuantity(Math.max(0, quantity - 1))}
                          className="w-12 h-12 rounded-lg font-medium text-lg flex-shrink-0"
                          style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Clear leading zeros when user types
                            if (value && value.startsWith('0') && value.length > 1) {
                              setQuantity(parseInt(value.replace(/^0+/, '')) || 0);
                            } else {
                              setQuantity(parseInt(value) || 0);
                            }
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{ width: '140px' }}
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-12 h-12 rounded-lg font-medium text-lg flex-shrink-0"
                          style={{ backgroundColor: '#E3F2FD', color: '#64B5F6' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                      Categories
                    </label>
                    <div className="relative category-dropdown" style={{ width: '100%', maxWidth: '560px' }}>
                      {/* Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                        style={{
                          borderColor: isCategoryDropdownOpen ? '#97CDF9' : '#D1D5DB',
                          boxShadow: isCategoryDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                        }}
                      >
                        <span style={{ color: category ? '#6A6A6A' : '#D9D9D9', fontSize: '0.85rem' }}>
                          {category ? categories.find(c => c.value === category)?.label : 'Choose category'}
                        </span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: '#6B7280' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {isCategoryDropdownOpen && (
                        <div
                          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg overflow-hidden"
                          style={{ borderRadius: '12px' }}
                        >
                          {categories.map((cat, index) => (
                            <div
                              key={cat.value}
                              className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                                } ${index === categories.length - 1 ? 'rounded-b-xl' : ''
                                }`}
                              style={{
                                backgroundColor: 'transparent'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setCategory(cat.value);
                                  setIsCategoryDropdownOpen(false);
                                }}
                                className="w-full text-left transition-colors relative"
                                style={{
                                  color: '#6A6A6A',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  padding: '10px 16px',
                                  fontWeight: 500
                                }}
                              >
                                {category === cat.value && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '8px',
                                      right: '8px',
                                      top: '4px',
                                      bottom: '4px',
                                      backgroundColor: '#F0F8FE',
                                      borderRadius: '8px',
                                      zIndex: -1
                                    }}
                                  />
                                )}
                                <span style={{ position: 'relative', zIndex: 1 }}>{cat.label}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Origin of product */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                      Origin of product
                    </label>
                    <div className="relative origin-dropdown" style={{ width: '100%', maxWidth: '560px' }}>
                      {/* Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => setIsOriginDropdownOpen(!isOriginDropdownOpen)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                        style={{
                          borderColor: isOriginDropdownOpen ? '#97CDF9' : '#D1D5DB',
                          boxShadow: isOriginDropdownOpen ? '0 0 0 2px #97CDF9' : 'none'
                        }}
                      >
                        {origin ? (
                          <div className="flex items-center">
                            <img
                              src={`https://flagcdn.com/w40/${countries.find(c => c.value === origin)?.flagCode}.png`}
                              srcSet={`https://flagcdn.com/w80/${countries.find(c => c.value === origin)?.flagCode}.png 2x`}
                              alt={`${countries.find(c => c.value === origin)?.label} flag`}
                              style={{
                                width: '24px',
                                height: '18px',
                                marginRight: '12px',
                                borderRadius: '4px',
                                objectFit: 'cover'
                              }}
                            />
                            <span style={{ color: '#6A6A6A', fontSize: '0.85rem', fontWeight: 500 }}>
                              {countries.find(c => c.value === origin)?.label}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#D9D9D9', fontSize: '0.85rem' }}>
                            Choose origin of product
                          </span>
                        )}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: '#6B7280' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {isOriginDropdownOpen && (
                        <div
                          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg overflow-y-auto origin-dropdown-scroll"
                          style={{
                            borderRadius: '12px',
                            maxHeight: '250px'
                          }}
                        >
                          <style>{`
                          .origin-dropdown-scroll::-webkit-scrollbar {
                            width: 16px;
                          }
                          .origin-dropdown-scroll::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          .origin-dropdown-scroll::-webkit-scrollbar-thumb {
                            background: #E4E4E4;
                            border-radius: 10px;
                            border: 6px solid white;
                            background-clip: padding-box;
                          }
                          .origin-dropdown-scroll::-webkit-scrollbar-thumb:hover {
                            background: #D1D5DB;
                            border: 6px solid white;
                            background-clip: padding-box;
                          }
                          .flag-emoji {
                            font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Apple Color Emoji", "Twemoji Mozilla", sans-serif;
                          }
                        `}</style>
                          {countries.map((country, index) => (
                            <div
                              key={country.value}
                              className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                                } ${index === countries.length - 1 ? 'rounded-b-xl' : ''
                                }`}
                              style={{
                                backgroundColor: 'transparent'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setOrigin(country.value);
                                  setIsOriginDropdownOpen(false);
                                }}
                                className="w-full text-left transition-colors relative flex items-center"
                                style={{
                                  color: '#6A6A6A',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  padding: '6px 12px',
                                  fontWeight: 500
                                }}
                              >
                                {origin === country.value && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '6px',
                                      right: '6px',
                                      top: '3px',
                                      bottom: '3px',
                                      backgroundColor: '#F0F8FE',
                                      borderRadius: '6px',
                                      zIndex: 0
                                    }}
                                  />
                                )}
                                <img
                                  src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                                  srcSet={`https://flagcdn.com/w80/${country.flagCode}.png 2x`}
                                  alt={`${country.label} flag`}
                                  style={{
                                    width: '20px',
                                    height: '15px',
                                    marginRight: '10px',
                                    position: 'relative',
                                    zIndex: 1,
                                    objectFit: 'cover',
                                    borderRadius: '2px'
                                  }}
                                />
                                <span style={{ position: 'relative', zIndex: 1 }}>{country.label}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Type of sale */}
                  {/* <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6A6A6A' }}>
                      Type of sale
                    </label>
                    <div className="relative sale-type-dropdown" style={{ width: '100%', maxWidth: '560px' }}>
                      <button
                        type="button"
                        onClick={() => setIsSaleTypeDropdownOpen(!isSaleTypeDropdownOpen)}
                        className="w-full px-4 border border-gray-300 rounded-lg focus:outline-none text-left flex items-center justify-between"
                        style={{
                          borderColor: isSaleTypeDropdownOpen ? '#97CDF9' : '#D1D5DB',
                          boxShadow: isSaleTypeDropdownOpen ? '0 0 0 2px #97CDF9' : 'none',
                          paddingTop: saleType === 'Urgent' ? '6px' : '12px',
                          paddingBottom: saleType === 'Urgent' ? '6px' : '12px'
                        }}
                      >
                        <div className="flex items-center">
                          {saleType === 'Urgent' ? (
                            <div
                              className="flex items-center"
                              style={{
                                backgroundColor: '#FEF6E9',
                                color: '#F9A825',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 500
                              }}
                            >
                              <span>Urgent</span>
                              <img
                                src={path2Icon}
                                alt=""
                                style={{
                                  width: '15px',
                                  height: '15px',
                                  marginLeft: '7px'
                                }}
                              />
                            </div>
                          ) : (
                            <span style={{ color: saleType ? '#6A6A6A' : '#D9D9D9', fontSize: '0.85rem' }}>
                              {saleType ? saleTypes.find(s => s.value === saleType)?.label : 'Choose type of sale'}
                            </span>
                          )}
                        </div>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: '#6B7280' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isSaleTypeDropdownOpen && (
                        <div
                          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 shadow-lg overflow-hidden"
                          style={{ borderRadius: '12px' }}
                        >
                          {saleTypes.map((type, index) => (
                            <div
                              key={type.value}
                              className={`w-full ${index === 0 ? 'rounded-t-xl' : ''
                                } ${index === saleTypes.length - 1 ? 'rounded-b-xl' : ''
                                }`}
                              style={{
                                backgroundColor: 'transparent'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSaleType(type.value);
                                  setIsSaleTypeDropdownOpen(false);
                                }}
                                className="w-full text-left transition-colors relative flex items-center"
                                style={{
                                  color: type.value === 'Default' ? '#6A6A6A' : '#999999',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  padding: '16px 16px',
                                  fontWeight: 500
                                }}
                              >
                                {saleType === type.value && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '8px',
                                      right: '8px',
                                      top: '4px',
                                      bottom: '4px',
                                      backgroundColor: '#F0F8FE',
                                      borderRadius: '8px',
                                      zIndex: 0
                                    }}
                                  />
                                )}
                                <span style={{ position: 'relative', zIndex: 1 }}>{type.label}</span>
                                {type.icon && (
                                  <img
                                    src={type.icon}
                                    alt=""
                                    style={{
                                      width: '14px',
                                      height: '14px',
                                      position: 'relative',
                                      zIndex: 1,
                                      opacity: 0.7,
                                      marginLeft: '8px'
                                    }}
                                  />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Delivery available */}
                  <div className="py-6">
                    <div className="flex items-center justify-between" style={{ maxWidth: '560px' }}>
                      <div>
                        <label className="block text-sm font-medium" style={{ color: '#6A6A6A' }}>
                          Delivery available
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                          Lorem ipsum dolor sit amet consectutor
                        </p>
                      </div>
                      <button
                        onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${deliveryAvailable ? '' : 'bg-gray-300'
                          }`}
                        style={deliveryAvailable ? { backgroundColor: '#4CD964' } : {}}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${deliveryAvailable ? 'translate-x-5' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Buttons */}
                  <div className="flex items-center justify-center space-x-16 mt-16" style={{ maxWidth: '560px' }}>
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSavingDraft || isPostingListing}
                      className="flex items-center space-x-2 rounded-xl border-2 font-medium transition-colors text-sm"
                      style={{
                        borderColor: (isSavingDraft || isPostingListing) ? '#E9E9E9' : '#F9A825',
                        color: (isSavingDraft || isPostingListing) ? '#B0B0B0' : '#F9A825',
                        paddingLeft: '4rem',
                        paddingRight: '4.5rem',
                        paddingTop: '0.625rem',
                        paddingBottom: '0.625rem',
                        cursor: (isSavingDraft || isPostingListing) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSavingDraft ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#F9A825' }}></div>
                        </div>
                      ) : (
                        <>
                          <span>Save as draft</span>
                          <img src={draft2Icon} alt="Save" className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <button
                      onClick={handlePostListing}
                      disabled={isSavingDraft || isPostingListing || !isFormComplete}
                      className="flex items-center space-x-2 px-16 py-2.5 rounded-xl font-medium transition-colors text-sm"
                      style={{
                        backgroundColor: (isFormComplete && !isSavingDraft && !isPostingListing) ? '#F9A825' : '#E9E9E9',
                        color: (isFormComplete && !isSavingDraft && !isPostingListing) ? '#FFFFFF' : '#6A6A6A',
                        cursor: (isSavingDraft || isPostingListing || !isFormComplete) ? 'not-allowed' : 'pointer',
                        minHeight: '40px',
                        position: 'relative'
                      }}
                    >
                      {isPostingListing ? (
                        <div className="flex items-center justify-center w-full">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        <>
                          <span>Post listing</span>
                          <img
                            src={flyIcon}
                            alt="Post"
                            className="w-4 h-4"
                            style={{
                              filter: (isFormComplete && !isSavingDraft && !isPostingListing) ? 'brightness(0) invert(1)' : 'none'
                            }}
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Notification - "Under Review" Banner - Only show when review is pending */}
          {showNotification && createdProductData?.reviewStatus === 'pending' && (
            <div
              className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] animate-slide-down max-w-[300px] lg:max-w-[350px] w-[calc(100%-32px)]"
            >
              <div
                className="flex items-start space-x-2 lg:space-x-3 p-2.5 lg:p-3 rounded-xl shadow-lg"
                style={{ backgroundColor: '#F5FBFF', border: '1px solid #CFE8FC' }}
              >
                {/* Listing Image */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: '#E3F2FD',
                      border: '2px solid white'
                    }}
                  >
                    {imageUrls[primaryImageIndex] || imageUrls[0] ? (
                      <img
                        src={imageUrls[primaryImageIndex] || imageUrls[0]}
                        alt="Listing"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={avatar} alt="Listing" className="w-5 h-5 lg:w-6 lg:h-6 rounded-full object-cover" />
                    )}
                  </div>
                  {/* Listingtoast Icon Badge - Bottom Right */}
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFF' }}
                  >
                    <img
                      src={listingtoastIcon}
                      alt="Listing"
                      className="w-2.5 h-2.5 lg:w-3 lg:h-3"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] lg:text-xs">
                    <span style={{ color: '#939393' }}>Your listing is </span>
                    <span className="font-semibold" style={{ color: '#212121' }}>under review</span>
                  </p>
                  <p className="text-[11px] lg:text-xs mt-0.5" style={{ color: '#939393' }}>
                    We analyze your listing, Please wait a f.
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                  <svg
                    className="w-3.5 h-3.5 lg:w-4 lg:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: '#6A6A6A' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <style>
                {`
                  @keyframes slide-down {
                    from {
                      transform: translate(-50%, -20px);
                      opacity: 0;
                    }
                    to {
                      transform: translate(-50%, 0);
                      opacity: 1;
                    }
                  }
                  .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                  }
                `}
              </style>
            </div>
          )}

          {/* Success Modal - Centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="bg-white relative rounded-[20px] lg:rounded-[30px] p-8 lg:p-12 max-w-[340px] lg:max-w-[420px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Verity Icon - Top Center */}
              <div className="flex justify-center mb-4 lg:mb-6">
                <img src={verityIcon} alt="Success" className="w-12 h-12 lg:w-16 lg:h-16" />
              </div>

              {/* Title */}
              <h2
                className="text-center mb-2 lg:mb-3 text-lg lg:text-[22px]"
                style={{
                  color: '#212121',
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: '600'
                }}
              >
                Your listing has been registered
              </h2>

              {/* Description */}
              <p
                className="text-center mb-6 lg:mb-8 text-xs lg:text-sm"
                style={{
                  color: '#B0B0B0',
                  lineHeight: '1.5'
                }}
              >
                Lorem ipsum dolor sit amet consectetur. Molestie etiam mattis ornare adipiscing adipiscing.
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Back to Listing Page Button */}
                <button
                  onClick={handleBackToHomepage}
                  className="flex-1 py-2 lg:py-2.5 rounded-xl font-medium transition-colors text-[9px] lg:text-[10px]"
                  style={{
                    backgroundColor: '#F1F1F1',
                    color: '#6A6A6A',
                    borderRadius: '12px'
                  }}
                >
                  Back to listing page ({countdown}s)
                </button>

                {/* Add New Listing Button */}
                <button
                  onClick={handleAddNewListing}
                  className="flex-1 py-2 lg:py-2.5 rounded-xl font-medium transition-colors text-[10px] lg:text-[11px]"
                  style={{
                    backgroundColor: 'white',
                    color: '#F9A825',
                    border: '1px solid #F9A825',
                    borderRadius: '12px'
                  }}
                >
                  Add new listing
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {draftToDelete && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={handleDeleteClose}
          />
          {isMobile ? (
            // Mobile: Bottom sheet
            <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
              <div
                className="bg-white relative w-full"
                style={{
                  borderRadius: '30px',
                  boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                  maxWidth: '420px',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pt-8 px-5 pb-8 relative">
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={handleDeleteClose}
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isDeleteSuccess ? (
                    <>
                      {/* Success Icon */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                        <img
                          src={verityIcon}
                          alt="Success"
                          style={{ width: '80px', height: '80px' }}
                        />
                      </div>

                      {/* Success Text */}
                      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <p
                          style={{
                            color: '#212121',
                            fontFamily: 'Bricolage Grotesque, sans-serif',
                            fontSize: '16px',
                            lineHeight: '1.5',
                            margin: 0
                          }}
                        >
                          The draft "{draftToDelete.title}" has been successfully removed.
                        </p>
                      </div>

                      {/* Close Button */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <button
                          type="button"
                          onClick={handleDeleteClose}
                          style={{
                            backgroundColor: '#F9A825',
                            borderRadius: '12px',
                            border: 'none',
                            padding: isMobile ? '8px 120px' : '10px 140px',
                            cursor: 'pointer',
                            color: '#FFFFFF',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: 300
                          }}
                        >
                          Close
                        </button>
                      </div>

                      {/* Drag Indicator at far bottom */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingBottom: '8px',
                        paddingTop: '4px'
                      }}>
                        <div style={{
                          width: '80px',
                          height: '4px',
                          backgroundColor: '#D9D9D9',
                          borderRadius: '2px'
                        }} />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Delete Icon */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                        <img
                          src={redtrashIcon}
                          alt="Delete"
                          style={{ width: '80px', height: '80px' }}
                        />
                      </div>

                      {/* Title */}
                      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <p
                          style={{
                            color: '#212121',
                            fontFamily: 'Bricolage Grotesque, sans-serif',
                            fontSize: '16px',
                            lineHeight: '1.5',
                            margin: 0,
                            fontWeight: 600
                          }}
                        >
                          The draft "{draftToDelete.title}" will be<br />
                          permanently deleted, do you<br />
                          wish to continue ?
                        </p>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                        <button
                          type="button"
                          onClick={handleDeleteClose}
                          style={{
                            backgroundColor: '#F1F1F1',
                            borderRadius: '12px',
                            border: 'none',
                            padding: isMobile ? '6px 40px' : '8px 48px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                          <span style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '13px' : '14px' }}>Cancel</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmDelete}
                          style={{
                            backgroundColor: '#FF5151',
                            borderRadius: '12px',
                            border: 'none',
                            padding: isMobile ? '6px 40px' : '8px 48px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <img src={trashIcon} alt="Delete" style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px', filter: 'brightness(0) invert(1)' }} />
                          <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '13px' : '14px' }}>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Desktop: Centered Modal
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="bg-white relative rounded-[30px] p-8 max-w-[420px] w-full"
                style={{
                  boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleDeleteClose}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isDeleteSuccess ? (
                  <>
                    {/* Success Icon */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                      <img
                        src={verityIcon}
                        alt="Success"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>

                    {/* Success Text */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                      <p
                        style={{
                          color: '#212121',
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontSize: '16px',
                          lineHeight: '1.5',
                          margin: 0
                        }}
                      >
                        The draft "{draftToDelete.title}" has been successfully removed.
                      </p>
                    </div>

                    {/* Close Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                      <button
                        type="button"
                        onClick={handleDeleteClose}
                        style={{
                          backgroundColor: '#F9A825',
                          borderRadius: '12px',
                          border: 'none',
                          padding: '10px 140px',
                          cursor: 'pointer',
                          color: '#FFFFFF',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontWeight: 300
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Delete Icon */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                      <img
                        src={redtrashIcon}
                        alt="Delete"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>

                    {/* Title */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                      <p
                        style={{
                          color: '#212121',
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          fontSize: '16px',
                          lineHeight: '1.5',
                          margin: 0,
                          fontWeight: 600
                        }}
                      >
                        The draft "{draftToDelete.title}" will be<br />
                        permanently deleted, do you<br />
                        wish to continue ?
                      </p>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                      <button
                        type="button"
                        onClick={handleDeleteClose}
                        style={{
                          backgroundColor: '#F1F1F1',
                          borderRadius: '12px',
                          border: 'none',
                          padding: '8px 48px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        <span style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDelete}
                        style={{
                          backgroundColor: '#FF5151',
                          borderRadius: '12px',
                          border: 'none',
                          padding: '8px 48px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                        <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {renderDraftsModal()}
    </div>
  );
};

export default CreateListing;
