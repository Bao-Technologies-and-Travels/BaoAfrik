import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/pre/logo.png';
import sideIcon from '../assets/images/pre/side.png';
import lilLogo from '../assets/images/pre/lil.png';
import avatarIcon from '../assets/images/pre/avatar.png';
import basketIcon from '../assets/images/pre/basket.png';
import leftIcon from '../assets/images/pre/left.png';
import notificationIcon from '../assets/images/pre/notification.svg';
import settingIcon from '../assets/images/pre/setting.svg';
import arrowDownIcon from '../assets/images/pre/arrow-down.svg';
import messageIcon from '../assets/images/pre/message.svg';
import boxIcon from '../assets/images/pre/box.svg';
import groupIcon from '../assets/images/pre/group.svg';
import frameIcon from '../assets/images/pre/frame.svg';
import podsIcon from '../assets/images/pre/pods.svg';
import profileInactiveIcon from '../assets/images/pre/pc1.svg';
import profileActiveIcon from '../assets/images/pre/pc2.svg';
import securityInactiveIcon from '../assets/images/pre/sc1.svg';
import securityActiveIcon from '../assets/images/pre/sc2.svg';
import languageInactiveIcon from '../assets/images/pre/lc1.svg';
import languageActiveIcon from '../assets/images/pre/lc2.svg';
import notificationInactiveIcon from '../assets/images/pre/n1.svg';
import notificationActiveIcon from '../assets/images/pre/n2.svg';
import verifyIcon from '../assets/images/pre/verify.svg';
import verityIcon from '../assets/images/pre/verity.svg';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import avatar from '../assets/images/logos/avatar.png';
import messageAvatarIcon from '../assets/images/pre/main.png';
import appNotificationIcon from '../assets/images/pre/nof.svg';
import pi1Icon from '../assets/images/pre/pi1.svg';
import pi2Icon from '../assets/images/pre/pi2.svg';
import v1Icon from '../assets/images/pre/v1.svg';
import v2Icon from '../assets/images/pre/v2.svg';
import cameraIcon from '../assets/images/pre/camera.svg';
import locationIcon from '../assets/images/pre/PL.svg';
import pencilIcon from '../assets/images/pre/pencil.svg';
import loadIcon from '../assets/images/pre/load.svg';
import calendarIcon from '../assets/images/pre/calendar.svg';
import zapIcon from '../assets/images/pre/zap1.svg';
import fbIcon from '../assets/images/pre/FB1.svg';
import igIcon from '../assets/images/pre/IG1.svg';
import xIcon from '../assets/images/pre/x.svg';
import deviceIcon from '../assets/images/pre/device.svg';
import mobileIcon from '../assets/images/pre/mobile.svg';
import chromeIcon from '../assets/images/pre/chrome1.svg';
import safariIcon from '../assets/images/pre/safari1.svg';
import edgeIcon from '../assets/images/pre/edge1.svg';
import braveIcon from '../assets/images/pre/brave1.svg';
import unlockIcon from '../assets/images/pre/unlock.svg';
import resetIcon from '../assets/images/pre/reset.svg';
import closeIcon from '../assets/images/pre/CLose.svg';
import updateIcon from '../assets/images/pre/update.svg.svg';
import keyIcon from '../assets/images/pre/key.svg';
import backArrowIcon from '../assets/images/pre/back arrow.svg';

const currencyRates: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  CAD: 1.34,
  GBP: 0.81
};

const translationDictionary: Record<string, Record<string, string>> = {
  fr: {
    "Settings": "Paramètres",
    "Search something ?": "Rechercher...",
    "Profile": "Profil",
    "Security & Privacy": "Sécurité & Confidentialité",
    "Language & Currency": "Langue & Devise",
    "Notifications": "Notifications",
    "Language and Currency": "Langue et devise",
    "Customize your language preferences and currency settings to enhance your shopping experience on BAO' Afrik.":
      "Personnalisez vos préférences linguistiques et monétaires pour améliorer votre expérience d'achat sur BAO' Afrik.",
    "Language Setting": "Paramètre de langue",
    "Control what others are seeing from you on BAO' Afrik.": "Contrôlez ce que les autres voient de vous sur BAO' Afrik.",
    "Currency Preferences": "Préférences de devise",
    "Choose the currency you want to see product prices in.": "Choisissez la devise dans laquelle vous souhaitez voir les prix des produits.",
    "Profile Setting": "Paramètre de profil",
    "Update your profile and control what others see on BAO' Afrik.": "Mettez à jour votre profil et contrôlez ce que les autres voient sur BAO' Afrik.",
    "Personal Information": "Informations personnelles",
    "Location": "Localisation",
    "Description": "Description",
    "Verification": "Vérification",
    "Security & Privacy Setting": "Paramètre de sécurité et confidentialité",
    "Manage your privacy preferences and keep your account secure on BAO' Afrik.": "Gérez vos préférences de confidentialité et gardez votre compte sécurisé sur BAO' Afrik.",
    "Password": "Mot de passe",
    "Your password is weak": "Votre mot de passe est faible",
    "Your password is strong": "Votre mot de passe est fort",
    "Set a password to protect your account.": "Définissez un mot de passe pour protéger votre compte.",
    "Edit": "Modifier",
    "Two step verification": "Vérification en deux étapes",
    "Two-step verification": "Vérification en deux étapes",
    "Enable two-step verification for enhanced security.": "Activez la vérification en deux étapes pour une sécurité renforcée.",
    "How does it work?": "Comment ça marche ?",
    "Sessions": "Sessions",
    "Review your active sessions and sign out of any devices you don't recognize.": "Examinez vos sessions actives et déconnectez-vous de tout appareil que vous ne reconnaissez pas.",
    "Current session": "Session actuelle",
    "Sign Out": "Se déconnecter",
    "Other Sessions": "Autres sessions",
    "Close all inactive sessions": "Fermer toutes les sessions inactives",
    "Show mock session history": "Afficher l'historique des sessions simulées",
    "Hide mock session history": "Masquer l'historique des sessions simulées",
    "Complete your profile": "Complétez votre profil",
    "Setup account": "Configuration du compte",
    "Personnal information": "Informations personnelles",
    "Upload your photo": "Téléchargez votre photo",
    "Verification first step": "Première étape de vérification",
    "Email address": "Adresse e-mail",
    "Phone number": "Numéro de téléphone",
    "Verified": "Vérifié",
    "First level verification": "Vérification de premier niveau",
    "Connect your social media accounts to verify your identity. Connecting at least two accounts will earn you a first-level verified badge.": "Connectez vos comptes de réseaux sociaux pour vérifier votre identité. La connexion d'au moins deux comptes vous permettra d'obtenir un badge de vérification de premier niveau.",
    "Full name": "Nom complet",
    "Gender": "Genre",
    "Birthday": "Anniversaire",
    "Save": "Enregistrer",
    "Cancel": "Annuler",
    "Male": "Homme",
    "Female": "Femme",
    "Other": "Autre",
    "Select gender": "Sélectionner le genre",
    "Enter your email address": "Entrez votre adresse e-mail",
    "Enter your phone number": "Entrez votre numéro de téléphone",
    "Change mail address": "Changer l'adresse e-mail",
    "Can you tell us more about yourself ?": "Pouvez-vous nous en dire plus sur vous ?",
    "Save biographie": "Enregistrer la biographie",
    "Geolocation": "Géolocalisation",
    "English": "Anglais",
    "French": "Français",
    "German": "Allemand",
    "Spanish": "Espagnol",
    "Whatsapp": "WhatsApp",
    "Connect with your Whatsapp account": "Connectez votre compte WhatsApp",
    "Facebook": "Facebook",
    "Connect with your Facebook account": "Connectez votre compte Facebook",
    "Instagram": "Instagram",
    "Connect with your Instagram account": "Connectez votre compte Instagram",
    "X": "X",
    "Connect with your X account": "Connectez votre compte X",
    "LinkedIn": "LinkedIn",
    "Connect with your LinkedIn account": "Connectez votre compte LinkedIn"
  }
};

declare global {
  interface Window {
    baoCurrencyPreference?: string;
    baoLanguagePreference?: string;
    baoConvertPrice?: (amountInUSD: number) => number;
    baoFormatPrice?: (amountInUSD: number) => string;
  }
}

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [languagePreference, setLanguagePreference] = useState<'en' | 'fr' | 'de' | 'es'>(() => {
    return (localStorage.getItem('languagePreference') as 'en' | 'fr' | 'de' | 'es') || 'en';
  });
  const [currencyPreference, setCurrencyPreference] = useState<'USD' | 'EUR' | 'CAD' | 'GBP'>(() => {
    return (localStorage.getItem('currencyPreference') as 'USD' | 'EUR' | 'CAD' | 'GBP') || 'USD';
  });
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [activeTab, setActiveTab] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [twoFactorModalStep, setTwoFactorModalStep] = useState<'email' | 'phone' | 'code' | 'success'>('email');
  const [twoFactorEmail, setTwoFactorEmail] = useState('');
  const [twoFactorPassword, setTwoFactorPassword] = useState('');
  const [twoFactorPhone, setTwoFactorPhone] = useState('');
  const [twoFactorSelectedPhoneCode, setTwoFactorSelectedPhoneCode] = useState({
    label: 'United States',
    code: '+1',
    flag: 'us'
  });
  const [isTwoFactorPhoneCodeDropdownOpen, setIsTwoFactorPhoneCodeDropdownOpen] = useState(false);
  const [twoFactorVerificationCode, setTwoFactorVerificationCode] = useState(['', '', '', '', '', '']);
  const [twoFactorCountdown, setTwoFactorCountdown] = useState(60);
  const [canResendTwoFactorCode, setCanResendTwoFactorCode] = useState(false);
  const twoFactorModalRef = useRef<HTMLDivElement>(null);
  const twoFactorPhoneCodeDropdownRef = useRef<HTMLDivElement>(null);
  const twoFactorCodeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [biography, setBiography] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedSidebarOption, setSelectedSidebarOption] = useState<'profile' | 'security' | 'language' | 'notifications'>('profile');
  const pageRef = useRef<HTMLDivElement>(null);
  const originalTextMap = useRef<WeakMap<Text, string>>(new WeakMap());
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const [isBirthdayCalendarOpen, setIsBirthdayCalendarOpen] = useState(false);
  const birthdayCalendarRef = useRef<HTMLDivElement>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // Profile editing state
  const [profileData, setProfileData] = useState({
    fullName: 'Jean Kameni',
    gender: 'Male',
    birthday: '13/09/2000'
  });
  
  // Image upload state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const genderOptions = ['Male', 'Female', 'Other'];
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  const [verificationForm, setVerificationForm] = useState({
    email: 'google.mail@gmail.com',
    phone: ''
  });
  // Notifications state
  const [allNotificationsEnabled, setAllNotificationsEnabled] = useState(false);
  const [generalNotifications, setGeneralNotifications] = useState({
    enabled: false,
    reviewsAndRates: { push: true, email: false, inApp: true },
    subscriptionRenewal: { push: false, email: false, inApp: true }
  });
  const [messagesNotifications, setMessagesNotifications] = useState({
    enabled: false,
    messages: { push: false, email: false, inApp: false },
    messageReminders: { push: false, email: false, inApp: false },
    chatRequests: { push: false, email: false, inApp: false }
  });
  const [newsNotifications, setNewsNotifications] = useState({
    enabled: false,
    newsletter: { push: false, email: false, inApp: false },
    dailyRecommendations: { push: false, email: false, inApp: false }
  });

  const [selectedPhoneCode, setSelectedPhoneCode] = useState({
    label: 'United States',
    code: '+1',
    flag: 'us'
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  
  // Calculate profile completion progress
  const calculateProfileProgress = () => {
    let progress = 10; // Setup account (always complete when logged in)
    
    // Personal information (10%) - check if fullName, gender, and birthday are filled
    if (profileData.fullName && profileData.fullName.trim() !== '' && 
        profileData.gender && profileData.gender.trim() !== '' && 
        profileData.birthday && profileData.birthday.trim() !== '') {
      progress += 10;
    }
    
    // Upload photo (10%) - check if profileImage is set
    if (profileImage) {
      progress += 10;
    }
    
    // Location (10%) - check if geolocation is enabled
    if (isGeolocationEnabled) {
      progress += 10;
    }
    
    // Description (10%) - check if biography is filled
    if (biography && biography.trim() !== '') {
      progress += 10;
    }
    
    // Verification first step (25%) - check if email is verified (has verified badge)
    // For now, we'll check if email field has a value and assume it's verified if it exists
    // In real implementation, this should check actual verification status from backend
    if (verificationForm.email && verificationForm.email.trim() !== '') {
      progress += 25;
    }
    
    return Math.min(progress, 100);
  };
  
  // Calculate profile completion progress and check criteria (recalculated on every render)
  const profileProgress = useMemo(() => calculateProfileProgress(), [profileData, profileImage, isGeolocationEnabled, biography, verificationForm.email]);
  
  const isPersonalInfoComplete = useMemo(() => 
    profileData.fullName && profileData.fullName.trim() !== '' && 
    profileData.gender && profileData.gender.trim() !== '' && 
    profileData.birthday && profileData.birthday.trim() !== '', 
    [profileData]
  );
  const isPhotoUploaded = useMemo(() => !!profileImage, [profileImage]);
  const isLocationSet = useMemo(() => isGeolocationEnabled, [isGeolocationEnabled]);
  const isDescriptionComplete = useMemo(() => biography && biography.trim() !== '', [biography]);
  const isVerificationComplete = useMemo(() => verificationForm.email && verificationForm.email.trim() !== '', [verificationForm.email]);
  const [isPhoneCodeDropdownOpen, setIsPhoneCodeDropdownOpen] = useState(false);
  const phoneCodes = [
    { label: 'United States', code: '+1', flag: 'us' },
    { label: 'United Kingdom', code: '+44', flag: 'gb' },
    { label: 'France', code: '+33', flag: 'fr' },
    { label: 'Cameroon', code: '+237', flag: 'cm' },
    { label: 'South Africa', code: '+27', flag: 'za' },
    { label: 'Algeria', code: '+213', flag: 'dz' },
    { label: 'Angola', code: '+244', flag: 'ao' },
    { label: 'Benin', code: '+229', flag: 'bj' },
    { label: 'Congo', code: '+242', flag: 'cg' },
    { label: 'Gabon', code: '+241', flag: 'ga' }
  ];

  const [socialConnections, setSocialConnections] = useState({
    whatsapp: false,
    facebook: false,
    instagram: false,
    linkedin: false,
    x: false
  });
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  
  // Sessions state
  const [sessions, setSessions] = useState([
    {
      id: 1,
      browser: 'Chrome Browser',
      icon: chromeIcon,
      device: 'DESKTOP-6R899ET',
      location: 'London, United Kingdom',
      flag: 'gb',
      isCurrent: true
    }
  ]);

  const [inactiveSessions, setInactiveSessions] = useState([
    {
      id: 2,
      browser: 'Safari Browser',
      icon: safariIcon,
      device: 'iPhone 15 Pro',
      location: 'London, United Kingdom',
      flag: 'gb',
      lastUsed: '1 month ago'
    },
    {
      id: 3,
      browser: 'Edge Browser',
      icon: edgeIcon,
      device: 'DESKTOP-6R899ET',
      location: 'Montpellier, France',
      flag: 'fr',
      lastUsed: 'Tue, 4 July 2025'
    },
    {
      id: 4,
      browser: 'Brave Browser',
      icon: braveIcon,
      device: 'A3113 MacBook Air M3',
      location: 'Chicago, United States',
      flag: 'us',
      lastUsed: 'Mon, 20 May 2025'
    }
  ]);
  
  // Password section state
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'strong'>('weak'); // Change to 'strong' to test
  const [isPasswordEditClicked, setIsPasswordEditClicked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedPasswordOption, setSelectedPasswordOption] = useState<string | null>(null);
  const passwordModalRef = useRef<HTMLDivElement>(null);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
  const [passwordModalStep, setPasswordModalStep] = useState<'current' | 'new' | 'success'>('current');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const socialPlatforms = [
    {
      key: 'whatsapp',
      name: 'Whatsapp',
      description: 'Connect with your Whatsapp account',
      icon: zapIcon
    },
    {
      key: 'facebook',
      name: 'Facebook',
      description: 'Connect with your Facebook account',
      icon: fbIcon
    },
    {
      key: 'instagram',
      name: 'Instagram',
      description: 'Connect with your Instagram account',
      icon: igIcon
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect with your LinkedIn account',
      icon: null
    },
    {
      key: 'x',
      name: 'X',
      description: 'Connect with your X account',
      icon: xIcon
    }
  ] as const;

  // Helper function to check if device is mobile
  const isMobileDevice = (deviceName: string) => {
    const mobileKeywords = ['iPhone', 'iPad', 'Android', 'Mobile', 'Phone'];
    return mobileKeywords.some(keyword => deviceName.toLowerCase().includes(keyword.toLowerCase()));
  };

  // Handler functions for sessions
  const handleSignOutSession = (sessionId: number) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const handleSignOutInactiveSession = (sessionId: number) => {
    setInactiveSessions(inactiveSessions.filter(session => session.id !== sessionId));
  };

  const handleCloseAllInactiveSessions = () => {
    setInactiveSessions([]);
  };
  
  const leftPaneClasses = isMobile
    ? 'flex-1 w-full'
    : (selectedSidebarOption === 'security' || selectedSidebarOption === 'language' || selectedSidebarOption === 'notifications')
      ? 'flex-1 w-full px-0'
      : 'flex-1 bg-white border border-gray-200 rounded-[20px] px-8';

  const mainLayoutClasses = isMobile
    ? 'flex-1 flex flex-col px-4 pt-4 pb-6 gap-4'
    : 'flex-1 mx-8 mt-8 mb-0 flex gap-6';

const mainLayoutStyle = isMobile ? undefined : { minHeight: 'calc(100vh - 140px)', maxHeight: 'calc(100vh - 140px)' };

const isMobileProfileView = isMobile && !isMobileSidebarVisible && selectedSidebarOption === 'profile';
const isMobileSecurityView = isMobile && !isMobileSidebarVisible && selectedSidebarOption === 'security';
const shouldShowSessionHistory = isMobileSecurityView ? true : showSessionHistory;
  
  // Mock notification data with read/unread status
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', isRead: false, sender: 'Nadine Ngum', text: 'sent you a message', subText: 'Click to view', time: '19 min ago', day: 'Today' },
    { id: 2, type: 'app', isRead: false, text: 'Your profile has been updated,', subText: 'you are now...', subText2: 'Invoice 6 August 2025 Sequence: 2-7480...', time: '2 hrs ago', day: 'Today' },
    { id: 3, type: 'message', isRead: true, text: 'New Reviews and Rates from Nadine Ngum...', subText: '"I recently purchased a beautiful Kente...', time: '17:12', day: 'Yesterday' },
    { id: 4, type: 'app', isRead: true, text: 'New post alert', subText: 'A new listing regarding your recent search...', time: '14:57', day: 'Yesterday' },
    { id: 5, type: 'message', isRead: true, sender: 'Elidiana IKE', text: 'sent you a message', subText: 'See more details', time: '11:31', day: 'Yesterday' },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (notificationTab === 'all') return true;
    if (notificationTab === 'unread') return !notif.isRead;
    if (notificationTab === 'messages') return notif.type === 'message';
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  const languageOptions = useMemo(
    () => [
      { code: 'en', label: 'English', flag: 'gb' },
      { code: 'fr', label: 'French', flag: 'fr' },
      { code: 'de', label: 'Deushland', flag: 'de' },
      { code: 'es', label: 'Spanish', flag: 'es' }
    ],
    []
  );

  const currencyOptions = useMemo(
    () => [
      { code: 'USD', flag: 'us', name: 'United States Dollar' },
      { code: 'EUR', flag: 'eu', name: 'Euro' },
      { code: 'CAD', flag: 'ca', name: 'Canadian Dollar' },
      { code: 'GBP', flag: 'gb', name: 'British Pound' }
    ],
    []
  );

  const convertPrice = useCallback(
    (amountInUSD: number) => {
      const rate = currencyRates[currencyPreference] ?? 1;
      return amountInUSD * rate;
    },
    [currencyPreference]
  );

  const formatPrice = useCallback(
    (amountInUSD: number) => {
      const converted = convertPrice(amountInUSD);
      return new Intl.NumberFormat(languagePreference === 'fr' ? 'fr-FR' : 'en-US', {
        style: 'currency',
        currency: currencyPreference
      }).format(converted);
    },
    [convertPrice, currencyPreference, languagePreference]
  );

  const sidebarOptions = [
    {
      value: 'profile',
      label: 'Profile',
      activeIcon: profileActiveIcon,
      inactiveIcon: profileInactiveIcon
    },
    {
      value: 'security',
      label: 'Security & Privacy',
      activeIcon: securityActiveIcon,
      inactiveIcon: securityInactiveIcon
    },
    {
      value: 'language',
      label: 'Language & Currency',
      activeIcon: languageActiveIcon,
      inactiveIcon: languageInactiveIcon
    },
    {
      value: 'notifications',
      label: 'Notifications',
      activeIcon: notificationActiveIcon,
      inactiveIcon: notificationInactiveIcon
    }
  ] as const;

  const handleHomepageClick = () => {
    navigate('/', { replace: false });
  };

  const handleMenuClick = () => {
    navigate('/', { 
      replace: false,
      state: { 
        openMenu: true
      }
    });
  };

  const handleSettingsClick = () => {
    navigate('/', { 
      replace: false,
      state: { 
        openMenu: true,
        highlightSettings: true
      }
    });
  };

  useEffect(() => {
    const shortCode = languagePreference === 'fr' ? 'FR' : languagePreference === 'de' ? 'DE' : languagePreference === 'es' ? 'ES' : 'EN';
    setSelectedLanguage(shortCode);
  }, [languagePreference]);

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    if (lang === 'EN') {
      setLanguagePreference('en');
    } else if (lang === 'FR') {
      setLanguagePreference('fr');
    }
    setIsLanguageDropdownOpen(false);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsImageLoading(false);
            const reader = new FileReader();
            reader.onloadend = () => {
              setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle profile save
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    setIsGenderDropdownOpen(false);
    setIsBirthdayCalendarOpen(false);
  };

  const handleVerificationInput = (field: 'email' | 'phone', value: string) => {
    setVerificationForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneCodeSelect = (code: { label: string; flag: string; code: string }) => {
    setSelectedPhoneCode(code);
    setIsPhoneCodeDropdownOpen(false);
  };

  const handleSocialToggle = (key: keyof typeof socialConnections) => {
    setSocialConnections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordEditClick = () => {
    setIsPasswordEditClicked(true);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordOptionClick = (option: string) => {
    setSelectedPasswordOption(option);
    if (option === 'close') {
      setIsPasswordModalOpen(false);
      setIsPasswordEditClicked(false);
      setSelectedPasswordOption(null);
    } else if (option === 'update') {
      setIsPasswordModalOpen(false);
      setIsUpdatePasswordModalOpen(true);
      setPasswordModalStep('current');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setSelectedPasswordOption(null);
    } else if (option === 'reset') {
      setIsPasswordModalOpen(false);
      setIsPasswordEditClicked(false);
      setSelectedPasswordOption(null);
      // Navigate to forgot password flow with flag indicating it's from profile settings
      navigate('/forgot-password', { 
        state: { 
          fromProfileSettings: true 
        } 
      });
    }
  };

  const handleCloseUpdatePasswordModal = () => {
    setIsUpdatePasswordModalOpen(false);
    setIsPasswordEditClicked(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordModalStep('current');
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleCloseTwoFactorModal = () => {
    setIsTwoFactorModalOpen(false);
    // If closing from the initial step, reset the toggle to default
    if (twoFactorModalStep === 'email') {
      setIsTwoFactorEnabled(false);
    }
    setTwoFactorModalStep('email');
    setTwoFactorEmail('');
    setTwoFactorPassword('');
    setTwoFactorPhone('');
    setTwoFactorVerificationCode(['', '', '', '', '', '']);
    setTwoFactorSelectedPhoneCode({
      label: 'United States',
      code: '+1',
      flag: 'us'
    });
    setTwoFactorCountdown(60);
    setCanResendTwoFactorCode(false);
  };

  const handleTwoFactorEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorModalStep('phone');
  };

  const handleTwoFactorPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorModalStep('code');
    setTwoFactorCountdown(60);
    setCanResendTwoFactorCode(false);
  };

  const handleTwoFactorResendCode = () => {
    if (!canResendTwoFactorCode) return;
    setTwoFactorCountdown(60);
    setCanResendTwoFactorCode(false);
    // TODO: Implement resend API call
  };

  const handleTwoFactorCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorModalStep('success');
  };

  const handleTwoFactorCodeInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...twoFactorVerificationCode];
    newCode[index] = value;
    setTwoFactorVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      twoFactorCodeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleTwoFactorCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !twoFactorVerificationCode[index] && index > 0) {
      twoFactorCodeInputRefs.current[index - 1]?.focus();
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseBirthday = (value: string) => {
    const [day, month, year] = value.split('/');
    if (!day || !month || !year) return null;
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const handleGenderSelect = (gender: string) => {
    setProfileData(prev => ({ ...prev, gender }));
    setIsGenderDropdownOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const openBirthdayCalendar = () => {
    const parsed = parseBirthday(profileData.birthday);
    if (parsed) {
      setCalendarDate(parsed);
    }
    setIsBirthdayCalendarOpen(true);
  };

  const generateCalendarDays = () => {
    const startOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const endOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= endOfMonth.getDate(); day++) {
      days.push(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest('.language-selector');
      const menuDropdown = target.closest('.menu-dropdown');
      const notificationDropdown = target.closest('.notification-dropdown');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }

      if (!menuDropdown && isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }

      if (!notificationDropdown && isNotificationOpen) {
        setIsNotificationOpen(false);
      }

      if (genderDropdownRef.current && !genderDropdownRef.current.contains(target) && isGenderDropdownOpen) {
        setIsGenderDropdownOpen(false);
      }

      if (birthdayCalendarRef.current && !birthdayCalendarRef.current.contains(target) && isBirthdayCalendarOpen) {
        setIsBirthdayCalendarOpen(false);
      }

      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(target) && isPhoneCodeDropdownOpen) {
        setIsPhoneCodeDropdownOpen(false);
      }

      if (passwordModalRef.current && !passwordModalRef.current.contains(target) && isPasswordModalOpen) {
        setIsPasswordModalOpen(false);
        setIsPasswordEditClicked(false);
        setSelectedPasswordOption(null);
      }

      if (twoFactorModalRef.current && !twoFactorModalRef.current.contains(target) && isTwoFactorModalOpen) {
        if (!twoFactorPhoneCodeDropdownRef.current?.contains(target)) {
          setIsTwoFactorModalOpen(false);
          setTwoFactorModalStep('email');
          setTwoFactorEmail('');
          setTwoFactorPassword('');
          setTwoFactorPhone('');
          setTwoFactorVerificationCode(['', '', '', '', '', '']);
        }
      }

      if (twoFactorPhoneCodeDropdownRef.current && !twoFactorPhoneCodeDropdownRef.current.contains(target) && isTwoFactorPhoneCodeDropdownOpen) {
        setIsTwoFactorPhoneCodeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isMenuDropdownOpen, isNotificationOpen, isGenderDropdownOpen, isBirthdayCalendarOpen, isPhoneCodeDropdownOpen, isPasswordModalOpen, isTwoFactorModalOpen, isTwoFactorPhoneCodeDropdownOpen]);

  // Handle navigation state to set selected sidebar option
  useEffect(() => {
    if (location.state?.selectedSidebarOption) {
      setSelectedSidebarOption(location.state.selectedSidebarOption);
      // If navigating to security view on mobile, ensure sidebar is hidden
      if (isMobile && location.state.selectedSidebarOption === 'security' && location.state.fromTwoFactorSuccess) {
        setIsMobileSidebarVisible(false);
      }
    }
  }, [location.state, isMobile]);

  useEffect(() => {
    localStorage.setItem('currencyPreference', currencyPreference);
    window.baoCurrencyPreference = currencyPreference;
    window.baoConvertPrice = convertPrice;
    window.baoFormatPrice = formatPrice;
    window.dispatchEvent(
      new CustomEvent('baoCurrencyChange', {
        detail: {
          currency: currencyPreference
        }
      })
    );
  }, [currencyPreference, convertPrice, formatPrice]);

  useEffect(() => {
    localStorage.setItem('languagePreference', languagePreference);
    window.baoLanguagePreference = languagePreference;
    document.documentElement.lang = languagePreference === 'fr' ? 'fr' : 'en';
    window.dispatchEvent(
      new CustomEvent('baoLanguageChange', {
        detail: {
          language: languagePreference
        }
      })
    );
  }, [languagePreference]);

  useEffect(() => {
    if (!pageRef.current) {
      return;
    }
    // Small delay to ensure DOM is updated after tab switches
    const timeoutId = setTimeout(() => {
      if (!pageRef.current) return;
      const dictionary = translationDictionary[languagePreference];
      const walker = document.createTreeWalker(pageRef.current, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
      }
      // Process all text nodes
      textNodes.forEach((textNode) => {
        const currentOriginal =
          originalTextMap.current.get(textNode) ?? (textNode.textContent ? textNode.textContent : '');
        if (!originalTextMap.current.has(textNode)) {
          originalTextMap.current.set(textNode, currentOriginal);
        }
        const trimmed = currentOriginal.trim();
        if (!trimmed) return;
        const translation = dictionary ? dictionary[trimmed] : undefined;
        if (languagePreference === 'fr' && translation) {
          textNode.textContent = translation;
        } else if (languagePreference === 'en') {
          // Restore original text when switching back to English
          textNode.textContent = currentOriginal;
        }
      });
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [languagePreference, selectedSidebarOption]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile((prev) => {
        if (mobile && !prev) {
          setIsMobileSidebarVisible(true);
        }
        if (!mobile) {
          setIsMobileSidebarVisible(false);
        }
        return mobile;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handler for standalone "Switch on all"
  const handleAllNotificationsToggle = () => {
    const newValue = !allNotificationsEnabled;
    setAllNotificationsEnabled(newValue);
    
    // Toggle all notifications in all sections
    setGeneralNotifications({
      enabled: newValue,
      reviewsAndRates: { push: newValue, email: newValue, inApp: newValue },
      subscriptionRenewal: { push: newValue, email: newValue, inApp: newValue }
    });
    
    setMessagesNotifications({
      enabled: newValue,
      messages: { push: newValue, email: newValue, inApp: newValue },
      messageReminders: { push: newValue, email: newValue, inApp: newValue },
      chatRequests: { push: newValue, email: newValue, inApp: newValue }
    });
    
    setNewsNotifications({
      enabled: newValue,
      newsletter: { push: newValue, email: newValue, inApp: newValue },
      dailyRecommendations: { push: newValue, email: newValue, inApp: newValue }
    });
  };

  // Handler for General Notifications "Switch on all"
  const handleGeneralNotificationsToggle = () => {
    const newValue = !generalNotifications.enabled;
    setGeneralNotifications({
      enabled: newValue,
      reviewsAndRates: { push: newValue, email: newValue, inApp: newValue },
      subscriptionRenewal: { push: newValue, email: newValue, inApp: newValue }
    });
  };

  // Handler for Messages Notifications "Switch on all"
  const handleMessagesNotificationsToggle = () => {
    const newValue = !messagesNotifications.enabled;
    setMessagesNotifications({
      enabled: newValue,
      messages: { push: newValue, email: newValue, inApp: newValue },
      messageReminders: { push: newValue, email: newValue, inApp: newValue },
      chatRequests: { push: newValue, email: newValue, inApp: newValue }
    });
  };

  // Handler for News Notifications "Switch on all"
  const handleNewsNotificationsToggle = () => {
    const newValue = !newsNotifications.enabled;
    setNewsNotifications({
      enabled: newValue,
      newsletter: { push: newValue, email: newValue, inApp: newValue },
      dailyRecommendations: { push: newValue, email: newValue, inApp: newValue }
    });
  };

  // Sync standalone toggle state with individual section states
  useEffect(() => {
    const allEnabled = 
      generalNotifications.enabled &&
      messagesNotifications.enabled &&
      newsNotifications.enabled;
    
    if (allEnabled !== allNotificationsEnabled) {
      setAllNotificationsEnabled(allEnabled);
    }
  }, [generalNotifications.enabled, messagesNotifications.enabled, newsNotifications.enabled]);

  const renderMobileSidebar = () => (
    <div className="fixed inset-0 z-50 bg-white px-5 pt-6 pb-10 overflow-y-auto lg:hidden">
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => setIsMobileSidebarVisible(false)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <img src={backArrowIcon} alt="Back" className="w-4 h-4" />
        </button>
        <p className="text-base font-semibold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', color: '#171717' }}>
          Setting
        </p>
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

      <div className="space-y-3">
        {sidebarOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setSelectedSidebarOption(option.value);
              setIsMobileSidebarVisible(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ color: '#6F6F6F' }}
          >
            <div className="flex items-center gap-3">
              <img src={option.inactiveIcon} alt={option.label} className="w-5 h-5" />
              <span className="text-sm font-medium">{option.label}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L15 12L9 18" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .profile-edit-input::placeholder {
          color: #BABABA !important;
        }
        .profile-edit-input-birthday::placeholder {
          color: #BABABA !important;
        }
        .verification-input::placeholder {
          color: #D9D9D9 !important;
        }
      `}</style>
    <div
      ref={pageRef}
      className={`min-h-screen ${(isMobileProfileView || isMobileSecurityView) ? 'bg-white' : 'bg-gray-50'}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {isMobile && isMobileSidebarVisible && renderMobileSidebar()}
      {(!isMobile || !isMobileSidebarVisible) && (
      <div className={`flex ${isMobile ? 'flex-col min-h-screen' : 'h-screen'}`}>
        {/* Left Sidebar - Full Height */}
        <div className={`w-72 bg-white border-r-2 border-gray-300 flex-col h-screen sticky top-0 relative ${isMobile ? 'hidden' : 'flex'}`}>
          {/* Header */}
          <header className={`bg-white ${isMobile ? 'hidden' : ''}`}>
            <div className="w-full pl-6 pr-0 sm:pl-6 sm:pr-2 lg:pl-6 lg:pr-4">
              <div className="flex items-center justify-between h-16">
                {/* Desktop - Logo and sidebar button */}
                <div className="flex items-center justify-between w-full">
                  <img 
                    src={logo} 
                    alt="bao'Afrik" 
                    className="h-8 w-auto"
                  />
                  <button className="bg-white hover:bg-gray-50 rounded-lg transition-colors w-10 h-10 flex items-center justify-center ml-auto">
                    <img 
                      src={sideIcon} 
                      alt="Minimize sidebar" 
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Settings Navigation */}
          <div className="flex-1 flex flex-col pt-6 pl-6 pr-0">
            {/* Settings Title */}
            <h1 className="text-2xl font-medium text-gray-900 mb-6">Settings</h1>
            
            {/* Search Bar */}
            <div className="relative mb-6 pr-6">
              <style>
                {`
                  .sidebar-search::placeholder {
                    color: #B2B2B2;
                  }
                `}
              </style>
              <input
                type="text"
                placeholder="Search something?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 sidebar-search"
                style={{ backgroundColor: '#F1F1F1', color: '#B2B2B2' }}
              />
            </div>

            {/* Navigation Items */}
            <div className="space-y-1">
              {sidebarOptions.map((option) => {
                const isActive = selectedSidebarOption === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedSidebarOption(option.value)}
                    type="button"
                    className="w-full flex items-center space-x-3 pl-3 pr-0 py-2 rounded-l-lg rounded-r-none transition-colors"
                    style={{
                      backgroundColor: isActive ? '#F0F8FE' : 'transparent',
                      borderRight: isActive ? '2px solid #64B5F6' : '2px solid transparent',
                      marginRight: isActive ? '-2px' : '0'
                    }}
                  >
                    <img
                      src={isActive ? option.activeIcon : option.inactiveIcon}
                      alt={option.label}
                      className="w-5 h-5"
                    />
                    <span
                      className="text-sm font-medium text-left"
                      style={{ color: isActive ? '#64B5F6' : '#939393' }}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`bg-gray-50 ${isMobile ? 'hidden' : ''}`}>
            <div className="w-full pl-6 pr-4 sm:pl-6 sm:pr-6 lg:pl-6 lg:pr-8">
              <div className="flex items-center justify-between h-16">
                {/* Center - Breadcrumb */}
                <div className="hidden md:flex items-center space-x-3 text-[10px] md:text-xs">
                  <img 
                    src={leftIcon} 
                    alt="Back" 
                    className="w-4 h-4 cursor-pointer mr-2"
                    onClick={handleHomepageClick}
                  />
                  <span 
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={handleHomepageClick}
                  >
                    Homepage
                  </span>
                  <span className="mx-3" style={{ color: '#D4D4D4' }}>·</span>
                  <span 
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={handleMenuClick}
                  >
                    Menu
                  </span>
                  <span className="mx-3" style={{ color: '#D4D4D4' }}>·</span>
                  <span 
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={handleSettingsClick}
                  >
                    Settings
                  </span>
                  <span className="mx-3" style={{ color: '#D4D4D4' }}>·</span>
                  <span className="text-gray-900 font-medium">
                    {selectedSidebarOption === 'profile' && 'Profile Setting'}
                    {selectedSidebarOption === 'security' && 'Security & Privacy'}
                    {selectedSidebarOption === 'language' && 'Language & Currency'}
                    {selectedSidebarOption === 'notifications' && 'Notifications Settings'}
                  </span>
                </div>

                {/* Right side - Language, button, profile, notifications */}
                <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg">
                  {/* Language Selector */}
                  <div className="relative language-selector">
                    <button 
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center px-2.5 py-1 border rounded-lg bg-white text-sm font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      style={{ borderColor: '#E4E4E4', color: '#BABABA' }}
                    >
                      {selectedLanguage}
                      <img src={arrowDownIcon} alt="Arrow" className="ml-1 w-4 h-4" />
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
                      {unreadCount > 0 && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF0000' }}>
                          <span className="text-white font-medium" style={{ fontSize: '9px' }}>{unreadCount}</span>
                        </div>
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
                                
                                {dayNotifs.map((notif) => (
                                  <div key={notif.id} className="transition-colors cursor-pointer" style={{ backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF' }}>
                                    <div className="flex items-start space-x-2 py-2 px-6">
                                      <div className="relative flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: notif.type === 'message' ? '#E3F2FD' : '#F9A825', border: '2px solid white' }}>
                                          {notif.type === 'message' ? (
                                            <img src={avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                                          ) : (
                                            <img src={logoIcon} alt="Logo" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
                                          )}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF' }}>
                                          <img src={notif.type === 'message' ? messageAvatarIcon : appNotificationIcon} alt="Icon" className="w-3 h-3" />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1 min-w-0">
                                            {notif.sender ? (
                                              <p style={{ fontSize: '11px' }}>
                                                <span className="font-semibold" style={{ color: notif.isRead ? '#939393' : '#616161' }}>{notif.sender}</span> <span style={{ color: '#939393' }}>{notif.text}</span>
                                              </p>
                                            ) : (
                                              <p className={notif.id === 2 && !notif.isRead ? 'font-semibold' : ''} style={{ color: notif.isRead ? '#939393' : '#616161', fontSize: '11px' }}>{notif.text}</p>
                                            )}
                                            {notif.subText && (
                                              <p className={notif.id === 1 ? 'mt-0.5' : 'text-xs mt-0.5'} style={{ color: notif.id === 1 && !notif.isRead ? '#64B5F6' : '#9E9E9E', fontSize: notif.id === 1 ? '11px' : '10px' }}>{notif.subText}</p>
                                            )}
                                            {notif.subText2 && (
                                              <p className="text-xs mt-0.5" style={{ color: '#9E9E9E', fontSize: '10px' }}>{notif.subText2}</p>
                                            )}
                                          </div>
                                          <div className="flex flex-col items-end ml-2 flex-shrink-0" style={{ gap: notif.isRead ? '2px' : '4px' }}>
                                            <button className="text-gray-400 hover:text-gray-600">
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <circle cx="6" cy="12" r="1.5"/>
                                                <circle cx="12" cy="12" r="1.5"/>
                                                <circle cx="18" cy="12" r="1.5"/>
                                              </svg>
                                            </button>
                                            {notif.isRead ? (
                                              <span className="text-xs" style={{ color: '#9E9E9E', fontSize: '10px' }}>{notif.time}</span>
                                            ) : (
                                              <div className="flex items-center space-x-1" style={{ marginTop: notif.id === 2 ? '16px' : '6px' }}>
                                                <span style={{ color: '#9E9E9E', fontSize: '9px' }}>{notif.time}</span>
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#64B5F6' }} />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {notif.id !== dayNotifs[dayNotifs.length - 1].id && <div className="border-b border-gray-100" />}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

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

          {/* Main Content */}
          <div className={`${mainLayoutClasses} ${isMobile ? '' : 'overflow-hidden'}`} style={mainLayoutStyle}>
            {/* Left Content Area */}
            <div className={`${leftPaneClasses} py-4 overflow-y-auto scrollbar-hide`}>
             {(isMobileProfileView || isMobileSecurityView) && (
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarVisible(true)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                    style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
                    aria-label="Back to menu"
                  >
                    <img src={backArrowIcon} alt="Back" className="w-4 h-4" />
                  </button>
                  <div className="w-10" />
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
             )}
              {selectedSidebarOption === 'profile' && (
                <>
              {/* Section Header */}
                <div className={`${isMobileProfileView ? '' : 'bg-white'} p-2 mb-3`}>
                <div className="mb-2">
                <h1
                  className={`${isMobileProfileView ? 'text-base' : 'text-sm'} font-semibold text-gray-900 mb-0.5`}
                    style={{ fontFamily: isMobileProfileView ? 'Bricolage Grotesque, sans-serif' : undefined, color: isMobileProfileView ? '#171717' : undefined }}
                >
                  Profile Setting
                </h1>
                <p className="text-[10px]" style={{ color: '#BABABA' }}>
                  Update your profile and control what others see on BAO' Afrik.
                </p>
              </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div
                className={`flex items-center space-x-4 mb-2 border-b border-gray-200 ${
                  isMobileProfileView ? '-mx-4 px-4' : isMobile ? '' : '-mx-8 px-8'
                }`}
              >
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center space-x-1.5 pb-2 relative ${
                    activeTab === 'personal' ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderBottomColor: activeTab === 'personal' ? '#64B5F6' : 'transparent'
                  }}
                >
                  <img 
                    src={activeTab === 'personal' ? pi2Icon : pi1Icon} 
                    alt="Personal Information" 
                    className="w-4 h-4"
                  />
                  <span className="text-xs font-normal" style={{ color: activeTab === 'personal' ? '#64B5F6' : '#B0B0B0' }}>
                    Personal Information
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`flex items-center space-x-1.5 pb-2 relative ${
                    activeTab === 'verification' ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderBottomColor: activeTab === 'verification' ? '#64B5F6' : 'transparent'
                  }}
                >
                  <img 
                    src={activeTab === 'verification' ? v2Icon : v1Icon} 
                    alt="Verification" 
                    className="w-4 h-4"
                  />
                  <span className="text-xs font-normal" style={{ color: activeTab === 'verification' ? '#64B5F6' : '#B0B0B0' }}>
                    Verification
                  </span>
                </button>
              </div>

              {/* Personal Information Tab Content */}
              {activeTab === 'personal' && (
                <div className="space-y-3">
                  <div className="bg-white py-3">
                    {/* Upload Photo Section */}
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden"
                        style={{ 
                          borderColor: isImageLoading ? '#83C4F8' : '#E1E1E1', 
                          borderRadius: '13px',
                          background: isImageLoading 
                            ? 'repeating-linear-gradient(-45deg, #F5FBFF, #F5FBFF 18px, #F8FCFF 18px, #F8FCFF 36px)'
                            : (profileImage ? 'transparent' : 'transparent'),
                          border: isImageLoading ? '2px dashed #83C4F8' : (profileImage ? 'none' : '2px dashed #E1E1E1')
                        }}
                      >
                        {isImageLoading ? (
                          <div className="flex flex-col items-center justify-center">
                            <div className="relative mb-2">
                              {/* Gray base circle */}
                              <svg width="48" height="48" className="transform -rotate-90">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="22"
                                  fill="none"
                                  stroke="#E9E9E9"
                                  strokeWidth="2"
                                />
                                {/* Blue progress arc */}
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="22"
                                  fill="none"
                                  stroke="#83C4F8"
                                  strokeWidth="2"
                                  strokeDasharray={`${(uploadProgress / 100) * 138} 138`}
                                  strokeLinecap="round"
                                />
                        </svg>
                              {/* Icon in center */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img 
                                  src={loadIcon} 
                                  alt="Loading" 
                                  style={{ 
                                    width: '20px', 
                                    height: '20px',
                                    filter: 'brightness(0) saturate(100%) invert(70%) sepia(36%) saturate(624%) hue-rotate(172deg) brightness(100%) contrast(96%)'
                                  }}
                                />
                      </div>
                    </div>
                            <p className="text-[8px] font-medium" style={{ color: '#83C4F8' }}>
                              {uploadProgress}%
                            </p>
                          </div>
                        ) : profileImage ? (
                          <>
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                            <div 
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ backgroundColor: '#FFFFFF99' }}
                            >
                              <img 
                                src={cameraIcon} 
                                alt="Camera" 
                                className="w-8 h-8" 
                                style={{ filter: 'brightness(0) invert(1)' }}
                              />
                            </div>
                          </>
                        ) : (
                          <img src={cameraIcon} alt="Camera" className="w-8 h-8" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          ref={fileInputRef}
                          className="hidden"
                        />
                      <button 
                          onClick={handleUploadButtonClick}
                          className="px-2 py-1.5 rounded-lg text-xs font-normal transition-colors border mb-1"
                          style={{ backgroundColor: 'white', color: '#6A6A6A', borderColor: '#D9D9D9', width: 'fit-content' }}
                      >
                        Upload a photo
                      </button>
                        <p className="text-[10px]" style={{ color: '#ACAAAA' }}>
                          At least 800 x 800 px recommanded.<br />
                          JPG or PNG allowed
                      </p>
                    </div>
                  </div>
                  </div>
              {/* Divider */}
              <div className={`mt-4 -mx-8 ${isMobileProfileView ? 'hidden' : ''}`} style={{ height: '0.5px', backgroundColor: '#E9E9E9' }}></div>

                  {/* Profile Setting Details */}
                {isMobileProfileView && (
                  <div className="mb-2 px-1">
                    <h3 className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Profile Setting</h3>
                  </div>
                )}
                <div
                  className={`rounded-2xl p-2 bg-white ${
                    isMobileProfileView && isEditingProfile ? '' : 'border shadow-sm'
                  }`}
                  style={isMobileProfileView && isEditingProfile ? undefined : { borderColor: '#E1E1E1' }}
                >
                    {!isEditingProfile ? (
                      <>
                        {!isMobileProfileView && (
                          <div
                            className="flex items-center justify-between mb-2"
                            style={{ paddingLeft: '4px', paddingRight: '4px' }}
                          >
                            <h3 className="text-xs font-semibold" style={{ color: '#6A6A6A' }}>Profile Setting</h3>
                            <button
                              onClick={() => setIsEditingProfile(true)}
                              className="flex items-center space-x-1 px-2 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                              style={{ borderColor: '#D9D9D9' }}
                            >
                              <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                              <span className="text-[10px]" style={{ color: '#6A6A6A' }}>Edit</span>
                            </button>
                          </div>
                        )}
                        {isMobileProfileView ? (
                          <div className="space-y-3" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Full name</label>
                                <p className="text-xs font-semibold" style={{ color: '#212121' }}>{profileData.fullName}</p>
                              </div>
                              <button
                                onClick={() => setIsEditingProfile(true)}
                                className="flex items-center space-x-1 px-2 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                                style={{ borderColor: '#D9D9D9' }}
                              >
                                <img src={pencilIcon} alt="Edit" className="w-3 h-3" />
                                <span className="text-[10px]" style={{ color: '#6A6A6A' }}>Edit</span>
                              </button>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Gender</label>
                                <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.gender}</p>
                              </div>
                              <div className="text-right">
                                <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Birthday</label>
                                <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.birthday}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                            <div style={{ marginRight: '4px' }}>
                              <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Full name</label>
                              <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.fullName}</p>
                      </div>
                      <div>
                              <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Gender</label>
                              <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.gender}</p>
                      </div>
                            <div style={{ marginLeft: '4px' }}>
                              <label className="text-[10px] mb-0.5 block" style={{ color: '#6A6A6A' }}>Birthday</label>
                              <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.birthday}</p>
                    </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3">
                        {/* Full Name Field */}
                        <div className="relative">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px]" style={{ color: '#6A6A6A' }}>Full name</label>
                            <button
                              onClick={handleSaveProfile}
                              className="flex items-center space-x-1"
                              style={{ color: '#BABABA' }}
                            >
                              <span className="text-[10px]">Save changes</span>
                              <img src={arrowDownIcon} alt="Save" className="w-3 h-3" style={{ transform: 'rotate(180deg)' }} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            placeholder="Idriss Uswold"
                            className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none profile-edit-input"
                            style={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #E9E9E9',
                              color: profileData.fullName ? '#212121' : '#BABABA'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#64B5F6';
                              e.target.style.caretColor = '#64B5F6';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#E9E9E9';
                            }}
                          />
                        </div>
                        {/* Gender and Birthday Fields */}
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 gender-dropdown" ref={genderDropdownRef}>
                            <label className="text-[10px] mb-1 block" style={{ color: '#6A6A6A' }}>Gender</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setIsGenderDropdownOpen(prev => !prev)}
                                className="w-full px-3 py-2 pr-8 rounded-lg text-xs text-left focus:outline-none"
                                style={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #E9E9E9',
                                  color: profileData.gender ? '#212121' : '#B0B0B0'
                                }}
                              >
                                {profileData.gender || 'Select gender'}
                              </button>
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M6 9l6 6 6-6" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                              {isGenderDropdownOpen && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg py-2">
                                  {genderOptions.map(option => (
                                    <button
                                      type="button"
                                      key={option}
                                      onClick={() => handleGenderSelect(option)}
                                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs"
                                      style={{
                                        backgroundColor: profileData.gender === option ? '#F0F8FE' : 'transparent',
                                        color: profileData.gender === option ? '#64B5F6' : '#B0B0B0'
                                      }}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1" ref={birthdayCalendarRef}>
                            <label className="text-[10px] mb-1 block" style={{ color: '#6A6A6A' }}>Birthday</label>
                            <div className="relative birthday-calendar">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <img 
                                  src={calendarIcon} 
                                  alt="Calendar" 
                                  style={{ width: '14px', height: '14px', filter: 'brightness(0) saturate(100%) invert(79%) sepia(6%) saturate(136%) hue-rotate(189deg) brightness(88%) contrast(89%)' }}
                                />
                              </span>
                              <input
                                type="text"
                                value={profileData.birthday}
                                onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                                placeholder="13/09/2000"
                                className="w-full px-3 py-2 pl-9 rounded-lg text-xs focus:outline-none profile-edit-input-birthday"
                                style={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #E9E9E9',
                                  color: profileData.birthday ? '#212121' : '#BABABA'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = '#64B5F6';
                                  e.target.style.caretColor = '#64B5F6';
                                  openBirthdayCalendar();
                                }}
                                onClick={() => openBirthdayCalendar()}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#E9E9E9';
                                }}
                                readOnly
                              />
                              {isBirthdayCalendarOpen && (
                                <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <button
                                      type="button"
                                      className="w-6 h-6 flex items-center justify-center rounded-full"
                                      style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}
                                      onClick={() => handleMonthChange('prev')}
                                    >
                                      ‹
                                    </button>
                                    <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                                      {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button
                                      type="button"
                                      className="w-6 h-6 flex items-center justify-center rounded-full"
                                      style={{ backgroundColor: '#F5F5F5', color: '#6A6A6A' }}
                                      onClick={() => handleMonthChange('next')}
                                    >
                                      ›
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-7 gap-1 text-[10px] mb-1" style={{ color: '#B0B0B0' }}>
                                    {daysOfWeek.map(day => (
                                      <span key={day} className="text-center font-medium">{day}</span>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-7 gap-1 text-[11px]">
                                    {calendarDays.map((day, index) => {
                                      if (!day) {
                                        return <span key={index} className="h-7 flex items-center justify-center text-gray-300 text-[10px]"> </span>;
                                      }
                                      const value = formatDate(day);
                                      const isSelected = profileData.birthday === value;
                                      return (
                                        <button
                                          type="button"
                                          key={value}
                                          className="h-7 rounded-full flex items-center justify-center transition-colors"
                                          style={{
                                            backgroundColor: isSelected ? '#F0F8FE' : 'transparent',
                                            color: isSelected ? '#64B5F6' : '#6A6A6A'
                                          }}
                                          onClick={() => {
                                            setProfileData(prev => ({ ...prev, birthday: value }));
                                            setIsBirthdayCalendarOpen(false);
                                          }}
                                        >
                                          {day.getDate()}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Section */}
                  <div className={`bg-white p-3 ${isMobileProfileView ? '' : 'border rounded-2xl shadow-sm'}`} style={isMobileProfileView ? undefined : { borderColor: '#E1E1E1' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xs ${isMobileProfileView ? 'font-medium' : 'font-normal'}`} style={{ color: '#6A6A6A' }}>Location</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px]" style={{ color: '#64B5F6' }}>Geolocation</span>
                      <button
                        onClick={() => setIsGeolocationEnabled(!isGeolocationEnabled)}
                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                          style={{ backgroundColor: isGeolocationEnabled ? '#4CD964' : '#D1D5DB' }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isGeolocationEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value="London, United Kingdom"
                        readOnly
                        className="w-full px-3 py-2 pl-8 rounded-xl text-xs focus:outline-none"
                        style={{ backgroundColor: 'white', color: '#6A6A6A', border: '1px solid #E9E9E9', borderRadius: '12px' }}
                      />
                      <img 
                        src={locationIcon} 
                        alt="Location" 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)' }}
                      />
                    </div>
                  </div>

                  {/* Biography Section */}
                  {isMobileProfileView && (
                    <div className="mb-0.5 px-1">
                      <h3 className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Biographie</h3>
                    </div>
                  )}
                  <div className={`bg-white p-3 ${isMobileProfileView ? '' : 'border rounded-2xl shadow-sm'}`} style={isMobileProfileView ? undefined : { borderColor: '#E1E1E1' }}>
                    <div className={`${isMobileProfileView ? 'border border-[#E4E4E4] rounded-[14px] p-3' : ''}`}>
                      <textarea
                        value={biography}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setBiography(e.target.value);
                          }
                        }}
                        placeholder="Can you tell us more about yourself ?"
                        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none resize-none"
                        style={{ 
                          backgroundColor: 'white', 
                          color: '#212121',
                          minHeight: '80px',
                          border: isMobileProfileView ? 'none' : 'none'
                        }}
                        maxLength={500}
                      />
                      <style>
                        {`
                          textarea::placeholder {
                            color: #D9D9D9;
                          }
                        `}
                      </style>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px]" style={{ color: '#D9D9D9' }}>
                          {biography.length}/500
                        </span>
                        <button
                          className="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
                          style={{ backgroundColor: '#E9E9E9', color: '#6A6A6A' }}
                        >
                          Save biographie
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Tab Content */}
              {activeTab === 'verification' && (
                <div className="bg-white rounded-2xl p-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                          Email address
                        </label>
                        <button className="text-[10px] font-normal" style={{ color: '#64B5F6' }}>
                          Change mail address
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          value={verificationForm.email}
                          onChange={(e) => handleVerificationInput('email', e.target.value)}
                          placeholder="Enter your email address"
                          className="verification-input w-full px-4 py-2 pr-24 rounded-lg text-xs focus:outline-none"
                          style={{ border: '1px solid #E9E9E9', borderRadius: '10px', color: '#212121' }}
                        />
                        <span className="absolute top-1/2 right-2 -translate-y-1/2">
                          <span
                            className="px-3.5 py-1 text-[10px] font-medium inline-flex items-center justify-center"
                            style={{ backgroundColor: '#EDFBF0', color: '#4CD964', borderRadius: '6px' }}
                          >
                            Verified
                          </span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: '#6A6A6A' }}>
                        Phone number
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="relative" ref={phoneDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsPhoneCodeDropdownOpen(prev => !prev)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg border bg-white focus:outline-none"
                          style={{ borderColor: '#E9E9E9', borderRadius: '10px' }}
                          >
                            <img
                              src={`https://flagcdn.com/40x30/${selectedPhoneCode.flag}.png`}
                              alt={selectedPhoneCode.label}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>
                              {selectedPhoneCode.code}
                            </span>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                              <path d="M6 9l6 6 6-6" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          {isPhoneCodeDropdownOpen && (
                            <div className="absolute z-30 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-2">
                              {phoneCodes.map(code => (
                                <button
                                  type="button"
                                  key={code.code}
                                  onClick={() => handlePhoneCodeSelect(code)}
                                  className="w-full px-3 py-2 flex items-center space-x-2 text-left hover:bg-gray-50"
                                >
                                  <img
                                    src={`https://flagcdn.com/40x30/${code.flag}.png`}
                                    alt={code.label}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <p className="text-xs font-medium" style={{ color: '#212121' }}>
                                      {code.label}
                                    </p>
                                    <p className="text-[11px]" style={{ color: '#B0B0B0' }}>
                                      {code.code}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          value={verificationForm.phone}
                          onChange={(e) => handleVerificationInput('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="verification-input flex-1 px-4 py-2 rounded-lg text-xs focus:outline-none"
                          style={{ border: '1px solid #E9E9E9', borderRadius: '10px', color: '#212121' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-1.5" style={{ color: '#212121' }}>
                      First level verification
                    </h3>
                    <p className="text-[11px] mb-5" style={{ color: '#939393' }}>
                      Connect your social media accounts to verify your identity. Connecting at least two accounts will earn you a first-level verified badge.
                    </p>
                    <div className="space-y-3">
                      {socialPlatforms.map(platform => (
                        <div key={platform.key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {platform.key === 'linkedin' ? (
                              <svg width="28" height="28" viewBox="0 0 448 512">
                                <rect width="448" height="512" rx="90" fill="#0A66C2" />
                                <path
                                  d="M100.28 448H7.4V148.9h92.88zm-46.44-340a53.79 53.79 0 1153.79-53.79 53.79 53.79 0 01-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.3-79.3-48.3 0-55.7 37.7-55.7 76.7V448h-92.7V148.9h89v40.8h1.3c12.4-23.6 42.6-48.3 87.7-48.3 93.8 0 111.1 61.8 111.1 142.3z"
                                  fill="#fff"
                                />
                              </svg>
                            ) : (
                              <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
                            )}
                            <div className="text-left">
                              <p className="text-sm font-medium" style={{ color: '#6A6A6A' }}>
                                {platform.name}
                              </p>
                              <p className="text-[11px]" style={{ color: '#B0B0B0' }}>
                                {platform.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSocialToggle(platform.key as keyof typeof socialConnections)}
                            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                            style={{ backgroundColor: socialConnections[platform.key as keyof typeof socialConnections] ? '#64B5F6' : '#E4E4E4' }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                socialConnections[platform.key as keyof typeof socialConnections] ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
                </>
              )}

              {selectedSidebarOption === 'security' && (
                <div
                  className={
                    isMobileSecurityView
                      ? 'space-y-5'
                      : 'bg-white border rounded-[30px] p-5 sm:p-7'
                  }
                  style={isMobileSecurityView ? undefined : { borderColor: '#E4E4E4' }}
                >
                  <div className={isMobileSecurityView ? 'px-1 mb-3 space-y-1' : 'mb-6 space-y-1.5'}>
                    <h2
                      className={`${isMobileSecurityView ? 'text-base font-semibold' : 'text-base font-semibold'}`}
                      style={{ color: '#212121', fontFamily: isMobileSecurityView ? 'Bricolage Grotesque, sans-serif' : undefined }}
                    >
                      Security & Privacy Setting
                    </h2>
                    <p
                      className={isMobileSecurityView ? 'text-[12px]' : 'text-xs'}
                      style={{ color: '#B0B0B0', marginBottom: isMobileSecurityView ? '0' : '6px' }}
                    >
                      Manage your privacy preferences and keep your account secure on BAO' Afrik.
                    </p>
                  </div>

                    <div className={isMobileSecurityView ? 'space-y-5' : 'space-y-6'}>
                    {/* Password Section */}
                    <div className={isMobileSecurityView ? 'relative rounded-2xl bg-white p-0' : 'flex items-start justify-between gap-4 flex-wrap relative'}>
                      {isMobileSecurityView ? (
                        <div className="flex items-start justify-between gap-3 px-1">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold" style={{ color: '#6A6A6A' }}>Password</p>
                              <span 
                                onClick={() => setPasswordStrength(passwordStrength === 'weak' ? 'strong' : 'weak')}
                                className="px-2.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity" 
                                style={{ 
                                  backgroundColor: passwordStrength === 'weak' ? '#FEF6E9' : '#EDFBF0', 
                                  color: passwordStrength === 'weak' ? '#F9A825' : '#4CD964', 
                                  borderRadius: '6px', 
                                  fontSize: '10px', 
                                  fontWeight: 500 
                                }}
                              >
                                {passwordStrength === 'weak' ? 'Your password is weak' : 'Your password is strong'}
                              </span>
                            </div>
                            <p className="text-xs mt-1 font-normal" style={{ color: '#B0B0B0' }}>Set a password to protect your account.</p>
                          </div>
                          <button
                            onClick={handlePasswordEditClick}
                            className="flex items-center justify-center space-x-1 px-3 py-1.5 border rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: isPasswordEditClicked ? '#F0F8FE' : 'transparent',
                              borderColor: isPasswordEditClicked ? '#CFE8FC' : '#D9D9D9', 
                              minWidth: '62px' 
                            }}
                          >
                            <img 
                              src={pencilIcon} 
                              alt="Edit" 
                              className="w-3 h-3" 
                              style={{ 
                                filter: isPasswordEditClicked 
                                  ? 'brightness(0) saturate(100%) invert(67%) sepia(60%) saturate(2000%) hue-rotate(180deg) brightness(1) contrast(1)' 
                                  : 'none' 
                              }}
                            />
                            <span 
                              className="text-[10px]" 
                              style={{ color: isPasswordEditClicked ? '#64B5F6' : '#6A6A6A' }}
                            >
                              Edit
                            </span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{ color: '#6A6A6A' }}>Password</p>
                              <span 
                                onClick={() => setPasswordStrength(passwordStrength === 'weak' ? 'strong' : 'weak')}
                                className="px-2.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity" 
                                style={{ 
                                  backgroundColor: passwordStrength === 'weak' ? '#FEF6E9' : '#EDFBF0', 
                                  color: passwordStrength === 'weak' ? '#F9A825' : '#4CD964', 
                                  borderRadius: '6px', 
                                  fontSize: '10px', 
                                  fontWeight: 500 
                                }}
                              >
                                {passwordStrength === 'weak' ? 'Your password is weak' : 'Your password is strong'}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: '#B0B0B0' }}>Set a password to protect your account.</p>
                          </div>
                          <button
                            onClick={handlePasswordEditClick}
                            className="flex items-center justify-center space-x-1 px-2.5 py-1 border rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: isPasswordEditClicked ? '#F0F8FE' : 'transparent',
                              borderColor: isPasswordEditClicked ? '#CFE8FC' : '#D9D9D9', 
                              minWidth: '70px' 
                            }}
                          >
                            <img 
                              src={pencilIcon} 
                              alt="Edit" 
                              className="w-3 h-3" 
                              style={{ 
                                filter: isPasswordEditClicked 
                                  ? 'brightness(0) saturate(100%) invert(67%) sepia(60%) saturate(2000%) hue-rotate(180deg) brightness(1) contrast(1)' 
                                  : 'none' 
                              }}
                            />
                            <span 
                              className="text-[11px]" 
                              style={{ color: isPasswordEditClicked ? '#64B5F6' : '#6A6A6A' }}
                            >
                              Edit
                            </span>
                          </button>
                        </>
                      )}
                      
                      {/* Password Modal */}
                      {isPasswordModalOpen && (
                        <div 
                          ref={passwordModalRef}
                          className="absolute right-0 top-full mt-2 z-50 bg-white border rounded-xl shadow-lg"
                          style={{ 
                            borderColor: '#E9E9E9',
                            borderRadius: '12px',
                            minWidth: isMobileSecurityView ? '160px' : '200px'
                          }}
                        >
                          <div 
                            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors"
                            style={{ 
                              backgroundColor: selectedPasswordOption === 'update' ? '#FAFAFA' : 'transparent',
                              borderRadius: '8px',
                              margin: '4px'
                            }}
                            onClick={() => handlePasswordOptionClick('update')}
                            onMouseEnter={() => !selectedPasswordOption && setSelectedPasswordOption('update')}
                            onMouseLeave={() => selectedPasswordOption === 'update' && setSelectedPasswordOption(null)}
                          >
                            <img src={unlockIcon} alt="Update password" className="w-4 h-4" />
                            <span style={{ color: '#939393', fontSize: '13px' }}>Update password</span>
                          </div>
                          <div 
                            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors"
                            style={{ 
                              backgroundColor: selectedPasswordOption === 'reset' ? '#FAFAFA' : 'transparent',
                              borderRadius: '8px',
                              margin: '4px'
                            }}
                            onClick={() => handlePasswordOptionClick('reset')}
                            onMouseEnter={() => !selectedPasswordOption && setSelectedPasswordOption('reset')}
                            onMouseLeave={() => selectedPasswordOption === 'reset' && setSelectedPasswordOption(null)}
                          >
                            <img src={resetIcon} alt="Reset Password" className="w-4 h-4" />
                            <span style={{ color: '#939393', fontSize: '13px' }}>Reset Password</span>
                          </div>
                          <div 
                            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors"
                            style={{ 
                              backgroundColor: selectedPasswordOption === 'close' ? '#FAFAFA' : 'transparent',
                              borderRadius: '8px',
                              margin: '4px'
                            }}
                            onClick={() => handlePasswordOptionClick('close')}
                            onMouseEnter={() => !selectedPasswordOption && setSelectedPasswordOption('close')}
                            onMouseLeave={() => selectedPasswordOption === 'close' && setSelectedPasswordOption(null)}
                          >
                            <img src={closeIcon} alt="Close" className="w-4 h-4" />
                            <span style={{ color: '#939393', fontSize: '13px' }}>Close</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Two Step Verification Section */}
                    <div className={isMobileSecurityView ? 'p-4 rounded-2xl bg-white flex items-start justify-between gap-3' : 'flex items-start justify-between gap-4 flex-wrap'} style={isMobileSecurityView ? { marginLeft: '-8px' } : undefined}>
                      <div className={isMobileSecurityView ? 'space-y-2' : 'flex-1 space-y-1'}>
                        <p className="text-sm font-medium" style={{ color: '#6A6A6A' }}>Two step verification</p>
                        <p className="text-xs" style={{ color: '#B0B0B0', marginBottom: '6px' }}>
                          Enable two-step verification for enhanced security.{' '}
                          <button className="text-xs" style={{ color: '#64B5F6', textDecoration: 'underline', fontWeight: 400 }}>
                            How does it work?
                          </button>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (!isTwoFactorEnabled) {
                            setIsTwoFactorEnabled(true);
                            if (isMobileSecurityView) {
                              // Navigate to mobile flow instead of opening modal
                              navigate('/two-factor-email', { state: { fromProfileSettings: true } });
                            } else {
                              setIsTwoFactorModalOpen(true);
                              setTwoFactorModalStep('email');
                            }
                          } else {
                            setIsTwoFactorEnabled(false);
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isMobileSecurityView ? 'shrink-0' : ''}`}
                        style={{ backgroundColor: isTwoFactorEnabled ? '#64B5F6' : '#E4E4E4', marginTop: isMobileSecurityView ? '4px' : undefined }}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            isTwoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sessions Section */}
                    <div className={isMobileSecurityView ? 'space-y-3 mt-2' : 'space-y-3 mt-6 mb-10'}>
                      <div className={`flex items-center justify-between ${isMobileSecurityView ? 'px-2 mb-1' : ''}`}>
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold" style={{ color: '#212121' }}>Sessions</p>
                          <p className="text-xs" style={{ color: '#B0B0B0', marginBottom: isMobileSecurityView ? '2px' : '12px' }}>
                            Review your active sessions and sign out of any devices you don't recognize.
                          </p>
                        </div>
                        {!isMobileSecurityView && (
                          <button
                            onClick={() => setShowSessionHistory(!showSessionHistory)}
                            className="rounded-lg border whitespace-nowrap transition-colors px-3 py-1.5 text-[10px]"
                            style={{ borderColor: '#D9D9D9', color: '#6A6A6A', borderRadius: '6px' }}
                          >
                          {shouldShowSessionHistory ? 'Hide mock session history' : 'Show mock session history'}
                          </button>
                        )}
                      </div>
                      <div className={isMobileSecurityView ? 'space-y-1' : 'space-y-3'}>
                        {sessions.map((session) =>
                          isMobileSecurityView ? (
                            <div key={session.id} className="p-4 rounded-2xl space-y-1.5 bg-white" style={{ marginTop: '0' }}>
                              <div className="flex items-start gap-3">
                                <img src={session.icon} alt={session.browser} className="w-6 h-6 rounded-full object-cover" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[13px] font-medium" style={{ color: '#6A6A6A' }}>{session.browser}</p>
                                    {session.isCurrent && (
                                      <div className="inline-flex items-center gap-1">
                                        <span
                                          style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '9999px',
                                            backgroundColor: '#4CD964',
                                            boxShadow: '0 0 0 2px #EDFBF0'
                                          }}
                                        ></span>
                                        <span className="text-[10px] font-medium" style={{ color: '#4CD964' }}>Current session</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[10px]" style={{ color: '#939393' }}>{session.device}</p>
                                <div className="flex items-center justify-between" style={{ marginTop: '-2px' }}>
                                    <p className="text-[9px]" style={{ color: '#939393' }}>{session.location}</p>
                                    <button
                                      onClick={() => handleSignOutSession(session.id)}
                                      className="text-[11px] font-medium hover:opacity-80 transition-opacity"
                                      style={{ color: '#6A6A6A', textDecoration: 'underline' }}
                                    >
                                      Sign Out
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div key={session.id} className="flex items-center gap-6">
                              <div className="flex items-center gap-3" style={{ minWidth: '220px', flexShrink: 0 }}>
                                <img src={session.icon} alt={session.browser} className="w-8 h-8 rounded-full object-cover" />
                                <div>
                                  <p className="text-xs font-medium" style={{ color: '#6A6A6A', marginBottom: '-4px' }}>{session.browser}</p>
                                  {session.isCurrent && (
                                    <div className="inline-flex items-center gap-1" style={{ marginTop: '0px', lineHeight: '1' }}>
                                      <span
                                        style={{
                                          width: '6px',
                                          height: '6px',
                                          borderRadius: '9999px',
                                          backgroundColor: '#4CD964',
                                          boxShadow: '0 0 0 2px #EDFBF0'
                                        }}
                                      ></span>
                                      <span className="text-[10px] font-medium" style={{ color: '#4CD964' }}>Current session</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs" style={{ color: '#939393', minWidth: '180px', flexShrink: 0 }}>
                                <img src={isMobileDevice(session.device) ? mobileIcon : deviceIcon} alt="Device" className="w-4 h-4" />
                                <span>{session.device}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs" style={{ color: '#939393', minWidth: '200px', flexShrink: 0 }}>
                                <img
                                  src={`https://flagcdn.com/24x18/${session.flag}.png`}
                                  alt={session.location}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span>{session.location}</span>
                              </div>
                              <button
                                onClick={() => handleSignOutSession(session.id)}
                                className="text-xs font-medium ml-auto hover:opacity-80 transition-opacity"
                                style={{ color: '#6A6A6A', textDecoration: 'underline', flexShrink: 0 }}
                              >
                                Sign Out
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {shouldShowSessionHistory && (
                      <div className={isMobileSecurityView ? 'space-y-1 mt-1' : 'space-y-3 mt-8'}>
                        <div className={`flex items-center justify-between ${isMobileSecurityView ? 'px-1 gap-2 mb-0' : 'mb-5'}`}>
                          <p className={`${isMobileSecurityView ? 'text-[13px]' : 'text-sm'} font-medium`} style={{ color: '#6A6A6A' }}>Other Sessions</p>
                          <button
                            onClick={handleCloseAllInactiveSessions}
                            className={`rounded-lg border hover:opacity-80 transition-opacity ${isMobileSecurityView ? 'px-2 py-1 text-[9px] whitespace-nowrap' : 'px-3 py-1.5 text-xs'}`}
                            style={{ borderColor: '#D9D9D9', color: '#6A6A6A', borderRadius: '6px' }}
                          >
                            Close all inactive sessions
                          </button>
                        </div>
                        <div className={isMobileSecurityView ? '' : 'space-y-3'}>
                          {inactiveSessions.map((session, index) =>
                            isMobileSecurityView ? (
                              <div key={session.id} className="p-4 rounded-2xl space-y-1 bg-white" style={{ marginTop: index === 0 ? '0' : '2px', marginBottom: '0' }}>
                                <div className="flex items-start gap-3">
                                  <img src={session.icon} alt={session.browser} className="w-6 h-6 rounded-full object-cover" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-[13px] font-medium" style={{ color: '#6A6A6A' }}>{session.browser}</p>
                                      <span className="text-[10px]" style={{ color: '#B0B0B0' }}>{session.lastUsed}</span>
                                    </div>
                                    <p className="text-[10px]" style={{ color: '#939393' }}>{session.device}</p>
                                    <div className="flex items-center justify-between" style={{ marginTop: '-2px' }}>
                                      <p className="text-[9px]" style={{ color: '#939393' }}>{session.location}</p>
                                      <button
                                        onClick={() => handleSignOutInactiveSession(session.id)}
                                        className="text-[11px] font-medium hover:opacity-80 transition-opacity"
                                        style={{ color: '#6A6A6A', textDecoration: 'underline' }}
                                      >
                                        Sign Out
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div key={session.id} className="flex items-center gap-6">
                                <div className="flex items-center gap-3" style={{ minWidth: '220px', flexShrink: 0 }}>
                                  <img src={session.icon} alt={session.browser} className="w-8 h-8 rounded-full object-cover" />
                                  <div>
                                    <p className="text-xs font-medium" style={{ color: '#6A6A6A', marginBottom: '-4px' }}>{session.browser}</p>
                                    <p className="text-[10px] mt-0.5" style={{ color: '#B0B0B0' }}>{session.lastUsed}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#939393', minWidth: '180px', flexShrink: 0 }}>
                                  <img src={isMobileDevice(session.device) ? mobileIcon : deviceIcon} alt="Device" className="w-4 h-4" />
                                  <span>{session.device}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#939393', minWidth: '200px', flexShrink: 0 }}>
                                  <img
                                    src={`https://flagcdn.com/24x18/${session.flag}.png`}
                                    alt={session.location}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span>{session.location}</span>
                                </div>
                                <button
                                  onClick={() => handleSignOutInactiveSession(session.id)}
                                  className="text-xs font-medium ml-auto hover:opacity-80 transition-opacity"
                                  style={{ color: '#6A6A6A', textDecoration: 'underline', flexShrink: 0 }}
                                >
                                  Sign Out
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedSidebarOption === 'language' && (
                <div className="space-y-6 px-4 sm:px-6 lg:px-10">
                  {/* Title and Description */}
                  <div className="mb-6">
                    <h1 className="text-base font-medium mb-2" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                      Language and Currency
                    </h1>
                    <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                      Customize your language preferences and currency settings to enhance your shopping experience on BAO' Afrik.
                    </p>
                  </div>

                  {/* Content Area */}
                  <div className="bg-white border rounded-[20px] p-6" style={{ borderColor: '#E4E4E4', marginTop: '32px' }}>
                    {/* Language Section */}
                    <div className="mb-10">
                      <h2 className="text-sm font-medium mb-1.5" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                        Language Setting
                      </h2>
                      <p className="text-xs mb-4" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                        Control what others are seeing from you on BAO' Afrik.
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {languageOptions.map((lang) => {
                          const isSelected = languagePreference === lang.code;
                          const isSupported = lang.code === 'en' || lang.code === 'fr';
                          return (
                            <button
                              key={lang.code}
                              onClick={() => {
                                if (!isSupported) return;
                                setLanguagePreference(lang.code as 'en' | 'fr' | 'de' | 'es');
                              }}
                              className="flex items-center gap-2 px-4 py-1 rounded-full border transition-colors"
                              style={{
                                backgroundColor: isSelected ? '#F0F8FE' : 'white',
                                borderColor: isSelected ? '#CFE8FC' : '#E1E1E1',
                                fontFamily: 'Poppins, sans-serif',
                                cursor: isSupported ? 'pointer' : 'not-allowed',
                                opacity: isSupported ? 1 : 0.6
                              }}
                              disabled={!isSupported}
                              title={!isSupported ? 'Coming soon' : undefined}
                            >
                              {isSelected ? (
                                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#64B5F6' }}>
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="white" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <img
                                  src={`https://flagcdn.com/w20/${lang.flag}.png`}
                                  alt={lang.label}
                                  className="w-4 h-4 rounded-full"
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                                {lang.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Currency Section */}
                    <div>
                      <h2 className="text-sm font-medium mb-1.5" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                        Currency Preferences
                      </h2>
                      <p className="text-xs mb-4" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                        Choose the currency you want to see product prices in.
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {[
                          { code: 'USD', flag: 'us', name: 'United States Dollar' },
                          { code: 'EUR', flag: 'eu', name: 'Euro' },
                          { code: 'CAD', flag: 'ca', name: 'Canadian Dollar' },
                          { code: 'GBP', flag: 'gb', name: 'British Pound' }
                        ].map((currency) => {
                          const isSelected = currencyPreference === currency.code;
                          return (
                            <button
                              key={currency.code}
                              onClick={() => setCurrencyPreference(currency.code as 'USD' | 'EUR' | 'CAD' | 'GBP')}
                              className="flex items-center gap-2 px-4 py-1 rounded-full border transition-colors"
                              style={{
                                backgroundColor: isSelected ? '#F0F8FE' : 'white',
                                borderColor: isSelected ? '#CFE8FC' : '#E1E1E1',
                                fontFamily: 'Poppins, sans-serif'
                              }}
                            >
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#64B5F6' }}>
                                  <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <img
                                  src={`https://flagcdn.com/w20/${currency.flag}.png`}
                                  alt={currency.name}
                                  className="w-4 h-4 rounded-full"
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                                {currency.code}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSidebarOption === 'notifications' && (
                <div className="space-y-4 px-4 sm:px-6 lg:px-10">
                  {/* Standalone Title and Description Section */}
                  <div className="flex items-center justify-between" style={{ marginTop: '-20px', marginBottom: '16px' }}>
                    <div>
                      <h1 className="text-base font-medium mb-2" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                        Notifications Setting
                      </h1>
                      <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                        Update your profile and control what others see on BAO' Afrik.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>Switch on all</span>
                      <button
                        onClick={handleAllNotificationsToggle}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                        style={{ backgroundColor: allNotificationsEnabled ? '#87E697' : '#E4E4E4' }}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            allNotificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* General Notifications Content Area */}
                  <div className="bg-white border rounded-[24px] p-4" style={{ borderColor: '#E4E4E4' }}>
                    <div className="grid grid-cols-3 gap-6 items-start" style={{ paddingLeft: '8px' }}>
                      {/* First Column */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            General Notifications
                          </h3>
                          <p className="text-xs" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            All notifications from tour profile and your activities on our app
                          </p>
                        </div>
                        <div className="pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Switch on all</span>
                            <button
                              onClick={handleGeneralNotificationsToggle}
                              className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors"
                              style={{ backgroundColor: generalNotifications.enabled ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  generalNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Second Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Reviews and rates
                          </h4>
                          <p className="text-[10px]" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Receive alerts when users review or rate your products/Profile.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Subscription Renewal
                          </h4>
                          <p className="text-[10px]" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Remind users of upcoming subscription renewals, ensuring continuity of service.
                          </p>
                        </div>
                      </div>

                      {/* Third Column */}
                      <div className="space-y-4" style={{ marginLeft: '8px' }}>
                        {/* Reviews and rates toggles - Horizontal row */}
                        <div className="flex items-start gap-5 justify-end" style={{ paddingTop: '20px' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                            <button
                              onClick={() => setGeneralNotifications({
                                ...generalNotifications,
                                reviewsAndRates: { ...generalNotifications.reviewsAndRates, push: !generalNotifications.reviewsAndRates.push }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: generalNotifications.reviewsAndRates.push ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  generalNotifications.reviewsAndRates.push ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                            <button
                              onClick={() => setGeneralNotifications({
                                ...generalNotifications,
                                reviewsAndRates: { ...generalNotifications.reviewsAndRates, email: !generalNotifications.reviewsAndRates.email }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: generalNotifications.reviewsAndRates.email ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  generalNotifications.reviewsAndRates.email ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                            <button
                              onClick={() => setGeneralNotifications({
                                ...generalNotifications,
                                reviewsAndRates: { ...generalNotifications.reviewsAndRates, inApp: !generalNotifications.reviewsAndRates.inApp }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: generalNotifications.reviewsAndRates.inApp ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  generalNotifications.reviewsAndRates.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        {/* Subscription Renewal toggles - Horizontal row */}
                        <div className="flex items-start gap-5 justify-end" style={{ paddingTop: '20px' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                            <button
                              onClick={() => setGeneralNotifications({
                                ...generalNotifications,
                                subscriptionRenewal: { ...generalNotifications.subscriptionRenewal, push: !generalNotifications.subscriptionRenewal.push }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: generalNotifications.subscriptionRenewal.push ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  generalNotifications.subscriptionRenewal.push ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                            <button
                              onClick={() => setGeneralNotifications({
                                ...generalNotifications,
                                subscriptionRenewal: { ...generalNotifications.subscriptionRenewal, email: !generalNotifications.subscriptionRenewal.email }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: generalNotifications.subscriptionRenewal.email ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  generalNotifications.subscriptionRenewal.email ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                            <button
                              onClick={() => setGeneralNotifications({
                                ...generalNotifications,
                                subscriptionRenewal: { ...generalNotifications.subscriptionRenewal, inApp: !generalNotifications.subscriptionRenewal.inApp }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: generalNotifications.subscriptionRenewal.inApp ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  generalNotifications.subscriptionRenewal.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Notifications Content Area */}
                  <div className="bg-white border rounded-[24px] p-4" style={{ borderColor: '#E4E4E4' }}>
                    <div className="grid grid-cols-3 gap-6 items-stretch" style={{ paddingLeft: '8px' }}>
                      {/* First Column */}
                      <div className="flex flex-col">
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Messages Notifications
                          </h3>
                          <p className="text-xs" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            All messages and mentions from our messagings
                          </p>
                        </div>
                        <div className="pt-2 mt-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Switch on all</span>
                            <button
                              onClick={handleMessagesNotificationsToggle}
                              className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.enabled ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Second Column */}
                      <div className="space-y-4" style={{ marginLeft: '4px' }}>
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Messages
                          </h4>
                          <p className="text-[10px]" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Alert users when they receive a new direct message.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Message reminders
                          </h4>
                          <p className="text-[10px]" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Remind users to respond to unread messages, fostering engagement.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Chat Requests
                          </h4>
                          <p className="text-[10px]" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Notify users of new chat requests, even when is not initiated from a product page.
                          </p>
                        </div>
                      </div>

                      {/* Third Column */}
                      <div className="space-y-4" style={{ marginLeft: '8px' }}>
                        {/* Messages toggles - Horizontal row */}
                        <div className="flex items-start gap-5 justify-end" style={{ paddingTop: '20px' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                messages: { ...messagesNotifications.messages, push: !messagesNotifications.messages.push }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.messages.push ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.messages.push ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                messages: { ...messagesNotifications.messages, email: !messagesNotifications.messages.email }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.messages.email ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.messages.email ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                messages: { ...messagesNotifications.messages, inApp: !messagesNotifications.messages.inApp }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.messages.inApp ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.messages.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        {/* Message reminders toggles - Horizontal row */}
                        <div className="flex items-start gap-5 justify-end" style={{ paddingTop: '20px' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                messageReminders: { ...messagesNotifications.messageReminders, push: !messagesNotifications.messageReminders.push }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.messageReminders.push ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.messageReminders.push ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                messageReminders: { ...messagesNotifications.messageReminders, email: !messagesNotifications.messageReminders.email }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.messageReminders.email ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.messageReminders.email ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                messageReminders: { ...messagesNotifications.messageReminders, inApp: !messagesNotifications.messageReminders.inApp }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.messageReminders.inApp ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.messageReminders.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        {/* Chat Requests toggles - Horizontal row */}
                        <div className="flex items-start gap-5 justify-end" style={{ paddingTop: '20px' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                chatRequests: { ...messagesNotifications.chatRequests, push: !messagesNotifications.chatRequests.push }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.chatRequests.push ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.chatRequests.push ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                chatRequests: { ...messagesNotifications.chatRequests, email: !messagesNotifications.chatRequests.email }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.chatRequests.email ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.chatRequests.email ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                            <button
                              onClick={() => setMessagesNotifications({
                                ...messagesNotifications,
                                chatRequests: { ...messagesNotifications.chatRequests, inApp: !messagesNotifications.chatRequests.inApp }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: messagesNotifications.chatRequests.inApp ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  messagesNotifications.chatRequests.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* News and Updates Content Area */}
                  <div className="bg-white border rounded-[24px] p-4" style={{ borderColor: '#E4E4E4' }}>
                    <div className="grid grid-cols-3 gap-6 items-start" style={{ paddingLeft: '8px' }}>
                      {/* First Column */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            News and updates
                          </h3>
                          <p className="text-xs" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            News and Updates from BAO 'Afrik
                          </p>
                        </div>
                        <div className="pt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Switch on all</span>
                            <button
                              onClick={handleNewsNotificationsToggle}
                              className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors"
                              style={{ backgroundColor: newsNotifications.enabled ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  newsNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Second Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Newsletter
                          </h4>
                          <p className="text-[10px]" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Get updates, offers, and trends in African art and culture.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Daily recommadations
                          </h4>
                          <p className="text-[10px]" style={{ color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                            Get daily updates on the latest from the world of African art and culture.
                          </p>
                        </div>
                      </div>

                      {/* Third Column */}
                      <div className="space-y-4" style={{ marginLeft: '8px' }}>
                        {/* Newsletter toggles - Horizontal row */}
                        <div className="flex items-start gap-5 justify-end" style={{ paddingTop: '20px' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                            <button
                              onClick={() => setNewsNotifications({
                                ...newsNotifications,
                                newsletter: { ...newsNotifications.newsletter, push: !newsNotifications.newsletter.push }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: newsNotifications.newsletter.push ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  newsNotifications.newsletter.push ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                            <button
                              onClick={() => setNewsNotifications({
                                ...newsNotifications,
                                newsletter: { ...newsNotifications.newsletter, email: !newsNotifications.newsletter.email }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: newsNotifications.newsletter.email ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  newsNotifications.newsletter.email ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                            <button
                              onClick={() => setNewsNotifications({
                                ...newsNotifications,
                                newsletter: { ...newsNotifications.newsletter, inApp: !newsNotifications.newsletter.inApp }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: newsNotifications.newsletter.inApp ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  newsNotifications.newsletter.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        {/* Daily recommendations toggles - Horizontal row */}
                        <div className="flex items-start gap-5 justify-end" style={{ paddingTop: '20px' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                            <button
                              onClick={() => setNewsNotifications({
                                ...newsNotifications,
                                dailyRecommendations: { ...newsNotifications.dailyRecommendations, push: !newsNotifications.dailyRecommendations.push }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: newsNotifications.dailyRecommendations.push ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  newsNotifications.dailyRecommendations.push ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                            <button
                              onClick={() => setNewsNotifications({
                                ...newsNotifications,
                                dailyRecommendations: { ...newsNotifications.dailyRecommendations, email: !newsNotifications.dailyRecommendations.email }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: newsNotifications.dailyRecommendations.email ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  newsNotifications.dailyRecommendations.email ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                            <button
                              onClick={() => setNewsNotifications({
                                ...newsNotifications,
                                dailyRecommendations: { ...newsNotifications.dailyRecommendations, inApp: !newsNotifications.dailyRecommendations.inApp }
                              })}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                              style={{ backgroundColor: newsNotifications.dailyRecommendations.inApp ? '#87E697' : '#E4E4E4' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  newsNotifications.dailyRecommendations.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Profile Completion */}
          {selectedSidebarOption === 'profile' && (
         <div className={`w-64 bg-white border border-gray-200 rounded-[20px] p-4 overflow-y-auto scrollbar-hide ${isMobile ? 'hidden' : ''}`} style={{ paddingBottom: '20px', maxHeight: 'fit-content' }}>
              <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">Complete your profile</h3>
              
              {/* Progress Indicator */}
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center justify-center mb-4">
                  <img src={verifyIcon} alt="Verify" className="w-14 h-14" />
                </div>
                <div className="w-full relative" style={{ marginTop: '12px', marginBottom: '12px' }}>
                  <span className="absolute -top-5 left-0 text-xs font-semibold" style={{ color: '#6A6A6A' }}>{profileProgress}%</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5" style={{ backgroundColor: '#F1F1F1' }}>
                    <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${profileProgress}%`, backgroundColor: '#4CD964' }}></div>
                </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                {/* Setup account - Always complete */}
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Setup account <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span></span>
                </div>
                
                {/* Personal information */}
                <div className="flex items-center space-x-1.5">
                  {isPersonalInfoComplete ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-xs font-medium" style={{ color: isPersonalInfoComplete ? '#6A6A6A' : '#B0B0B0' }}>
                    Personnal information <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span>
                  </span>
                </div>
                
                {/* Upload photo */}
                <div className="flex items-center space-x-1.5">
                  {isPhotoUploaded ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  )}
                  <span className="text-xs font-medium" style={{ color: isPhotoUploaded ? '#6A6A6A' : '#B0B0B0' }}>
                    Upload your photo <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span>
                  </span>
                </div>
                
                {/* Location */}
                <div className="flex items-center space-x-1.5">
                  {isLocationSet ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  )}
                  <span className="text-xs font-medium" style={{ color: isLocationSet ? '#6A6A6A' : '#B0B0B0' }}>
                    Location <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span>
                  </span>
                </div>
                
                {/* Description */}
                <div className="flex items-center space-x-1.5">
                  {isDescriptionComplete ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  )}
                  <span className="text-xs font-medium" style={{ color: isDescriptionComplete ? '#6A6A6A' : '#B0B0B0' }}>
                    Description <span className="font-medium" style={{ color: '#6A6A6A' }}>10%</span>
                  </span>
                </div>
                
                {/* Verification first step */}
                <div className="flex items-center space-x-1.5">
                  {isVerificationComplete ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4CD964' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#B0B0B0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  )}
                  <span className="text-xs font-medium" style={{ color: isVerificationComplete ? '#6A6A6A' : '#B0B0B0' }}>
                    Verification first step <span className="font-medium" style={{ color: '#6A6A6A' }}>25%</span>
                  </span>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Footer */}
         <footer className={`bg-gray-50 ${isMobile ? 'hidden' : ''}`}>
            <div className="px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between text-xs" style={{ color: '#BABABA' }}>
                <div className="flex items-center space-x-1.5">
                  <img 
                    src={lilLogo} 
                    alt="lil" 
                    className="w-5 h-5"
                  />
                  <span>©</span>
                  <span className="text-[11px]">All rights reserved</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
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
      )}
    </div>

    {/* Update Password Modal */}
    {isUpdatePasswordModalOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: '#0000001A' }}
          onClick={handleCloseUpdatePasswordModal}
        />

        {/* Modal */}
        <div className={`fixed inset-0 z-50 flex ${isMobileSecurityView ? 'items-end justify-center' : 'items-center justify-center'} ${isMobileSecurityView ? 'px-2 pb-0' : 'p-4'}`}>
          <div
            className={`bg-white rounded-[30px] pt-12 sm:pt-14 px-6 sm:px-8 relative ${isMobileSecurityView ? 'w-full pb-16' : 'max-w-md w-full pb-10'}`}
            style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {isMobileSecurityView && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
                style={{ backgroundColor: '#E9E9E9' }}
              />
            )}
            {/* Close Button */}
            <button
              onClick={handleCloseUpdatePasswordModal}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center"
            >
              <img
                src={closeIcon}
                alt="Close"
                className="w-5 h-5"
                style={{ filter: passwordModalStep === 'success' ? 'brightness(0) saturate(100%) invert(79%) sepia(6%) saturate(178%) hue-rotate(169deg) brightness(88%) contrast(83%)' : 'none' }}
              />
            </button>

            {passwordModalStep !== 'success' ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <img src={updateIcon} alt="Update" className="w-16 h-16" />
                </div>

                {/* Title */}
                <h2
                  className="text-xl text-center mb-1.5"
                  style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600 }}
                >
                  Update Password
                </h2>

                {/* Description */}
                <p className="text-xs text-center mb-4" style={{ color: '#BABABA', fontWeight: 400, fontFamily: 'Poppins, sans-serif' }}>
                  {passwordModalStep === 'current'
                    ? 'Please enter your Current password.'
                    : 'Please enter your new password'}
                </p>

                {passwordModalStep === 'current' ? (
                  <>
                    <div className="mb-6 flex flex-col items-center">
                      <label className="w-full max-w-xs text-left text-xs mb-3 mt-5" style={{ color: '#6A6A6A', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>
                        Current password
                      </label>
                      <div className="relative w-full max-w-xs">
                        <input
                          className="update-password-input w-full px-4 py-2.5 pr-12 rounded-[12px] border focus:outline-none text-sm mx-auto"
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your current password"
                          style={{
                            backgroundColor: 'white',
                            borderColor: '#E9E9E9',
                            color: '#212121',
                            borderRadius: '12px'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#CFE8FC';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#E9E9E9';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E9E9E9' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E9E9E9' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end w-full max-w-xs mx-auto">
                      <button
                        className="w-full py-2.5 rounded-[12px] text-sm font-normal transition-colors"
                        style={{
                          backgroundColor: currentPassword.trim() ? '#F9A825' : '#E9E9E9',
                          color: '#FFFFFF',
                          borderRadius: '12px'
                        }}
                        disabled={!currentPassword.trim()}
                        onClick={() => {
                          if (currentPassword.trim()) {
                            setPasswordModalStep('new');
                            setShowPassword(false);
                          }
                        }}
                      >
                        Save new password
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-5 mb-8 flex flex-col items-center w-full">
                      <div className="w-full max-w-xs">
                        <label className="block text-xs mb-2" style={{ color: '#212121', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>
                          New password
                        </label>
                        <div className="relative">
                          <input
                            className="update-password-input w-full px-4 py-2.5 pr-12 rounded-[12px] border focus:outline-none text-sm"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            style={{
                              backgroundColor: 'white',
                              borderColor: '#E9E9E9',
                              color: '#212121',
                              borderRadius: '12px'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#CFE8FC';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#E9E9E9';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          >
                            {showNewPassword ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E9E9E9' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E9E9E9' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="w-full max-w-xs">
                        <label className="block text-xs mb-2" style={{ color: '#212121', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>
                          Confirm new password
                        </label>
                        <div className="relative">
                          <input
                            className="update-password-input w-full px-4 py-2.5 pr-12 rounded-[12px] border focus:outline-none text-sm"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            style={{
                              backgroundColor: 'white',
                              borderColor: '#E9E9E9',
                              color: '#212121',
                              borderRadius: '12px'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#CFE8FC';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#E9E9E9';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E9E9E9' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E9E9E9' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end w-full max-w-xs mx-auto">
                      <button
                        className="w-full py-2.5 rounded-[12px] text-sm font-normal transition-colors"
                        style={{
                          backgroundColor: newPassword.trim() && confirmPassword.trim() && newPassword === confirmPassword ? '#F9A825' : '#E9E9E9',
                          color: '#FFFFFF',
                          borderRadius: '12px'
                        }}
                        disabled={!newPassword.trim() || !confirmPassword.trim() || newPassword !== confirmPassword}
                        onClick={() => {
                          if (newPassword.trim() && confirmPassword.trim() && newPassword === confirmPassword) {
                            setPasswordModalStep('success');
                          }
                        }}
                      >
                        Save new password
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center px-4">
                <div className="flex justify-center mb-7">
                  <img src={verifyIcon} alt="Verified" className="w-16 h-16" />
                </div>
                <h2
                  className="text-xl mb-2"
                  style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600 }}
                >
                  Password updated successfully
                </h2>
                <p className="text-sm mb-12" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                  Your password has been reset, you can now log in with this new password
                </p>
                <button
                  className="w-full max-w-xs mx-auto py-2.5 rounded-[12px] text-sm font-normal transition-colors"
                  style={{ backgroundColor: '#F9A825', color: '#FFFFFF', borderRadius: '12px' }}
                  onClick={handleCloseUpdatePasswordModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
        <style>{`
          .update-password-input::placeholder {
            color: #D9D9D9 !important;
            font-size: 12px !important;
            font-weight: 400 !important;
            font-family: 'Poppins', sans-serif !important;
          }
        `}        </style>
      </>
    )}

    {/* Two Step Verification Modal */}
    {isTwoFactorModalOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: '#0000001A' }}
          onClick={handleCloseTwoFactorModal}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={twoFactorModalRef}
            className="bg-white rounded-[30px] pt-12 sm:pt-14 px-6 sm:px-8 pb-16 relative max-w-md w-full"
            style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseTwoFactorModal}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center"
            >
              <img
                src={closeIcon}
                alt="Close"
                className="w-5 h-5"
                style={{ filter: 'brightness(0) saturate(100%) invert(79%) sepia(6%) saturate(178%) hue-rotate(169deg) brightness(88%) contrast(83%)' }}
              />
            </button>

            {twoFactorModalStep === 'email' && (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <img src={keyIcon} alt="Key" className="w-16 h-16" />
                </div>

                {/* Title */}
                <h2
                  className="text-xl text-center mb-1.5"
                  style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
                >
                  Two step authentication
                </h2>

                {/* Description */}
                <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                  Please enter your information
                </p>

                {/* Form */}
                <form onSubmit={handleTwoFactorEmailSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                      Email address
                    </label>
                    <input
                      type="email"
                      value={twoFactorEmail}
                      onChange={(e) => setTwoFactorEmail(e.target.value)}
                      placeholder="Enter your mail address"
                      className="two-factor-input w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
                      style={{
                        borderColor: '#E9E9E9',
                        color: '#212121',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#CFE8FC';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E9E9E9';
                      }}
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={twoFactorPassword}
                      onChange={(e) => setTwoFactorPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="two-factor-input w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
                      style={{
                        borderColor: '#E9E9E9',
                        color: '#212121',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#CFE8FC';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E9E9E9';
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={handleCloseTwoFactorModal}
                      className="flex-1 py-2 px-4 rounded-[12px] text-sm font-normal flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: '#F1F1F1',
                        color: '#6A6A6A',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      <span style={{ color: '#6A6A6A' }}>X</span>
                      Cancel
                    </button>

                    {/* Continue Button */}
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                      style={{ 
                        backgroundColor: '#F9A825',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </>
            )}

            {twoFactorModalStep === 'phone' && (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <img src={keyIcon} alt="Key" className="w-16 h-16" />
                </div>

                {/* Title */}
                <h2
                  className="text-xl text-center mb-1.5"
                  style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
                >
                  Two step authentication
                </h2>

                {/* Description */}
                <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                  We'll send a verification code to this number whenever you sign in to your account
                </p>

                {/* Form */}
                <form onSubmit={handleTwoFactorPhoneSubmit} className="space-y-4">
                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                      Phone number
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className="relative flex-shrink-0" ref={twoFactorPhoneCodeDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsTwoFactorPhoneCodeDropdownOpen(!isTwoFactorPhoneCodeDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-3 border rounded-[12px] bg-white focus:outline-none"
                          style={{
                            borderColor: '#E9E9E9',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/w20/${twoFactorSelectedPhoneCode.flag}.png`}
                            alt={twoFactorSelectedPhoneCode.label}
                            className="w-5 h-5 rounded-full"
                            style={{ objectFit: 'cover' }}
                          />
                          <span className="text-xs" style={{ color: '#939393' }}>
                            {twoFactorSelectedPhoneCode.code}
                          </span>
                          <img
                            src={arrowDownIcon}
                            alt="Arrow"
                            className="w-4 h-4"
                            style={{ filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)' }}
                          />
                        </button>

                        {/* Dropdown */}
                        {isTwoFactorPhoneCodeDropdownOpen && (
                          <div 
                            className="absolute top-full left-0 mt-1 bg-white z-50 w-48"
                            style={{
                              borderRadius: '20px',
                              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                              overflow: 'hidden'
                            }}
                          >
                            <div className="two-factor-dropdown" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {phoneCodes.map((code) => (
                                <button
                                  key={code.code}
                                  type="button"
                                  onClick={() => {
                                    setTwoFactorSelectedPhoneCode(code);
                                    setIsTwoFactorPhoneCodeDropdownOpen(false);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 transition-colors"
                                  style={{
                                    backgroundColor: twoFactorSelectedPhoneCode.code === code.code ? '#F0F8FE' : 'transparent',
                                    borderRadius: twoFactorSelectedPhoneCode.code === code.code ? '8px' : '0',
                                    margin: twoFactorSelectedPhoneCode.code === code.code ? '4px 8px' : '0',
                                    width: twoFactorSelectedPhoneCode.code === code.code ? 'calc(100% - 16px)' : '100%'
                                  }}
                                >
                                  <img
                                    src={`https://flagcdn.com/w20/${code.flag}.png`}
                                    alt={code.label}
                                    className="w-4 h-4 rounded-full"
                                    style={{ objectFit: 'cover' }}
                                  />
                                  <span
                                    className="text-xs flex-1 text-left"
                                    style={{
                                      color: twoFactorSelectedPhoneCode.code === code.code ? '#64B5F6' : '#BABABA',
                                      fontFamily: 'Poppins, sans-serif'
                                    }}
                                  >
                                    {code.code} <span style={{ margin: '0 2px' }}>·</span> {code.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        value={twoFactorPhone}
                        onChange={(e) => setTwoFactorPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="two-factor-input flex-1 px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
                        style={{
                          borderColor: '#E9E9E9',
                          color: '#212121',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#CFE8FC';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E9E9E9';
                        }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={handleCloseTwoFactorModal}
                      className="flex-1 py-2 px-4 rounded-[12px] text-sm font-normal flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: '#F1F1F1',
                        color: '#6A6A6A',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      <span style={{ color: '#6A6A6A' }}>X</span>
                      Cancel
                    </button>

                    {/* Continue Button */}
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                      style={{ 
                        backgroundColor: '#F9A825',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </>
            )}

            {twoFactorModalStep === 'code' && (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <img src={keyIcon} alt="Key" className="w-16 h-16" />
                </div>

                {/* Title */}
                <h2
                  className="text-xl text-center mb-1.5"
                  style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
                >
                  Two step authentication
                </h2>

                {/* Description */}
                <p className="text-xs text-center mb-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                  Enter the authentication code below we sent to<br />
                  {twoFactorSelectedPhoneCode.code} {twoFactorPhone ? `${twoFactorPhone.charAt(0)}${'*'.repeat(Math.max(0, twoFactorPhone.length - 1))}` : '******'}
                </p>
                {!canResendTwoFactorCode ? (
                  <p className="text-[11px] mt-1 mb-6 text-center" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                    Request another code 0:{twoFactorCountdown.toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleTwoFactorResendCode}
                    className="text-[11px] mb-6 mx-auto block focus:outline-none"
                    style={{ color: '#64B5F6', textDecoration: 'underline', fontFamily: 'Poppins, sans-serif' }}
                  >
                    Request a new digital code
                  </button>
                )}

                {/* Form */}
                <form onSubmit={handleTwoFactorCodeSubmit} className="space-y-4">
                  {/* 6-Digit Code Input */}
                  <div className="flex justify-center gap-2 mt-8 mb-8">
                    {twoFactorVerificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (twoFactorCodeInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleTwoFactorCodeInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleTwoFactorCodeKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-medium bg-white border rounded-lg"
                        style={{
                          borderColor: '#E9E9E9',
                          color: '#212121',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#CFE8FC';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E9E9E9';
                        }}
                      />
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={handleCloseTwoFactorModal}
                      className="flex-1 py-2 px-4 rounded-[12px] text-sm font-normal flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: '#F1F1F1',
                        color: '#6A6A6A',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      <span style={{ color: '#6A6A6A' }}>X</span>
                      Cancel
                    </button>

                    {/* Continue Button */}
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                      style={{ 
                        backgroundColor: '#F9A825',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </>
            )}

            {twoFactorModalStep === 'success' && (
              <div className="text-center px-4">
                {/* Icon */}
                <div className="flex justify-center mb-7">
                  <img src={verityIcon} alt="Verified" className="w-20 h-20" />
                </div>

                {/* Title */}
                <h2
                  className="text-xl mb-4"
                  style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
                >
                  Successfully enable
                </h2>

                {/* Description */}
                <p className="text-sm mb-12" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                  Your phone number is set to {twoFactorSelectedPhoneCode.code} {twoFactorPhone ? `${twoFactorPhone.charAt(0)}${'*'.repeat(Math.max(0, twoFactorPhone.length - 1))}` : '******'}<br />
                  Authentification code will be sent to this number<br />
                  when you logging in
                </p>

                {/* Close Button */}
                <button
                  className="w-full max-w-xs mx-auto py-2.5 rounded-[12px] text-sm font-normal transition-colors"
                  style={{ backgroundColor: '#F9A825', color: '#FFFFFF', borderRadius: '12px' }}
                  onClick={() => {
                    setIsTwoFactorEnabled(true);
                    handleCloseTwoFactorModal();
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
        <style>{`
          .two-factor-input::placeholder {
            color: #D9D9D9 !important;
            font-size: 12px !important;
            font-weight: 400 !important;
            font-family: 'Poppins', sans-serif !important;
          }
          .two-factor-dropdown::-webkit-scrollbar {
            display: none;
          }
          .two-factor-dropdown {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </>
    )}
    </>
  );
};

export default ProfileSettings;

