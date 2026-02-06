import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/api';

import logo from '../assets/images/pre/logo.png';
import sideIcon from '../assets/images/pre/side.png';
import lilLogo from '../assets/images/pre/lil.png';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { io, Socket } from "socket.io-client";
import { useSocket } from '../contexts/socketContext'
import { useToast } from "../contexts/ToastContext";
import { useNotificationToast } from '../contexts/NotificationToastContext';
import { useNotifications } from '../contexts/NotificationContext';
import { countries } from '../utils/countries';
import { gcpStorageService } from '../services/gcpStorageService';
import { sortedCountryPhoneCodes } from '../utils/countryPhoneCodes';
import { sessionService, Session } from '../services/sessionService';
import { twoFactorService } from '../services/twoFactorService';
import { socialAccountService } from '../services/socialAccountService';

const currencyRates: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  CAD: 1.34,
  GBP: 0.81
};

interface ProfileData {
  fullName: string;
  gender: string;
  birthDate: string;
  profileImage: string;
  phoneNumber: string;
  location: string;
  bio: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string;
  general?: string;
}

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
    "Save bio": "Enregistrer la biographie",
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
  const { addToast } = useToast();
  const { showNotification } = useNotificationToast();
  const { user, updateUserProfile, logout } = useAuth();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [languagePreference, setLanguagePreference] = useState<'en' | 'fr' | 'de' | 'es'>(() => {
    return (localStorage.getItem('languagePreference') as 'en' | 'fr' | 'de' | 'es') || 'en';
  });
  const [currencyPreference, setCurrencyPreference] = useState<'USD' | 'EUR' | 'CAD' | 'GBP'>(() => {
    return (localStorage.getItem('currencyPreference') as 'USD' | 'EUR' | 'CAD' | 'GBP') || 'USD';
  });
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [twoFactorErrors, setTwoFactorErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isTwoFactorSubmitting, setIsTwoFactorSubmitting] = useState(false);
  const [isDisableTwoFactorModalOpen, setIsDisableTwoFactorModalOpen] = useState(false);
  const [disableTwoFactorEmail, setDisableTwoFactorEmail] = useState('');
  const [disableTwoFactorPassword, setDisableTwoFactorPassword] = useState('');
  const [disableTwoFactorErrors, setDisableTwoFactorErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isDisablingTwoFactor, setIsDisablingTwoFactor] = useState(false);
  const disableTwoFactorModalRef = useRef<HTMLDivElement>(null);
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
  const contextSocket = useSocket();
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, notificationCount, refreshNotifications, markAsRead, markAllAsRead: markAllAsReadContext } = useNotifications();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string } | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | ''>('');
  const [isFetchingCountries, setIsFetchingCountries] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const geolocationProcessingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (isNotificationOpen) {
      refreshNotifications();
    }
  }, [isNotificationOpen, refreshNotifications]);

  const markAllAsRead = async () => {
    await markAllAsReadContext();
    setNotificationTab('all');
  };

  const filteredNotifications = notifications.filter(notif => {
    if (notificationTab === 'all') return true;
    if (notificationTab === 'unread') return !notif.isRead;
    if (notificationTab === 'messages') return notif.type === 'message' || notif.type === 'NEW_MESSAGE';
    return true;
  });

  const handleNotificationClick = async (notif: any) => {
    if (notif.id) {
      await markAsRead(notif.id);
    }
  };

  const getNotificationSenderName = (notif: any) => {
    // Parse meta if it's a string
    let meta = notif.meta;
    if (typeof meta === 'string') {
      try {
        meta = JSON.parse(meta);
      } catch (e) {
        meta = null;
      }
    }

    // For product notifications, use seller name from meta or title
    if (notif.type === 'product') {
      const sellerName = meta?.sellerName || notif.meta?.sellerName || notif.title;
      if (sellerName && sellerName !== 'A seller' && sellerName !== 'Notification') {
        return sellerName;
      }
      // Try to get from actor if available
      if (notif.actor?.firstName || notif.actor?.lastName) {
        return `${notif.actor.firstName || ''} ${notif.actor.lastName || ''}`.trim() || 'A seller';
      }
      return 'A seller';
    }

    // For message notifications
    if (notif.type === 'NEW_MESSAGE' || notif.type === 'message') {
      if (notif.title && notif.title !== 'Notification' && notif.title !== 'Someone') {
        return notif.title;
      }
      // Try to get from actor
      if (notif.actor?.firstName || notif.actor?.lastName) {
        return `${notif.actor.firstName || ''} ${notif.actor.lastName || ''}`.trim() || 'Someone';
      }
      return 'Someone';
    }

    // For other notifications
    if (notif.title && notif.title !== 'Notification') {
      return notif.title;
    }

    return 'Someone';
  };

  const getNotificationAvatar = (notif: any) => {
    const tryUrl = (u?: string | null) => {
      if (!u) return null;
      // if relative path, prefix with API url
      if (!/^https?:\/\//i.test(u) && process.env.REACT_APP_API_URL) {
        return `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/${u.replace(/^\//, '')}`;
      }
      return u;
    };

    // Parse meta if it's a string
    let meta = notif.meta;
    if (typeof meta === 'string') {
      try {
        meta = JSON.parse(meta);
      } catch (e) {
        meta = null;
      }
    }

    // For message notifications, show sender's profile image
    if (notif.type === 'message' || notif.type === 'NEW_MESSAGE') {
      const srcCandidates = [
        notif.actor?.profileImage,
        notif.actor?.avatar,
        notif.senderAvatar,
        notif.senderImage,
        meta?.senderImage,
        meta?.actorImage,
        notif.meta?.senderImage,
        notif.meta?.actorImage
      ];

      for (const c of srcCandidates) {
        const resolved = tryUrl(c);
        if (resolved) return resolved;
      }
      return avatar; // Fallback to default avatar for messages
    }

    // For product notifications, show seller's image if available, otherwise logo
    if (notif.type === 'product') {
      const sellerImage = meta?.sellerImage || notif.meta?.sellerImage || notif.actor?.profileImage || notif.sellerImage;
      const resolved = tryUrl(sellerImage);
      if (resolved) return resolved;
      // Return null for product notifications to show logo instead
      return null;
    }

    // For other notifications, show actor image if available
    const srcCandidates = [
      notif.actor?.profileImage,
      notif.actor?.avatar,
      notif.senderAvatar,
      meta?.senderImage,
      meta?.actorImage,
      notif.meta?.senderImage,
      notif.meta?.actorImage
    ];

    for (const c of srcCandidates) {
      const resolved = tryUrl(c);
      if (resolved) return resolved;
    }
    return null; // Return null to show logo for non-message notifications
  };

  // Function to reload user data from backend
  const reloadUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;

      const json = await res.json();
      if (!json.success) return;

      const u = json.data;

      // Update local profile data state
      setProfileData({
        fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        gender: u.gender || '',
        birthDate: formatBirthDate(u.birthDate),
        profileImage: u.profileImage || '',
        phoneNumber: u.phoneNumber || '',
        location: u.location || '',
        bio: u.bio || ''
      });

      setProfileImage(u.profileImage || null);
      setExistingImageUrl(u.profileImage || null);
      // Initialize biography from user bio
      setBiography(u.bio || '');
      // Initialize selected country from user location
      if (u.location) {
        const foundCountry = countries.find(c =>
          c.name.toLowerCase() === u.location.toLowerCase() ||
          c.code.toLowerCase() === u.location.toLowerCase()
        );
        if (foundCountry) {
          setSelectedCountry(foundCountry);
          setSelectedCountryCode(foundCountry.code);
        } else {
          setSelectedCountryCode(u.location);
        }
      }

      // Update phone code and number display
      const parsed = parsePhoneNumber(u.phoneNumber, u.phoneCode);
      setVerificationForm(prev => ({
        ...prev,
        phone: parsed.number
      }));
      if (parsed.code && parsed.flag && parsed.label) {
        setSelectedPhoneCode({
          code: parsed.code,
          flag: parsed.flag,
          label: parsed.label
        });
      }

      // Update AuthContext user
      updateUserProfile({
        firstName: u.firstName,
        lastName: u.lastName,
        gender: u.gender,
        birthDate: u.birthDate,
        profileImage: u.profileImage,
        phoneNumber: u.phoneNumber,
        phoneCode: u.phoneCode,
        location: u.location,
        bio: u.bio,
        emailVerified: u.emailVerified
      });
    } catch (e) {
      console.warn('Failed to reload user data', e);
    }
  };

  // load user and countries on mount
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('accessToken');

    const loadProfile = async () => {
      try {
        if (!token) return;

        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;

        const json = await res.json();
        if (!mounted || !json.success) return;

        const u = json.data;
        setProfileData({
          fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          gender: u.gender || '',
          birthDate: formatBirthDate(u.birthDate),
          profileImage: u.profileImage || '',
          phoneNumber: u.phoneNumber || '',
          location: u.location || '',
          bio: u.bio || ''
        });

        setProfileImage(u.profileImage || null);
        setExistingImageUrl(u.profileImage || null);
        // Initialize biography from user bio
        setBiography(u.bio || '');
        // Initialize selected country from user location
        if (u.location) {
          const foundCountry = countries.find(c =>
            c.name.toLowerCase() === u.location.toLowerCase() ||
            c.code.toLowerCase() === u.location.toLowerCase()
          );
          if (foundCountry) {
            setSelectedCountry(foundCountry);
            setSelectedCountryCode(foundCountry.code);
          } else {
            setSelectedCountryCode(u.location);
          }
        }

        // Update phone code and number display
        const parsed = parsePhoneNumber(u.phoneNumber, u.phoneCode);
        setVerificationForm(prev => ({
          ...prev,
          email: u.email,
          phone: parsed.number
        }));
        if (parsed.code && parsed.flag && parsed.label) {
          setSelectedPhoneCode({
            code: parsed.code,
            flag: parsed.flag,
            label: parsed.label
          });
        }

        // Update AuthContext user
        updateUserProfile({
          firstName: u.firstName,
          lastName: u.lastName,
          gender: u.gender,
          birthDate: u.birthDate,
          profileImage: u.profileImage,
          phoneNumber: u.phoneNumber,
          phoneCode: u.phoneCode,
          location: u.location,
          bio: u.bio,
          emailVerified: u.emailVerified
        });
      } catch (e) {
        console.warn('Failed to load profile', e);
      }
    };

    loadProfile();

    return () => { mounted = false; };
  }, []);

  // Geolocation toggle
  useEffect(() => {
    if (!isGeolocationEnabled) {
      geolocationProcessingRef.current = false;
      setIsFetchingCountries(false);
      return;
    }

    // Prevent multiple simultaneous geolocation requests
    if (geolocationProcessingRef.current) {
      return;
    }

    if (!navigator.geolocation) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Geolocation not supported by your browser',
        duration: 2000
      });
      setIsGeolocationEnabled(false);
      setIsFetchingCountries(false);
      return;
    }

    geolocationProcessingRef.current = true;
    setIsFetchingCountries(true);

    let isMounted = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!isMounted || !geolocationProcessingRef.current) return;

        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) throw new Error('Reverse geocoding failed');

          const data = await response.json();

          if (data && data.countryName && isMounted) {
            // Find the country in the countries list
            const foundCountry = countries.find(c =>
              c.name.toLowerCase() === data.countryName.toLowerCase() ||
              c.name.toLowerCase().includes(data.countryName.toLowerCase()) ||
              data.countryName.toLowerCase().includes(c.name.toLowerCase())
            );

            if (foundCountry && isMounted) {
              setSelectedCountryCode(foundCountry.code);
              setSelectedCountry(foundCountry);
              setFormData(prev => ({
                ...prev,
                location: foundCountry.name
              }));

              // Auto-save location to backend 
              const token = localStorage.getItem('accessToken');
              if (token && isMounted) {
                try {
                  const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      location: foundCountry.name
                    })
                  });

                  if (updateResponse.ok && isMounted) {
                    const updateData = await updateResponse.json();
                    if (updateData.success && isMounted) {
                      setProfileData(prev => ({ ...prev, location: foundCountry.name }));
                      // Reload user data from backend
                      await reloadUserData();
                      addToast({
                        type: 'success',
                        title: 'Location updated',
                        message: 'Your location has been updated successfully',
                        duration: 2000
                      });
                    }
                  }
                } catch (updateError) {
                  console.error('Failed to update location in backend:', updateError);
                  if (isMounted) {
                    addToast({
                      type: 'error',
                      title: 'Save failed',
                      message: 'Location detected but failed to save. Please try saving manually.',
                      duration: 2000
                    });
                  }
                }
              }
            } else if (isMounted) {
              throw new Error('Country not found in our list');
            }
          }
        } catch (error) {
          if (isMounted) {
            console.error('Geolocation error:', error);
            addToast({
              type: 'error',
              title: 'Cannot detect location',
              message: 'Could not determine your location. Please select a country manually.',
              duration: 2000
            });
          }
        } finally {
          if (isMounted) {
            setIsFetchingCountries(false);
            geolocationProcessingRef.current = false;
          }
        }
      },
      (error: GeolocationPositionError) => {
        if (!isMounted) return;

        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to access your location. Please enable location services or select a country manually.';
        if (error.code === 1) { // PERMISSION_DENIED
          errorMessage = 'Location access denied. Please allow location access in your browser settings.';
        } else if (error.code === 3) { // TIMEOUT
          errorMessage = 'Location request timed out. Please try again or select a country manually.';
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          errorMessage = 'Location information is unavailable. Please select a country manually.';
        }
        addToast({
          type: 'error',
          title: 'Cannot access location',
          message: errorMessage,
          duration: 2000
        });

        if (isMounted) {
          setIsGeolocationEnabled(false);
          setIsFetchingCountries(false);
          geolocationProcessingRef.current = false;
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 60000 }
    );

    // Cleanup function
    return () => {
      isMounted = false;
      geolocationProcessingRef.current = false;
      setIsFetchingCountries(false);
    };
  }, [isGeolocationEnabled]);

  const handleCountrySelect = (country: { code: string; name: string }) => {
    setSelectedCountry(country);
    setSelectedCountryCode(country.code);
    setFormData(prev => ({
      ...prev,
      location: country.name
    }));
    setIsCountryDropdownOpen(false);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      setFormData(prev => ({
        ...prev,
        birthDate: dateString,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        birthDate: '',
      }));
    }

    if (errors.birthDate) {
      setErrors(prev => ({
        ...prev,
        birthDate: '',
      }));
    }
  };

  // Format birth date to display only date (remove time) - returns YYYY-MM-DD for internal use
  const formatBirthDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      // If it includes time (ISO format), extract just the date part
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      // If parsing fails, try to extract date part if it contains 'T'
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      return dateString;
    }
  };

  // Format birth date for display as day/month/year
  const formatBirthDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      let date: Date;
      // If it's in YYYY-MM-DD format, parse it directly
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = dateString.split('-');
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) return dateString;

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Profile editing state
  const formatUserData = () => {
    if (!user) {
      return {
        fullName: '',
        gender: '',
        birthDate: '',
        profileImage: '',
        phoneNumber: '',
        location: '',
        bio: ''
      };
    }

    return {
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
      gender: user.gender || '',
      birthDate: formatBirthDate(user.birthDate),
      profileImage: user.profileImage || '',
      phoneNumber: user.phoneNumber || '',
      location: user.location || '',
      bio: user.bio || ''
    };
  };

  const [profileData, setProfileData] = useState<ProfileData>(formatUserData());
  const [formData, setFormData] = useState<ProfileData>(formatUserData());
  const [isEditing, setIsEditing] = useState(false);

  // Image upload state - use the user's profile image if available
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update profile image when user data changes
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
      setExistingImageUrl(user.profileImage);
    }
  }, [user]);
  const genderOptions = ['Male', 'Female', 'Other'];
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize phone number from user data
  const parsePhoneNumber = (phoneNumber: string | undefined, phoneCode?: string) => {
    if (!phoneNumber) return { code: '+1', number: '', flag: 'us', label: 'United States' };

    // If phoneCode is provided, use it directly
    if (phoneCode) {
      const phoneCodeObj = sortedCountryPhoneCodes.find(c => c.dialCode === phoneCode);
      if (phoneCodeObj) {
        // Extract number by removing the country code from phoneNumber
        const number = phoneNumber.startsWith(phoneCode)
          ? phoneNumber.substring(phoneCode.length)
          : phoneNumber;
        return {
          code: phoneCodeObj.dialCode,
          number: number,
          flag: phoneCodeObj.flag,
          label: phoneCodeObj.name
        };
      }
    }

    // Fallback: Extract country code and number from phoneNumber (format: +1234567890)
    const match = phoneNumber.match(/^(\+\d{1,4})(.+)$/);
    if (match) {
      const code = match[1];
      const number = match[2];
      // Find matching phone code
      const phoneCodeObj = sortedCountryPhoneCodes.find(c => c.dialCode === code);
      if (phoneCodeObj) {
        return {
          code: phoneCodeObj.dialCode,
          number: number,
          flag: phoneCodeObj.flag,
          label: phoneCodeObj.name
        };
      }
    }
    return { code: '+1', number: phoneNumber, flag: 'us', label: 'United States' };
  };

  // Use phoneCode directly from user (now properly typed)
  const parsedPhone = useMemo(() => parsePhoneNumber(user?.phoneNumber, user?.phoneCode), [user?.phoneNumber, user?.phoneCode]);

  const [verificationForm, setVerificationForm] = useState({
    email: user?.email,
    phone: '' // Will be set by useEffect when user data loads
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

  const [mobileNotificationDetailView, setMobileNotificationDetailView] = useState<'general' | 'messages' | 'news' | null>(null);

  const [selectedPhoneCode, setSelectedPhoneCode] = useState({
    label: 'United States',
    code: '+1',
    flag: 'us'
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData(formatUserData());
      // Update verification form with email and parsed phone number
      const parsed = parsePhoneNumber(user.phoneNumber, user.phoneCode);
      setVerificationForm(prev => ({
        ...prev,
        email: user.email,
        phone: parsed.number // Only the local number without country code
      }));
      // Update selected phone code dropdown
      if (parsed.code && parsed.flag && parsed.label) {
        setSelectedPhoneCode({
          code: parsed.code,
          flag: parsed.flag,
          label: parsed.label
        });
      }
    }
  }, [user]);

  // Fetch 2FA status on mount and when user changes
  useEffect(() => {
    const fetchTwoFactorStatus = async () => {
      if (user?.id) {
        try {
          const status = await twoFactorService.getStatus();
          setIsTwoFactorEnabled(status.isEnabled);
        } catch (error) {
          console.error('Failed to fetch 2FA status:', error);
          // Keep default state (false) on error
        }
      }
    };

    fetchTwoFactorStatus();
  }, [user?.id]);

  // Fetch social account status on mount and when user changes
  useEffect(() => {
    const fetchSocialAccountStatus = async () => {
      if (user?.id) {
        try {
          const status = await socialAccountService.getStatus();
          setSocialConnections({
            whatsapp: status.status.whatsapp || false,
            facebook: status.status.facebook || false,
            instagram: status.status.instagram || false,
            linkedin: status.status.linkedin || false,
            x: status.status.x || false
          });
        } catch (error) {
          console.error('Failed to fetch social account status:', error);
          // Keep default state on error
        }
      }
    };

    fetchSocialAccountStatus();
  }, [user?.id]);

  // Countdown timer for 2FA resend code
  useEffect(() => {
    if (twoFactorCountdown > 0 && twoFactorModalStep === 'code') {
      const timer = setTimeout(() => setTwoFactorCountdown(twoFactorCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (twoFactorCountdown === 0 && twoFactorModalStep === 'code') {
      setCanResendTwoFactorCode(true);
    }
  }, [twoFactorCountdown, twoFactorModalStep]);

  // Calculate profile completion progress
  const calculateProfileProgress = () => {
    if (!user) return 0;

    let progress = 10; // Setup account (always complete when logged in)

    // Personal information (10%) - check if fullName, gender, and birthday are filled
    if (user.firstName && user.lastName && user.gender && user.birthDate) {
      progress += 10;
    }

    // Upload photo (10%) - check if profileImage is set
    if (profileImage) {
      progress += 10;
    }

    // Location (10%) - check if geolocation is enabled OR manual location is set OR user.location from backend
    const hasLocation = isGeolocationEnabled ||
      (formData.location && formData.location.trim() !== '') ||
      (user.location && user.location.trim() !== '') ||
      (profileData.location && profileData.location.trim() !== '');
    if (hasLocation) {
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
  const profileProgress = useMemo(() => calculateProfileProgress(), [user, profileData, profileImage, isGeolocationEnabled, formData.location, biography, verificationForm.email]);

  const isPersonalInfoComplete = useMemo(() =>
    profileData.fullName && profileData.fullName.trim() !== '' &&
    profileData.gender && profileData.gender.trim() !== '' &&
    profileData.birthDate && profileData.birthDate.trim() !== '',
    [profileData]
  );
  const isPhotoUploaded = useMemo(() => !!profileImage, [profileImage]);
  const isLocationSet = useMemo(() => {
    return isGeolocationEnabled ||
      (formData.location && formData.location.trim() !== '') ||
      (user?.location && user.location.trim() !== '') ||
      (profileData.location && profileData.location.trim() !== '');
  }, [isGeolocationEnabled, formData.location, user?.location, profileData.location]);
  const isDescriptionComplete = useMemo(() => biography && biography.trim() !== '', [biography]);
  const isVerificationComplete = useMemo(() => verificationForm.email && verificationForm.email.trim() !== '', [verificationForm.email]);
  const [isPhoneCodeDropdownOpen, setIsPhoneCodeDropdownOpen] = useState(false);
  const phoneCodes = sortedCountryPhoneCodes.map(c => ({
    label: c.name,
    code: c.dialCode,
    flag: c.flag,
    isoCode: c.code // ISO country code for unique key
  }));

  const twoFactorPhoneCodes = sortedCountryPhoneCodes.map(c => ({
    label: c.name,
    code: c.dialCode,
    flag: c.flag,
    isoCode: c.code // ISO country code for unique key
  }));

  const [socialConnections, setSocialConnections] = useState({
    whatsapp: false,
    facebook: false,
    instagram: false,
    linkedin: false,
    x: false
  });
  const [isSocialAccountModalOpen, setIsSocialAccountModalOpen] = useState(false);
  const [selectedSocialProvider, setSelectedSocialProvider] = useState<'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'x' | null>(null);
  const [isConnectingSocial, setIsConnectingSocial] = useState(false);
  const socialAccountModalRef = useRef<HTMLDivElement>(null);

  // WhatsApp connection state
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappPhoneCode, setWhatsappPhoneCode] = useState({
    label: 'United States',
    code: '+1',
    flag: 'us'
  });
  const [isWhatsappPhoneCodeDropdownOpen, setIsWhatsappPhoneCodeDropdownOpen] = useState(false);
  const whatsappPhoneCodeDropdownRef = useRef<HTMLDivElement>(null);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Sessions state - now using real API data
  const [sessions, setSessions] = useState<Array<Session & { icon: string; flag: string; lastUsed?: string }>>([]);

  // Helper function to get browser icon
  const getBrowserIcon = (browser: string): string => {
    const browserLower = browser.toLowerCase();
    if (browserLower.includes('chrome')) return chromeIcon;
    if (browserLower.includes('safari')) return safariIcon;
    if (browserLower.includes('edge')) return edgeIcon;
    if (browserLower.includes('brave')) return braveIcon;
    if (browserLower.includes('firefox')) return chromeIcon; // Use chrome icon as fallback
    return chromeIcon; // Default
  };

  // Helper function to format last used date
  const formatLastUsed = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      if (selectedSidebarOption === 'security') {
        setIsLoadingSessions(true);
        try {
          const allSessions = await sessionService.getSessions();
          const formattedSessions = allSessions.map(session => ({
            ...session,
            icon: getBrowserIcon(session.browser),
            flag: session.country.toLowerCase() || 'us',
            lastUsed: formatLastUsed(session.lastActivityAt),
          }));
          setSessions(formattedSessions);
        } catch (error) {
          console.error('Failed to fetch sessions:', error);
          addToast({
            type: 'error',
            title: 'Error',
            message: 'Failed to load sessions',
            duration: 3000
          });
        } finally {
          setIsLoadingSessions(false);
        }
      }
    };

    fetchSessions();
  }, [selectedSidebarOption]);

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
  const handleSignOutSession = async (sessionId: string) => {
    try {
      const sessionToRevoke = sessions.find(s => s.id === sessionId);
      const isCurrentSession = sessionToRevoke?.isCurrent;

      await sessionService.revokeSession(sessionId);
      setSessions(sessions.filter(session => session.id !== sessionId));

      // If revoking current session, log out the user
      if (isCurrentSession) {
        // Clear tokens and user data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Redirect to login
        navigate('/login');
        addToast({
          type: 'info',
          title: 'Logged out',
          message: 'You have been logged out from this device',
          duration: 2000
        });
      } else {
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Session revoked successfully',
          duration: 2000
        });
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to revoke session',
        duration: 3000
      });
    }
  };

  const handleCloseAllInactiveSessions = async () => {
    try {
      await sessionService.revokeAllOtherSessions();
      // Reload sessions
      const allSessions = await sessionService.getSessions();
      const formattedSessions = allSessions.map(session => ({
        ...session,
        icon: getBrowserIcon(session.browser),
        flag: session.country.toLowerCase() || 'us',
        lastUsed: formatLastUsed(session.lastActivityAt),
      }));
      setSessions(formattedSessions);
      addToast({
        type: 'success',
        title: 'Success',
        message: 'All other sessions revoked successfully',
        duration: 2000
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to revoke sessions',
        duration: 3000
      });
    }
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
  const isMobileLanguageView = isMobile && !isMobileSidebarVisible && selectedSidebarOption === 'language';
  const isMobileNotificationsView = isMobile && !isMobileSidebarVisible && selectedSidebarOption === 'notifications';
  const shouldShowSessionHistory = isMobileSecurityView ? true : showSessionHistory;

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

  // Image validation
  const validateImageFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image (JPEG, PNG, GIF)';
    }

    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }

    return null;
  };

  // Image upload function with progress tracking
  const uploadImage = async (file: File, onProgress?: (progress: number) => void): Promise<string | null> => {
    if (!file || !user) return null;

    try {
      const { uploadUrl, fileUrl } = await gcpStorageService.getPresignedUrlForProfile(
        file,
        user.id
      );

      // Track upload progress
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
            if (onProgress) onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            setUploadProgress(100);
            resolve(fileUrl);
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload aborted'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch (error) {
      throw new Error('Failed to upload image to storage');
    }
  };

  // Handle image upload - auto-upload on selection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      addToast({
        type: 'error',
        title: 'Invalid image',
        message: validationError,
        duration: 2000
      });
      return;
    }

    // Set loading state immediately (before FileReader)
    setIsUploadingImage(true);
    setUploadProgress(0);
    setSelectedFile(file);
    setImageRemoved(false);

    // Show preview immediately using FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
    };
    reader.onerror = () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to read image file',
        duration: 2000
      });
      setIsUploadingImage(false);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);

    // Auto-upload the image to GCP and then save to backend
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        addToast({
          type: 'error',
          title: 'Authentication required',
          message: 'You must be logged in to upload profile picture',
          duration: 2000
        });
        setIsUploadingImage(false);
        setUploadProgress(0);
        return;
      }

      if (!user) {
        setIsUploadingImage(false);
        setUploadProgress(0);
        return;
      }

      // Upload to GCP with progress tracking
      const imageUrl = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });

      if (imageUrl) {
        // Save to backend after GCP upload completes
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            profileImage: imageUrl
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to save profile picture' }));
          throw new Error(errorData.message || 'Failed to save profile picture');
        }

        const data = await response.json();
        if (data.success) {
          setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
          setExistingImageUrl(imageUrl);
          setSelectedFile(null);

          // Reload user data from backend
          await reloadUserData();

          // Show notification toast
          showNotification({
            type: 'app',
            mainText: 'Profile picture has been updated',
            duration: 3000
          });
        }
      }
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      addToast({
        type: 'error',
        title: 'Upload failed',
        message: error.message || 'Failed to upload profile picture. Please try again.',
        duration: 2000
      });
      // Reset on error
      setProfileImage(existingImageUrl);
      setSelectedFile(null);
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 500); // Delay to show 100% completion briefly
    }

    // Reset file input to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadButtonClick = () => {
    // If there's already a profile image, remove it instead of uploading
    if (profileImage) {
      handleRemoveImage();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        addToast({
          type: 'error',
          title: 'Authentication required',
          message: 'You must be logged in to remove profile picture',
          duration: 2000
        });
        return;
      }

      setIsUploadingImage(true);

      // Remove from backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profileImage: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to remove profile picture' }));
        throw new Error(errorData.message || 'Failed to remove profile picture');
      }

      const data = await response.json();
      if (data.success) {
        setProfileImage(null);
        setSelectedFile(null);
        setImageRemoved(false);
        setExistingImageUrl(null);
        setProfileData(prev => ({ ...prev, profileImage: '' }));
        // Reload user data from backend
        await reloadUserData();
        addToast({
          type: 'success',
          title: 'Profile picture removed',
          message: 'Your profile picture has been removed successfully',
          duration: 2000
        });
      }
    } catch (error: any) {
      console.error('Error removing profile picture:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to remove image',
        duration: 2000
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle profile picture save
  const handleSaveProfilePicture = async () => {
    if (!selectedFile && !imageRemoved) {
      addToast({
        type: 'info',
        title: 'No changes',
        message: 'No image changes to save',
        duration: 2000
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        addToast({
          type: 'error',
          title: 'Authentication required',
          message: 'You must be logged in to save profile picture',
          duration: 2000
        });
        return;
      }

      let imageUrl: string | null = null;

      // Handle image upload/removal
      if (selectedFile) {
        // Upload new image
        imageUrl = await uploadImage(selectedFile, (progress) => {
          setUploadProgress(progress);
        });

        // Note: Old image deletion is handled by the backend or can be cleaned up separately
        // For now, we just upload the new image
      } else if (imageRemoved) {
        // Image was removed
        imageUrl = null;
        // Note: Old image deletion can be handled separately if needed
      } else {
        // Keep existing image
        imageUrl = existingImageUrl;
      }

      // Save to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profileImage: imageUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save profile picture' }));
        throw new Error(errorData.message || 'Failed to save profile picture');
      }

      const data = await response.json();
      if (data.success) {
        setProfileData(prev => ({ ...prev, profileImage: imageUrl || '' }));
        setExistingImageUrl(imageUrl);
        setSelectedFile(null);
        setImageRemoved(false);
        // Reload user data from backend
        await reloadUserData();
        addToast({
          type: 'success',
          title: 'Profile picture updated',
          message: 'Your profile picture has been updated successfully',
          duration: 2000
        });
      } else {
        throw new Error(data.message || 'Failed to save profile picture');
      }
    } catch (error: any) {
      console.error('Error saving profile picture:', error);
      addToast({
        type: 'error',
        title: 'Save failed',
        message: error.message || 'Failed to save profile picture. Please try again.',
        duration: 2000
      });
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    setIsEditingProfile(false);
    setIsGenderDropdownOpen(false);
    setIsBirthdayCalendarOpen(false);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const nameParts = (profileData.fullName || '').trim().split(/\s+/);
      const payload: any = {
        firstName: nameParts.shift() || '',
        lastName: nameParts.join(' ') || undefined,
        gender: profileData.gender || undefined,
        birthDate: formData.birthDate || profileData.birthDate || undefined,
        bio: biography || undefined,
        location: selectedCountry?.name || formData.location || profileData.location || undefined
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({ success: false }));
      if (!res.ok) {
        console.error('Save profile failed', json);
        addToast && addToast({ type: 'error', title: 'Save failed', message: json.message || 'Could not save profile' });
        return;
      }
      if (json.success && json.data) {
        // update local state
        const savedLocation = selectedCountry?.name || formData.location || profileData.location;
        setProfileData(prev => ({
          ...prev,
          profileImage: json.data.profileImage || prev.profileImage,
          location: savedLocation || prev.location,
          birthDate: formData.birthDate || prev.birthDate
        }));
        // Reload user data from backend
        await reloadUserData();
        addToast && addToast({
          type: 'success',
          title: 'Profile updated',
          message: 'Your profile has been updated successfully',
          duration: 2000
        });
      }
    } catch (e) {
      console.error('Save profile error', e);
    }
  };

  const handleSaveBio = async () => {
    if (!biography.trim()) {
      addToast({ message: 'Please enter a bio', type: 'error', title: 'Action failed', duration: 2000 });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        addToast({ message: 'You must be logged in to save bio', type: 'error', title: 'Authentication required', duration: 2000 });
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bio: biography })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save bio' }));
        throw new Error(errorData.message || 'Failed to save bio');
      }

      const data = await response.json();
      if (data.success) {
        setProfileData(prev => ({ ...prev, bio: biography }));
        // Reload user data from backend
        await reloadUserData();
        addToast({ message: 'Bio updated successfully', type: 'success', title: 'Action completed', duration: 2000 });
      } else {
        throw new Error(data.message || 'Failed to save bio');
      }
    } catch (error: any) {
      console.error('Error saving bio:', error);
      addToast({
        message: error.message || 'Failed to save bio',
        type: 'error',
        title: 'Action failed',
        duration: 2000
      });
    }
  };

  const handleSaveLocation = async () => {
    const locationToSave = selectedCountry?.name || formData.location;
    if (!locationToSave || !locationToSave.trim()) {
      addToast({ message: 'Please select a location', type: 'error', title: 'Action failed', duration: 2000 });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        addToast({ message: 'You must be logged in to save location', type: 'error', title: 'Authentication required', duration: 2000 });
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ location: locationToSave })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save location' }));
        throw new Error(errorData.message || 'Failed to save location');
      }

      const data = await response.json();
      if (data.success) {
        setProfileData(prev => ({ ...prev, location: locationToSave }));
        // Reload user data from backend
        await reloadUserData();
        addToast({ message: 'Location updated successfully', type: 'success', title: 'Action completed', duration: 2000 });
      } else {
        throw new Error(data.message || 'Failed to save location');
      }
    } catch (error: any) {
      console.error('Error saving location:', error);
      addToast({
        message: error.message || 'Failed to save location',
        type: 'error',
        title: 'Action failed',
        duration: 2000
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          // Split full name into first and last name
          firstName: formData.fullName.split(' ')[0],
          lastName: formData.fullName.split(' ').slice(1).join(' ') || ''
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setProfileData(formData);
      // Reload user data from backend
      await reloadUserData();
      addToast({ message: 'Profile updated successfully', type: 'success', title: 'Profile updated', duration: 2000 });
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast({ message: 'Failed to update profile', type: 'error', title: 'Action failed', duration: 2000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerificationInput = (field: 'email' | 'phone', value: string) => {
    setVerificationForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneCodeSelect = (code: { label: string; flag: string; code: string }) => {
    setSelectedPhoneCode(code);
    setIsPhoneCodeDropdownOpen(false);
  };

  const handleSavePhoneNumber = async () => {
    const phoneNumber = verificationForm.phone?.trim();
    if (!phoneNumber) {
      addToast({
        type: 'error',
        title: 'Action failed',
        message: 'Please enter a phone number',
        duration: 2000
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        addToast({
          type: 'error',
          title: 'Authentication required',
          message: 'You must be logged in to save phone number',
          duration: 2000
        });
        return;
      }

      const fullPhoneNumber = `${selectedPhoneCode.code}${phoneNumber}`;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          phoneCode: selectedPhoneCode.code
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save phone number' }));
        throw new Error(errorData.message || 'Failed to save phone number');
      }

      const data = await response.json();
      if (data.success) {
        setProfileData(prev => ({ ...prev, phoneNumber: fullPhoneNumber }));
        // Reload user data from backend
        await reloadUserData();
        addToast({
          type: 'success',
          title: 'Action completed',
          message: 'Phone number updated successfully',
          duration: 2000
        });
      } else {
        throw new Error(data.message || 'Failed to save phone number');
      }
    } catch (error: any) {
      console.error('Error saving phone number:', error);
      addToast({
        type: 'error',
        title: 'Action failed',
        message: error.message || 'Failed to save phone number',
        duration: 2000
      });
    }
  };

  const handleChangeEmail = async () => {
    const email = verificationForm.email?.trim();
    if (!email) {
      addToast({
        type: 'error',
        title: 'Action failed',
        message: 'Please enter an email address',
        duration: 2000
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast({
        type: 'error',
        title: 'Invalid email',
        message: 'Please enter a valid email address',
        duration: 2000
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        addToast({
          type: 'error',
          title: 'Authentication required',
          message: 'You must be logged in to change email',
          duration: 2000
        });
        return;
      }

      // Call API to update email (which should trigger verification email)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update email' }));
        throw new Error(errorData.message || 'Failed to update email');
      }

      const data = await response.json();
      if (data.success) {
        // Navigate to email verification page
        navigate('/verify-email', {
          state: {
            email: email,
            fromSettings: true,
            returnTo: '/profile-settings',
            activeTab: 'verification'
          }
        });
      } else {
        throw new Error(data.message || 'Failed to update email');
      }
    } catch (error: any) {
      console.error('Error changing email:', error);
      addToast({
        type: 'error',
        title: 'Action failed',
        message: error.message || 'Failed to change email',
        duration: 2000
      });
    }
  };

  const handleSocialToggle = async (key: keyof typeof socialConnections) => {
    const isCurrentlyConnected = socialConnections[key];

    if (isCurrentlyConnected) {
      // Disconnect
      try {
        await socialAccountService.disconnect(key);
        setSocialConnections(prev => ({ ...prev, [key]: false }));
        addToast({
          type: 'success',
          title: 'Disconnected',
          message: `${key.charAt(0).toUpperCase() + key.slice(1)} account disconnected successfully`,
          duration: 3000
        });

        // Refresh status
        const status = await socialAccountService.getStatus();
        setSocialConnections({
          whatsapp: status.status.whatsapp || false,
          facebook: status.status.facebook || false,
          instagram: status.status.instagram || false,
          linkedin: status.status.linkedin || false,
          x: status.status.x || false
        });
      } catch (error: any) {
        addToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to disconnect account',
          duration: 3000
        });
      }
    } else {
      // Connect - open modal
      setSelectedSocialProvider(key as 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'x');
      setIsSocialAccountModalOpen(true);
    }
  };

  // Handle social account connection
  const handleConnectSocialAccount = async (provider: 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'x') => {
    setIsConnectingSocial(true);

    try {
      if (provider === 'whatsapp') {
        // WhatsApp requires phone number verification
        if (!whatsappPhone.trim()) {
          addToast({
            type: 'error',
            title: 'Error',
            message: 'Please enter your WhatsApp phone number',
            duration: 3000
          });
          setIsConnectingSocial(false);
          return;
        }

        // For WhatsApp, we'll use phone number as providerId
        // In a real implementation, you'd verify the phone number via OTP
        const fullPhoneNumber = `${whatsappPhoneCode.code}${whatsappPhone.trim()}`;
        await socialAccountService.connect(
          'whatsapp',
          fullPhoneNumber, // Using phone as providerId
          undefined, // No email for WhatsApp
          `WhatsApp: ${fullPhoneNumber}`, // Name
          undefined, // No access token
          undefined // No refresh token
        );
      } else {
        // OAuth providers - initiate OAuth flow
        await initiateOAuthFlow(provider);
        setIsConnectingSocial(false);
        return; // OAuth will handle the rest via callback
      }

      // Success - close modal and refresh status
      setIsSocialAccountModalOpen(false);
      setSelectedSocialProvider(null);
      setWhatsappPhone('');

      // Refresh social account status
      const status = await socialAccountService.getStatus();
      setSocialConnections({
        whatsapp: status.status.whatsapp || false,
        facebook: status.status.facebook || false,
        instagram: status.status.instagram || false,
        linkedin: status.status.linkedin || false,
        x: status.status.x || false
      });

      addToast({
        type: 'success',
        title: 'Connected',
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected successfully`,
        duration: 3000
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || `Failed to connect ${provider} account`,
        duration: 3000
      });
    } finally {
      setIsConnectingSocial(false);
    }
  };

  // Initiate OAuth flow for social providers
  const initiateOAuthFlow = async (provider: 'facebook' | 'instagram' | 'linkedin' | 'x') => {
    try {
      // Get OAuth URL from backend
      // The redirect URI should point to the backend callback endpoint, not the frontend
      // The backend will handle the OAuth callback and then redirect to frontend
      const backendCallbackUri = `${process.env.REACT_APP_API_URL}/auth/callback?provider=${provider}`;

      console.log(`[OAuth] Initiating ${provider} OAuth flow`);
      console.log(`[OAuth] Backend callback URI: ${backendCallbackUri}`);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/${provider}/connect?redirect_uri=${encodeURIComponent(backendCallbackUri)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`[OAuth] Failed to initiate ${provider} OAuth:`, errorData);
        throw new Error(errorData.message || `Failed to initiate ${provider} OAuth flow (${response.status})`);
      }

      const data = await response.json();
      const authUrl = data.data?.authUrl;

      if (!authUrl) {
        console.error(`[OAuth] No auth URL in response:`, data);
        throw new Error('OAuth URL not received from server');
      }

      console.log(`[OAuth] Opening OAuth URL for ${provider}`);

      // Open in popup window
      const width = 600;
      const height = 700;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        `${provider} OAuth`,
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Poll for popup to close (OAuth complete) or listen for message
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          // Check if connection was successful by fetching status
          setTimeout(async () => {
            try {
              const status = await socialAccountService.getStatus();
              const wasConnected = status.status[provider];

              if (wasConnected) {
                setSocialConnections({
                  whatsapp: status.status.whatsapp || false,
                  facebook: status.status.facebook || false,
                  instagram: status.status.instagram || false,
                  linkedin: status.status.linkedin || false,
                  x: status.status.x || false
                });

                setIsSocialAccountModalOpen(false);
                setSelectedSocialProvider(null);

                addToast({
                  type: 'success',
                  title: 'Connected',
                  message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected successfully`,
                  duration: 3000
                });
              } else {
                // User might have cancelled - don't show error, just close modal
                setIsSocialAccountModalOpen(false);
                setSelectedSocialProvider(null);
              }
            } catch (error) {
              console.error('Failed to check connection status:', error);
              setIsSocialAccountModalOpen(false);
              setSelectedSocialProvider(null);
            }
          }, 1500);
        }
      }, 500);

      // Listen for postMessage from OAuth callback page
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'SOCIAL_ACCOUNT_ERROR') {
          clearInterval(pollTimer);
          window.removeEventListener('message', handleMessage);
          popup.close();
          addToast({
            type: 'error',
            title: 'Connection Failed',
            message: event.data.error || `Failed to connect ${provider} account`,
            duration: 5000
          });
          setIsConnectingSocial(false);
          return;
        }

        if (event.data.type === 'SOCIAL_ACCOUNT_CONNECTED' && event.data.provider === provider) {
          clearInterval(pollTimer);
          window.removeEventListener('message', handleMessage);
          popup.close();

          try {
            // Connect account with received data
            await socialAccountService.connect(
              provider,
              event.data.providerId,
              event.data.providerEmail,
              event.data.providerName,
              event.data.accessToken,
              event.data.refreshToken
            );

            // Refresh status
            const status = await socialAccountService.getStatus();
            setSocialConnections({
              whatsapp: status.status.whatsapp || false,
              facebook: status.status.facebook || false,
              instagram: status.status.instagram || false,
              linkedin: status.status.linkedin || false,
              x: status.status.x || false
            });

            setIsSocialAccountModalOpen(false);
            setSelectedSocialProvider(null);

            addToast({
              type: 'success',
              title: 'Connected',
              message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected successfully`,
              duration: 3000
            });
          } catch (error: any) {
            addToast({
              type: 'error',
              title: 'Error',
              message: error.message || `Failed to connect ${provider} account`,
              duration: 3000
            });
          }
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || `Failed to initiate ${provider} connection`,
        duration: 3000
      });
      setIsConnectingSocial(false);
    }
  };

  // Close social account modal
  const handleCloseSocialAccountModal = () => {
    setIsSocialAccountModalOpen(false);
    setSelectedSocialProvider(null);
    setWhatsappPhone('');
    setWhatsappPhoneCode({
      label: 'United States',
      code: '+1',
      flag: 'us'
    });
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
    // Refresh 2FA status when closing modal to ensure toggle reflects actual state
    if (twoFactorModalStep === 'email') {
      // If closing from initial step, fetch status to ensure toggle is correct
      twoFactorService.getStatus().then(status => {
        setIsTwoFactorEnabled(status.isEnabled);
      }).catch(() => {
        // Keep current state on error
      });
    }
    setTwoFactorModalStep('email');
    setTwoFactorEmail('');
    setTwoFactorPassword('');
    setTwoFactorPhone('');
    setTwoFactorVerificationCode(['', '', '', '', '', '']);
    setTwoFactorErrors({});
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

  const handleTwoFactorPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!twoFactorPhone.trim()) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Please enter your phone number',
        duration: 3000
      });
      return;
    }

    setIsTwoFactorSubmitting(true);
    try {
      // Enable 2FA with phone method - this will send OTP
      await twoFactorService.enable('phone', twoFactorPhone.trim(), twoFactorSelectedPhoneCode.code);

      // Proceed to code step
      setTwoFactorModalStep('code');
      setTwoFactorCountdown(60);
      setCanResendTwoFactorCode(false);
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to send verification code',
        duration: 3000
      });
    } finally {
      setIsTwoFactorSubmitting(false);
    }
  };

  const handleTwoFactorResendCode = async () => {
    if (!canResendTwoFactorCode) return;

    try {
      await twoFactorService.resendCode();
      setTwoFactorCountdown(60);
      setCanResendTwoFactorCode(false);
      addToast({
        type: 'success',
        title: 'Code sent',
        message: 'A new verification code has been sent',
        duration: 2000
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to resend code',
        duration: 3000
      });
    }
  };

  const handleTwoFactorCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = twoFactorVerificationCode.join('');
    if (code.length !== 6) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Please enter the complete 6-digit code',
        duration: 3000
      });
      return;
    }

    setIsTwoFactorSubmitting(true);
    try {
      // Verify the code
      await twoFactorService.verifyCode(code);

      // If successful, show success step
      setTwoFactorModalStep('success');

      // Refresh 2FA status
      const status = await twoFactorService.getStatus();
      setIsTwoFactorEnabled(status.isEnabled);
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Verification failed',
        message: error.message || 'Invalid verification code',
        duration: 3000
      });
      // Clear the code inputs
      setTwoFactorVerificationCode(['', '', '', '', '', '']);
      twoFactorCodeInputRefs.current[0]?.focus();
    } finally {
      setIsTwoFactorSubmitting(false);
    }
  };

  // Handle disable 2FA email/password submission
  const handleDisableTwoFactorEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { email?: string; password?: string } = {};

    if (!disableTwoFactorEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(disableTwoFactorEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!disableTwoFactorPassword) {
      newErrors.password = 'Password is required';
    }

    setDisableTwoFactorErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsDisablingTwoFactor(true);
    try {
      // Verify credentials with backend
      await twoFactorService.verifyCredentials(disableTwoFactorEmail.trim(), disableTwoFactorPassword);

      // If successful, disable 2FA
      await twoFactorService.disable();

      // Update state
      setIsTwoFactorEnabled(false);
      setIsDisableTwoFactorModalOpen(false);
      setDisableTwoFactorEmail('');
      setDisableTwoFactorPassword('');
      setDisableTwoFactorErrors({});

      addToast({
        type: 'success',
        title: 'Success',
        message: 'Two-step verification has been disabled',
        duration: 3000
      });
    } catch (error: any) {
      setDisableTwoFactorErrors({
        general: error.message || 'Invalid email or password. Please check your credentials and try again.'
      });
    } finally {
      setIsDisablingTwoFactor(false);
    }
  };

  // Close disable 2FA modal
  const handleCloseDisableTwoFactorModal = () => {
    setIsDisableTwoFactorModalOpen(false);
    setDisableTwoFactorEmail('');
    setDisableTwoFactorPassword('');
    setDisableTwoFactorErrors({});
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

  const parseBirthday = (value?: string | null) => {
    if (!value) return null;
    const [day, month, year] = value.split('/');
    if (!day || !month || !year) return null;
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const handleGenderSelect = (gender: string) => {
    setProfileData(prev => ({
      ...prev,
      gender,
      fullName: prev.fullName || '',
      birthDate: prev.birthDate || '',
      profileImage: prev.profileImage || ''
    }));
    setIsGenderDropdownOpen(false);
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

      if (countryDropdownRef.current && !countryDropdownRef.current.contains(target) && isCountryDropdownOpen) {
        setIsCountryDropdownOpen(false);
      }

      if (whatsappPhoneCodeDropdownRef.current && !whatsappPhoneCodeDropdownRef.current.contains(target) && isWhatsappPhoneCodeDropdownOpen) {
        setIsWhatsappPhoneCodeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isMenuDropdownOpen, isNotificationOpen, isGenderDropdownOpen, isBirthdayCalendarOpen, isPhoneCodeDropdownOpen, isPasswordModalOpen, isTwoFactorModalOpen, isTwoFactorPhoneCodeDropdownOpen, isCountryDropdownOpen, isWhatsappPhoneCodeDropdownOpen]);

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
          onClick={() => {
            // If in settings sidebar, go to home
            navigate('/');
          }}
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
        className={`min-h-screen ${(isMobileProfileView || isMobileSecurityView || isMobileLanguageView || isMobileNotificationsView) ? 'bg-white' : 'bg-gray-50'}`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {isMobile && isMobileSidebarVisible && renderMobileSidebar()}
        {(!isMobile || !isMobileSidebarVisible) && (
          <div className={`flex ${isMobile ? 'flex-col min-h-screen' : 'h-screen'}`}>
            {/* Left Sidebar - Full Height */}
            <div className={`w-72 bg-white border-r-2 border-gray-300 flex-col h-screen top-0 relative ${isMobile ? 'hidden' : 'flex'}`}>
              {/* Header */}
              <header className={`bg-white ${isMobile ? 'hidden' : ''}`}>
                <div className="w-full pl-6 pr-0 sm:pl-6 sm:pr-2 lg:pl-6 lg:pr-4">
                  <div className="flex items-center justify-between h-16">
                    {/* Desktop - Logo and sidebar button */}
                    <div className="flex items-center justify-between w-full">
                      <Link to='/'>
                        <img
                          src={logo}
                          alt="bao'Afrik"
                          className="h-8 w-auto"
                        />
                      </Link>

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
                      {/* <div className="relative language-selector">
                        <button
                          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                          className="flex items-center px-2.5 py-1 border rounded-lg bg-white text-sm font-normal hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                          style={{ borderColor: '#E4E4E4', color: '#BABABA' }}
                        >
                          {selectedLanguage}
                          <img src={arrowDownIcon} alt="Arrow" className="ml-1 w-4 h-4" />
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

                      {/* Notification Button */}
                      <div className="relative notification-dropdown">
                        <button
                          onClick={async () => {
                            if (!isNotificationOpen) {
                              // Refresh notifications when opening dropdown
                              await refreshNotifications();
                            }
                            setIsNotificationOpen(!isNotificationOpen);
                          }}
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
                              {(() => {
                                // Get unique days from notifications
                                const days = Array.from(new Set(filteredNotifications.map(n => n.day || 'Other').filter(Boolean)));
                                return days.map(day => {
                                  const dayNotifs = filteredNotifications.filter(n => (n.day || 'Other') === day);
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
                                                {(() => {
                                                  const avatarUrl = getNotificationAvatar(notif);
                                                  const isMessage = notif.type === 'message' || notif.type === 'NEW_MESSAGE';

                                                  // For messages, always try to show sender's image
                                                  if (isMessage && avatarUrl) {
                                                    return (
                                                      <img
                                                        src={avatarUrl}
                                                        alt="Avatar"
                                                        className="w-9 h-9 rounded-full object-cover"
                                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatar; }}
                                                      />
                                                    );
                                                  }

                                                  // For product notifications, show seller image if available
                                                  if (notif.type === 'product' && avatarUrl) {
                                                    return (
                                                      <img
                                                        src={avatarUrl}
                                                        alt="Seller"
                                                        className="w-9 h-9 rounded-full object-cover"
                                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = logoIcon; }}
                                                      />
                                                    );
                                                  }

                                                  // For all other cases, show logo
                                                  return (
                                                    <img
                                                      src={logoIcon}
                                                      alt="Logo"
                                                      className="w-7 h-7"
                                                      style={{ filter: 'brightness(0) invert(1)' }}
                                                    />
                                                  );
                                                })()}
                                              </div>
                                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF' }}>
                                                <img src={(notif.type === 'message' || notif.type === 'NEW_MESSAGE') ? messageAvatarIcon : appNotificationIcon} alt="Icon" className="w-3 h-3" />
                                              </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                  {/* Message notifications */}
                                                  {(notif.type === 'message' || notif.type === 'NEW_MESSAGE') ? (
                                                    <>
                                                      <p style={{ fontSize: '14px' }}>
                                                        {(() => {
                                                          const isReaction =
                                                            notif.meta?.messageType === 'REACTION' ||
                                                            notif.meta?.type === 'reaction' ||
                                                            Boolean(notif.meta?.reaction);
                                                          const senderName = getNotificationSenderName(notif);
                                                          const reactionValue = notif.meta?.reaction;

                                                          if (isReaction && reactionValue) {
                                                            return (
                                                              <>
                                                                <span className="font-medium" style={{ color: notif.isRead ? '#939393' : '#616161' }}>
                                                                  {senderName}
                                                                </span>
                                                                <span style={{ color: '#939393' }}> reacted "{reactionValue}" to a message</span>
                                                              </>
                                                            );
                                                          }

                                                          return (
                                                            <>
                                                              <span className="font-medium" style={{ color: notif.isRead ? '#939393' : '#616161' }}>
                                                                {senderName}
                                                              </span>
                                                              <span style={{ color: '#939393' }}> {notif.body || notif.text || 'sent you a message'}</span>
                                                            </>
                                                          );
                                                        })()}
                                                      </p>
                                                      {notif.meta?.preview && !(
                                                        notif.meta?.messageType === 'REACTION' ||
                                                        notif.meta?.type === 'reaction' ||
                                                        Boolean(notif.meta?.reaction)
                                                      ) && (
                                                          <p
                                                            className="mt-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                                                            style={{
                                                              color: !notif.isRead ? '#64B5F6' : '#9E9E9E',
                                                              fontSize: '13px',
                                                              textDecoration: 'underline'
                                                            }}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleNotificationClick(notif);
                                                            }}
                                                          >
                                                            Click to view
                                                          </p>
                                                        )}
                                                    </>
                                                  ) : (
                                                    /* App notifications (product, etc.) */
                                                    <>
                                                      <p style={{ fontSize: '14px' }}>
                                                        {(notif.text || notif.meta?.text || notif.title) ? (
                                                          <>
                                                            <span className="font-medium" style={{ color: notif.isRead ? '#939393' : '#616161' }}>
                                                              {notif.text || notif.meta?.text || notif.title || getNotificationSenderName(notif)}
                                                            </span>
                                                            {(notif.additionalText || notif.meta?.additionalText) && (
                                                              <span style={{ color: '#939393' }}> {notif.additionalText || notif.meta.additionalText}</span>
                                                            )}
                                                            {!notif.additionalText && !notif.meta?.additionalText && notif.body && (
                                                              <span style={{ color: '#939393' }}> {notif.body}</span>
                                                            )}
                                                          </>
                                                        ) : (
                                                          <>
                                                            <span className="font-medium" style={{ color: notif.isRead ? '#939393' : '#616161' }}>
                                                              {notif.title || getNotificationSenderName(notif)}
                                                            </span>
                                                            {notif.body && <span style={{ color: '#939393' }}> {notif.body}</span>}
                                                          </>
                                                        )}
                                                      </p>
                                                      {(notif.subText || notif.meta?.subText) && (
                                                        <p className="mt-1.5" style={{ color: '#9E9E9E', fontSize: '13px' }}>
                                                          {notif.subText || notif.meta?.subText}
                                                        </p>
                                                      )}
                                                    </>
                                                  )}
                                                </div>
                                                <div className="flex flex-col items-end ml-4 flex-shrink-0" style={{ gap: notif.isRead ? '4px' : '8px' }}>
                                                  {notif.time && (
                                                    <span style={{ color: '#9E9E9E', fontSize: '12px' }}>{notif.time}</span>
                                                  )}
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
                                });
                              })()}
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
                          src={user?.profileImage || avatar}
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
                              {/* <Link
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
                              </Link> */}
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
                                src={user?.profileImage || avatar}
                                alt="User avatar"
                                className="w-12 h-12 rounded-full object-cover"
                                width="48"
                                height="48"
                              />
                              <div className="flex-1">
                                <p className="text-xs text-gray-500">My profile</p>
                                <div className="flex items-center justify-between">
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
                                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#E3F2FD' }}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#64B5F6' }}>
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

                              {/* Help Centre */}
                              <Link
                                to="/help"
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors rounded-lg"
                                onClick={() => setIsMenuDropdownOpen(false)}
                              >
                                <div className="flex items-center space-x-2">
                                  <img src={podsIcon} alt="Pods" className="w-4 h-4" style={{ color: '#64B5F6' }} />
                                  <div>
                                    <div className="font-medium text-sm" style={{ color: '#6A6A6A' }}>Help Centre</div>
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
                                    handleLogout();
                                    setIsMenuDropdownOpen(false);
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

              {/* Main Content */}
              <div className={`${mainLayoutClasses} ${isMobile ? '' : 'overflow-hidden'}`} style={mainLayoutStyle}>
                {/* Left Content Area */}
                <div className={`${leftPaneClasses} py-4 overflow-y-auto profile-settings-content`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {(isMobileProfileView || isMobileSecurityView || isMobileLanguageView || isMobileNotificationsView) && (
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (isMobileNotificationsView && mobileNotificationDetailView !== null) {
                            setMobileNotificationDetailView(null);
                          } else {
                            // If in a tab, go back to settings (show sidebar)
                            setIsMobileSidebarVisible(true);
                          }
                        }}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                        style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
                        aria-label="Back to settings"
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
                        className={`flex items-center space-x-4 mb-2 border-b border-gray-200 ${isMobileProfileView ? '-mx-4 px-4' : isMobile ? '' : '-mx-8 px-8'
                          }`}
                      >
                        <button
                          onClick={() => setActiveTab('personal')}
                          className={`flex items-center space-x-1.5 pb-2 relative ${activeTab === 'personal' ? 'border-b-2' : ''
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
                          className={`flex items-center space-x-1.5 pb-2 relative ${activeTab === 'verification' ? 'border-b-2' : ''
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
                                className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
                                onClick={handleUploadButtonClick}
                                style={{
                                  borderColor: isUploadingImage ? '#83C4F8' : '#E1E1E1',
                                  borderRadius: '13px',
                                  background: isUploadingImage
                                    ? 'repeating-linear-gradient(-45deg, #F5FBFF, #F5FBFF 18px, #F8FCFF 18px, #F8FCFF 36px)'
                                    : (profileImage ? 'transparent' : 'transparent'),
                                  border: isUploadingImage ? '2px dashed #83C4F8' : (profileImage ? 'none' : '2px dashed #E1E1E1')
                                }}
                              >
                                {isUploadingImage ? (
                                  <div className="flex flex-col items-center justify-center w-full h-full">
                                    <div className="relative">
                                      <svg width="64" height="64" className="transform -rotate-90">
                                        {/* Gray base circle */}
                                        <circle
                                          cx="32"
                                          cy="32"
                                          r="28"
                                          fill="none"
                                          stroke="#E9E9E9"
                                          strokeWidth="2"
                                        />
                                        {/* Blue progress arc */}
                                        <circle
                                          cx="32"
                                          cy="32"
                                          r="28"
                                          fill="none"
                                          stroke="#83C4F8"
                                          strokeWidth="2"
                                          strokeDasharray={`${(uploadProgress / 100) * 176} 176`}
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                      {/* Icon in center */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <img
                                          src={loadIcon}
                                          alt="Loading"
                                          style={{
                                            width: '24px',
                                            height: '24px',
                                            filter: 'brightness(0) saturate(100%) invert(70%) sepia(36%) saturate(624%) hue-rotate(172deg) brightness(100%) contrast(96%)'
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <p className="text-[10px] font-medium mt-2" style={{ color: '#83C4F8' }}>
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
                                  style={{
                                    backgroundColor: 'white',
                                    color: profileImage ? '#EF4444' : '#6A6A6A',
                                    borderColor: '#D9D9D9',
                                    width: 'fit-content'
                                  }}
                                  disabled={isUploadingImage}
                                >
                                  {profileImage ? 'Remove photo' : 'Upload a photo'}
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
                            className={`rounded-2xl p-2 bg-white ${isMobileProfileView && isEditingProfile ? '' : 'border shadow-sm'
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
                                        <p className="text-xs font-medium" style={{ color: '#212121' }}>{formatBirthDateForDisplay(profileData.birthDate)}</p>
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
                                      <p className="text-xs font-medium" style={{ color: '#212121' }}>{profileData.birthDate}</p>
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
                                  <div className="mt-4">
                                    <label htmlFor="birthday" className="text-[10px] mb-1 block" style={{ color: '#6A6A6A' }}>
                                      Birthday
                                    </label>
                                    <div className="relative">
                                      <DatePicker
                                        selected={formData.birthDate ? new Date(formData.birthDate) : null}
                                        onChange={handleDateChange}
                                        dateFormat="MMMM d, yyyy"
                                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-2 pr-6 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                                        placeholderText="Select your birthday"
                                        showYearDropdown
                                        dropdownMode="select"
                                        yearDropdownItemNumber={100}
                                        scrollableYearDropdown
                                        maxDate={new Date()}
                                        showMonthDropdown
                                      />
                                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                      </div>
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
                                  disabled={isFetchingCountries}
                                >
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isGeolocationEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}>
                                    {isFetchingCountries && (
                                      <div className="flex h-full items-center justify-center">
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                                      </div>
                                    )}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Location Field */}
                            <div className="relative" ref={countryDropdownRef}>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px]" style={{ color: '#6A6A6A' }}></label>
                                <button
                                  onClick={handleSaveLocation}
                                  className="flex items-center space-x-1"
                                  style={{ color: '#BABABA' }}
                                >
                                  <span className="text-[10px]">Save location</span>
                                  <img src={arrowDownIcon} alt="Save" className="w-3 h-3" style={{ transform: 'rotate(180deg)' }} />
                                </button>
                              </div>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                  className="w-full px-3 py-2 pr-8 rounded-lg text-xs text-left focus:outline-none"
                                  style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E9E9E9',
                                    color: (selectedCountry?.name || formData.location) ? '#212121' : '#B0B0B0'
                                  }}
                                >
                                  {selectedCountry?.name || formData.location || 'Select a country'}
                                </button>
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9l6 6 6-6" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                {isCountryDropdownOpen && (
                                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg py-2 max-h-60 overflow-auto custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    {countries.length > 0 ? (
                                      countries.map((country) => (
                                        <button
                                          type="button"
                                          key={country.code}
                                          onClick={() => handleCountrySelect(country)}
                                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs"
                                          style={{
                                            backgroundColor: selectedCountry?.code === country.code ? '#F0F8FE' : 'transparent',
                                            color: selectedCountry?.code === country.code ? '#64B5F6' : '#212121'
                                          }}
                                        >
                                          {country.name}
                                        </button>
                                      ))
                                    ) : (
                                      <div className="text-gray-500 py-2 px-3 text-xs">No countries found</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Biography Section */}
                          {isMobileProfileView && (
                            <div className="mb-0.5 px-1">
                              <h3 className="text-xs font-medium" style={{ color: '#6A6A6A' }}>Biography</h3>
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
                                  type="button"
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
                                  style={{ backgroundColor: '#E9E9E9', color: '#6A6A6A' }}
                                  onClick={handleSaveBio}
                                >
                                  Save Bio
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
                                <button
                                  onClick={handleChangeEmail}
                                  className="text-[10px] font-normal"
                                  style={{ color: '#64B5F6' }}
                                >
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
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-medium" style={{ color: '#6A6A6A' }}>
                                  Phone number
                                </label>
                                <button
                                  onClick={handleSavePhoneNumber}
                                  className="flex items-center space-x-1"
                                  style={{ color: '#BABABA' }}
                                >
                                  <span className="text-[10px]">Save phone number</span>
                                  <img src={arrowDownIcon} alt="Save" className="w-3 h-3" style={{ transform: 'rotate(180deg)' }} />
                                </button>
                              </div>
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
                                    <div className="absolute z-30 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 max-h-60 overflow-y-auto phone-code-dropdown" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                      {phoneCodes.map(code => (
                                        <button
                                          type="button"
                                          key={code.isoCode}
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
                                    type="button"
                                    disabled
                                    aria-label={`${platform.name} verification (coming soon)`}
                                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors opacity-60 cursor-not-allowed"
                                    style={{ backgroundColor: socialConnections[platform.key as keyof typeof socialConnections] ? '#64B5F6' : '#E4E4E4' }}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${socialConnections[platform.key as keyof typeof socialConnections] ? 'translate-x-5' : 'translate-x-0.5'
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
                            type="button"
                            disabled
                            aria-label="Two step verification"
                            onClick={() => {
                              if (!isTwoFactorEnabled) {
                                // Don't set to true yet - only after successful verification
                                if (isMobileSecurityView) {
                                  // Navigate to mobile flow instead of opening modal
                                  navigate('/two-factor-email', { state: { fromProfileSettings: true } });
                                } else {
                                  setIsTwoFactorModalOpen(true);
                                  setTwoFactorModalStep('email');
                                }
                              } else {
                                // Show disable modal with email/password verification
                                setIsDisableTwoFactorModalOpen(true);
                                setDisableTwoFactorEmail('');
                                setDisableTwoFactorPassword('');
                                setDisableTwoFactorErrors({});
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isMobileSecurityView ? 'shrink-0' : ''}`}
                            style={{ backgroundColor: isTwoFactorEnabled ? '#64B5F6' : '#E4E4E4', marginTop: isMobileSecurityView ? '4px' : undefined, cursor: 'not-allowed' }}

                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isTwoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'
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
                                {shouldShowSessionHistory ? 'Hide session history' : 'Show session history'}
                              </button>
                            )}
                          </div>
                          {isLoadingSessions ? (
                            <div className="text-center py-4">
                              <p className="text-sm" style={{ color: '#B0B0B0' }}>Loading sessions...</p>
                            </div>
                          ) : sessions.length === 0 ? (
                            <div className="text-center py-4">
                              <p className="text-sm" style={{ color: '#B0B0B0' }}>No active sessions</p>
                            </div>
                          ) : (
                            <div className={isMobileSecurityView ? 'space-y-1' : 'space-y-3'}>
                              {sessions.filter(s => s.isCurrent).map((session) =>
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
                          )}
                        </div>

                        {shouldShowSessionHistory && sessions.filter(s => !s.isCurrent).length > 0 && (
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
                              {sessions.filter(s => !s.isCurrent).map((session, index) =>
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
                        )}
                      </div>
                    </div>
                  )}

                  {selectedSidebarOption === 'language' && (
                    <div className={`space-y-6 ${isMobileLanguageView ? 'px-1' : 'px-4 sm:px-6 lg:px-10'}`}>
                      {/* Title and Description - Hidden on mobile */}
                      {!isMobileLanguageView && (
                        <div className="mb-6">
                          <h1 className="text-base font-medium mb-2" style={{ color: '#212121', fontFamily: 'Poppins, sans-serif' }}>
                            Language and Currency
                          </h1>
                          <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                            Customize your language preferences and currency settings to enhance your shopping experience on BAO' Afrik.
                          </p>
                        </div>
                      )}

                      {/* Content Area */}
                      <div className={`bg-white ${isMobileLanguageView ? '' : 'border'} rounded-[20px] ${isMobileLanguageView ? 'p-4' : 'p-6'}`} style={isMobileLanguageView ? { marginLeft: '-4px' } : { borderColor: '#E4E4E4', marginTop: '32px' }}>
                        {/* Language Section */}
                        <div className="mb-10">
                          <h2 className={`${isMobileLanguageView ? 'text-base font-semibold' : 'text-sm font-medium'} mb-1.5`} style={{ color: '#212121', fontFamily: isMobileLanguageView ? 'Bricolage Grotesque, sans-serif' : 'Poppins, sans-serif' }}>
                            Language Setting
                          </h2>
                          <p className={`${isMobileLanguageView ? 'text-[11px]' : 'text-xs'} mb-4`} style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                            Control what others are seeing from you on BAO' Afrik.
                          </p>
                          <div className={`flex items-center ${isMobileLanguageView ? 'gap-2' : 'gap-3'} flex-wrap`}>
                            {languageOptions.map((lang, index) => {
                              const isSelected = languagePreference === lang.code;
                              const isSupported = lang.code === 'en';
                              return (
                                <button
                                  key={lang.code}
                                  onClick={() => {
                                    if (!isSupported) return;
                                    setLanguagePreference(lang.code as 'en' | 'fr' | 'de' | 'es');
                                  }}
                                  className={`flex items-center gap-2 ${isMobileLanguageView ? 'px-3 py-1' : 'px-4 py-1'} rounded-full border transition-colors`}
                                  style={{
                                    backgroundColor: isSelected ? '#F0F8FE' : 'white',
                                    borderColor: isSelected ? '#CFE8FC' : '#E1E1E1',
                                    fontFamily: 'Poppins, sans-serif',
                                    cursor: isSupported ? 'pointer' : 'not-allowed',
                                    opacity: isSupported ? 1 : 0.6,
                                    ...(isMobileLanguageView && {
                                      flexBasis: index < 3 ? 'calc((100% - 16px) / 3)' : 'auto',
                                      maxWidth: index < 3 ? 'calc((100% - 16px) / 3)' : 'none',
                                      flexShrink: 0
                                    })
                                  }}
                                  disabled={!isSupported}
                                  title={!isSupported ? 'Coming soon' : undefined}
                                >
                                  {isSelected ? (
                                    <div className={`${isMobileLanguageView ? 'w-3 h-3' : 'w-4 h-4'} rounded-full flex items-center justify-center`} style={{ backgroundColor: '#64B5F6' }}>
                                      <svg className={`${isMobileLanguageView ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} fill="none" stroke="white" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <img
                                      src={`https://flagcdn.com/w20/${lang.flag}.png`}
                                      alt={lang.label}
                                      className={`${isMobileLanguageView ? 'w-3 h-3' : 'w-4 h-4'} rounded-full`}
                                      style={{ objectFit: 'cover' }}
                                    />
                                  )}
                                  <span className={`${isMobileLanguageView ? 'text-[10px]' : 'text-xs'} font-medium`} style={{ color: '#6A6A6A' }}>
                                    {lang.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Currency Section */}
                        <div>
                          <h2 className={`${isMobileLanguageView ? 'text-base font-semibold' : 'text-sm font-medium'} mb-1.5`} style={{ color: '#212121', fontFamily: isMobileLanguageView ? 'Bricolage Grotesque, sans-serif' : 'Poppins, sans-serif' }}>
                            Currency Preferences
                          </h2>
                          <p className={`${isMobileLanguageView ? 'text-[11px]' : 'text-xs'} mb-4`} style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                            Choose the currency you want to see product prices in.
                          </p>
                          <div className={`flex items-center ${isMobileLanguageView ? 'gap-2' : 'gap-3'} ${isMobileLanguageView ? 'flex-nowrap' : 'flex-wrap'}`}>
                            {[
                              { code: 'USD', flag: 'us', name: 'United States Dollar' },
                              { code: 'EUR', flag: 'eu', name: 'Euro' },
                              { code: 'CAD', flag: 'ca', name: 'Canadian Dollar' },
                              { code: 'GBP', flag: 'gb', name: 'British Pound' }
                            ].map((currency) => {
                              const isSelected = currencyPreference === currency.code;
                              const isSupported = currency.code === 'GBP';
                              return (
                                <button
                                  key={currency.code}
                                  onClick={() => {
                                    if (!isSupported) return;
                                    setCurrencyPreference(currency.code as 'USD' | 'EUR' | 'CAD' | 'GBP');
                                  }}
                                  className={`flex items-center gap-2 ${isMobileLanguageView ? 'px-3 py-1' : 'px-4 py-1'} rounded-full border transition-colors`}
                                  style={{
                                    backgroundColor: isSelected ? '#F0F8FE' : 'white',
                                    borderColor: isSelected ? '#CFE8FC' : '#E1E1E1',
                                    fontFamily: 'Poppins, sans-serif',
                                    cursor: isSupported ? 'pointer' : 'not-allowed',
                                    opacity: isSupported ? 1 : 0.6,
                                    ...(isMobileLanguageView && {
                                      flex: '1 1 0',
                                      minWidth: 0
                                    })
                                  }}
                                  disabled={!isSupported}
                                  title={!isSupported ? 'Coming soon' : undefined}
                                >
                                  {isSelected ? (
                                    <div className={`${isMobileLanguageView ? 'w-3 h-3' : 'w-5 h-5'} rounded-full flex items-center justify-center`} style={{ backgroundColor: '#64B5F6' }}>
                                      <svg className={`${isMobileLanguageView ? 'w-2 h-2' : 'w-3 h-3'}`} fill="none" stroke="white" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <img
                                      src={`https://flagcdn.com/w20/${currency.flag}.png`}
                                      alt={currency.name}
                                      className={`${isMobileLanguageView ? 'w-3 h-3' : 'w-4 h-4'} rounded-full`}
                                      style={{ objectFit: 'cover' }}
                                    />
                                  )}
                                  <span className={`${isMobileLanguageView ? 'text-[10px]' : 'text-xs'} font-medium`} style={{ color: '#6A6A6A' }}>
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
                    <>
                      {isMobileNotificationsView ? (
                        mobileNotificationDetailView === null ? (
                          <div className="px-4">
                            {/* Title and Description */}
                            <div className="mb-6">
                              <h1 className="text-base font-semibold mb-2" style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                Notifications Setting
                              </h1>
                              <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                Update your profile and control what others see on BAO' Afrik.
                              </p>
                            </div>

                            {/* Notification Categories List */}
                            <div className="space-y-6">
                              {/* General Notifications */}
                              <div className="flex items-center justify-between">
                                <div
                                  className="flex-1 cursor-pointer"
                                  onClick={() => setMobileNotificationDetailView('general')}
                                >
                                  <h3 className="text-xs font-medium mb-1" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                    General Notifications
                                  </h3>
                                  <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                    All notifications from tour profile and your activities on our app
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGeneralNotificationsToggle();
                                  }}
                                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4"
                                  style={{ backgroundColor: generalNotifications.enabled ? '#87E697' : '#E4E4E4' }}
                                >
                                  <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${generalNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                      }`}
                                  />
                                </button>
                              </div>

                              {/* Messages Notifications */}
                              <div className="flex items-center justify-between">
                                <div
                                  className="flex-1 cursor-pointer"
                                  onClick={() => setMobileNotificationDetailView('messages')}
                                >
                                  <h3 className="text-xs font-medium mb-1" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                    Messages Notifications
                                  </h3>
                                  <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                    All messages and mentions from our messagings
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMessagesNotificationsToggle();
                                  }}
                                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4"
                                  style={{ backgroundColor: messagesNotifications.enabled ? '#87E697' : '#E4E4E4' }}
                                >
                                  <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${messagesNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                      }`}
                                  />
                                </button>
                              </div>

                              {/* News and updates */}
                              <div className="flex items-center justify-between">
                                <div
                                  className="flex-1 cursor-pointer"
                                  onClick={() => setMobileNotificationDetailView('news')}
                                >
                                  <h3 className="text-xs font-medium mb-1" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                    News and updates
                                  </h3>
                                  <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                    News and Updates from BAO 'Afrik
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNewsNotificationsToggle();
                                  }}
                                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4"
                                  style={{ backgroundColor: newsNotifications.enabled ? '#87E697' : '#E4E4E4' }}
                                >
                                  <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${newsNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                      }`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="px-4">
                            {/* General Notifications Detail View */}
                            {mobileNotificationDetailView === 'general' && (
                              <>
                                <div className="mb-6">
                                  <h1 className="text-base font-semibold mb-2" style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                    General Notifications
                                  </h1>
                                  <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                    Manage your privacy preferences and keep your account secure on BAO' Afrik.
                                  </p>
                                </div>

                                <div className="space-y-6">
                                  {/* Reviews and rates */}
                                  <div>
                                    <h3 className="text-xs font-medium mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                      Reviews and rates
                                    </h3>
                                    <div className="flex items-start justify-between mb-3">
                                      <p className="text-[10px] flex-1 pr-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                        Receive alerts when users<br />review or rate your products/Profile.
                                      </p>
                                      <button
                                        onClick={() => {
                                          const newState = !generalNotifications.reviewsAndRates.push && !generalNotifications.reviewsAndRates.email && !generalNotifications.reviewsAndRates.inApp;
                                          setGeneralNotifications({
                                            ...generalNotifications,
                                            reviewsAndRates: { push: newState, email: newState, inApp: newState }
                                          });
                                        }}
                                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                                        style={{ backgroundColor: (generalNotifications.reviewsAndRates.push && generalNotifications.reviewsAndRates.email && generalNotifications.reviewsAndRates.inApp) ? '#87E697' : '#E4E4E4' }}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(generalNotifications.reviewsAndRates.push && generalNotifications.reviewsAndRates.email && generalNotifications.reviewsAndRates.inApp) ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                                        <button
                                          onClick={() => setGeneralNotifications({
                                            ...generalNotifications,
                                            reviewsAndRates: { ...generalNotifications.reviewsAndRates, push: !generalNotifications.reviewsAndRates.push }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: generalNotifications.reviewsAndRates.push ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.reviewsAndRates.push ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                                        <button
                                          onClick={() => setGeneralNotifications({
                                            ...generalNotifications,
                                            reviewsAndRates: { ...generalNotifications.reviewsAndRates, email: !generalNotifications.reviewsAndRates.email }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: generalNotifications.reviewsAndRates.email ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.reviewsAndRates.email ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                                        <button
                                          onClick={() => setGeneralNotifications({
                                            ...generalNotifications,
                                            reviewsAndRates: { ...generalNotifications.reviewsAndRates, inApp: !generalNotifications.reviewsAndRates.inApp }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: generalNotifications.reviewsAndRates.inApp ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.reviewsAndRates.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Subscription Renewal */}
                                  <div>
                                    <h3 className="text-xs font-medium mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                      Subscription Renewal
                                    </h3>
                                    <div className="flex items-start justify-between mb-3">
                                      <p className="text-[10px] flex-1 pr-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                        Remind users of upcoming subscription<br />renewals, ensuring continuity of service.
                                      </p>
                                      <button
                                        onClick={() => {
                                          const newState = !generalNotifications.subscriptionRenewal.push && !generalNotifications.subscriptionRenewal.email && !generalNotifications.subscriptionRenewal.inApp;
                                          setGeneralNotifications({
                                            ...generalNotifications,
                                            subscriptionRenewal: { push: newState, email: newState, inApp: newState }
                                          });
                                        }}
                                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                                        style={{ backgroundColor: (generalNotifications.subscriptionRenewal.push && generalNotifications.subscriptionRenewal.email && generalNotifications.subscriptionRenewal.inApp) ? '#87E697' : '#E4E4E4' }}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(generalNotifications.subscriptionRenewal.push && generalNotifications.subscriptionRenewal.email && generalNotifications.subscriptionRenewal.inApp) ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                                        <button
                                          onClick={() => setGeneralNotifications({
                                            ...generalNotifications,
                                            subscriptionRenewal: { ...generalNotifications.subscriptionRenewal, push: !generalNotifications.subscriptionRenewal.push }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: generalNotifications.subscriptionRenewal.push ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.subscriptionRenewal.push ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                                        <button
                                          onClick={() => setGeneralNotifications({
                                            ...generalNotifications,
                                            subscriptionRenewal: { ...generalNotifications.subscriptionRenewal, email: !generalNotifications.subscriptionRenewal.email }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: generalNotifications.subscriptionRenewal.email ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.subscriptionRenewal.email ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                                        <button
                                          onClick={() => setGeneralNotifications({
                                            ...generalNotifications,
                                            subscriptionRenewal: { ...generalNotifications.subscriptionRenewal, inApp: !generalNotifications.subscriptionRenewal.inApp }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: generalNotifications.subscriptionRenewal.inApp ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.subscriptionRenewal.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Messages Notifications Detail View */}
                            {mobileNotificationDetailView === 'messages' && (
                              <>
                                <div className="mb-6">
                                  <h1 className="text-base font-semibold mb-2" style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                    Messages notifications
                                  </h1>
                                  <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                    All messages and mentions from our messagings
                                  </p>
                                </div>

                                <div className="space-y-6">
                                  {/* Messages */}
                                  <div>
                                    <h3 className="text-xs font-medium mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                      Messages
                                    </h3>
                                    <div className="flex items-start justify-between mb-3">
                                      <p className="text-[10px] flex-1 pr-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                        Alert users when they<br />receive a new direct message.
                                      </p>
                                      <button
                                        onClick={() => {
                                          const newState = !messagesNotifications.messages.push && !messagesNotifications.messages.email && !messagesNotifications.messages.inApp;
                                          setMessagesNotifications({
                                            ...messagesNotifications,
                                            messages: { push: newState, email: newState, inApp: newState }
                                          });
                                        }}
                                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                                        style={{ backgroundColor: (messagesNotifications.messages.push && messagesNotifications.messages.email && messagesNotifications.messages.inApp) ? '#87E697' : '#E4E4E4' }}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(messagesNotifications.messages.push && messagesNotifications.messages.email && messagesNotifications.messages.inApp) ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            messages: { ...messagesNotifications.messages, push: !messagesNotifications.messages.push }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.messages.push ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messages.push ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            messages: { ...messagesNotifications.messages, email: !messagesNotifications.messages.email }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.messages.email ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messages.email ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            messages: { ...messagesNotifications.messages, inApp: !messagesNotifications.messages.inApp }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.messages.inApp ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messages.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Message reminders */}
                                  <div>
                                    <h3 className="text-xs font-medium mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                      Message reminders
                                    </h3>
                                    <div className="flex items-start justify-between mb-3">
                                      <p className="text-[10px] flex-1 pr-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                        Remind users to respond to unread<br />messages, fostering engagement.
                                      </p>
                                      <button
                                        onClick={() => {
                                          const newState = !messagesNotifications.messageReminders.push && !messagesNotifications.messageReminders.email && !messagesNotifications.messageReminders.inApp;
                                          setMessagesNotifications({
                                            ...messagesNotifications,
                                            messageReminders: { push: newState, email: newState, inApp: newState }
                                          });
                                        }}
                                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                                        style={{ backgroundColor: (messagesNotifications.messageReminders.push && messagesNotifications.messageReminders.email && messagesNotifications.messageReminders.inApp) ? '#87E697' : '#E4E4E4' }}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(messagesNotifications.messageReminders.push && messagesNotifications.messageReminders.email && messagesNotifications.messageReminders.inApp) ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            messageReminders: { ...messagesNotifications.messageReminders, push: !messagesNotifications.messageReminders.push }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.messageReminders.push ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messageReminders.push ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            messageReminders: { ...messagesNotifications.messageReminders, email: !messagesNotifications.messageReminders.email }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.messageReminders.email ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messageReminders.email ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            messageReminders: { ...messagesNotifications.messageReminders, inApp: !messagesNotifications.messageReminders.inApp }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.messageReminders.inApp ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messageReminders.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Chat Requests */}
                                  <div>
                                    <h3 className="text-xs font-medium mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                      Chat Requests
                                    </h3>
                                    <div className="flex items-start justify-between mb-3">
                                      <p className="text-[10px] flex-1 pr-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                        Notify users of new chat requests, even<br />when is not initiated from a product page.
                                      </p>
                                      <button
                                        onClick={() => {
                                          const newState = !messagesNotifications.chatRequests.push && !messagesNotifications.chatRequests.email && !messagesNotifications.chatRequests.inApp;
                                          setMessagesNotifications({
                                            ...messagesNotifications,
                                            chatRequests: { push: newState, email: newState, inApp: newState }
                                          });
                                        }}
                                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                                        style={{ backgroundColor: (messagesNotifications.chatRequests.push && messagesNotifications.chatRequests.email && messagesNotifications.chatRequests.inApp) ? '#87E697' : '#E4E4E4' }}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(messagesNotifications.chatRequests.push && messagesNotifications.chatRequests.email && messagesNotifications.chatRequests.inApp) ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            chatRequests: { ...messagesNotifications.chatRequests, push: !messagesNotifications.chatRequests.push }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.chatRequests.push ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.chatRequests.push ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            chatRequests: { ...messagesNotifications.chatRequests, email: !messagesNotifications.chatRequests.email }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.chatRequests.email ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.chatRequests.email ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                                        <button
                                          onClick={() => setMessagesNotifications({
                                            ...messagesNotifications,
                                            chatRequests: { ...messagesNotifications.chatRequests, inApp: !messagesNotifications.chatRequests.inApp }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: messagesNotifications.chatRequests.inApp ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.chatRequests.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* News and updates Detail View */}
                            {mobileNotificationDetailView === 'news' && (
                              <>
                                <div className="mb-6">
                                  <h1 className="text-base font-semibold mb-2" style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                    News and updates
                                  </h1>
                                  <p className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                    News and Updates from BAO 'Afrik
                                  </p>
                                </div>

                                <div className="space-y-6">
                                  {/* Newsletter */}
                                  <div>
                                    <h3 className="text-xs font-medium mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                      Newsletter
                                    </h3>
                                    <div className="flex items-start justify-between mb-3">
                                      <p className="text-[10px] flex-1 pr-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                        Get updates, offers, and trends<br />in African art and culture.
                                      </p>
                                      <button
                                        onClick={() => {
                                          const newState = !newsNotifications.newsletter.push && !newsNotifications.newsletter.email && !newsNotifications.newsletter.inApp;
                                          setNewsNotifications({
                                            ...newsNotifications,
                                            newsletter: { push: newState, email: newState, inApp: newState }
                                          });
                                        }}
                                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                                        style={{ backgroundColor: (newsNotifications.newsletter.push && newsNotifications.newsletter.email && newsNotifications.newsletter.inApp) ? '#87E697' : '#E4E4E4' }}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(newsNotifications.newsletter.push && newsNotifications.newsletter.email && newsNotifications.newsletter.inApp) ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                                        <button
                                          onClick={() => setNewsNotifications({
                                            ...newsNotifications,
                                            newsletter: { ...newsNotifications.newsletter, push: !newsNotifications.newsletter.push }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: newsNotifications.newsletter.push ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.newsletter.push ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                                        <button
                                          onClick={() => setNewsNotifications({
                                            ...newsNotifications,
                                            newsletter: { ...newsNotifications.newsletter, email: !newsNotifications.newsletter.email }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: newsNotifications.newsletter.email ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.newsletter.email ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                                        <button
                                          onClick={() => setNewsNotifications({
                                            ...newsNotifications,
                                            newsletter: { ...newsNotifications.newsletter, inApp: !newsNotifications.newsletter.inApp }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: newsNotifications.newsletter.inApp ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.newsletter.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Daily recommendations */}
                                  <div>
                                    <h3 className="text-xs font-medium mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                                      Daily recommendations
                                    </h3>
                                    <div className="flex items-start justify-between mb-3">
                                      <p className="text-[10px] flex-1 pr-2" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                                        Get daily updates on the latest<br />from the world of African art and culture.
                                      </p>
                                      <button
                                        onClick={() => {
                                          const newState = !newsNotifications.dailyRecommendations.push && !newsNotifications.dailyRecommendations.email && !newsNotifications.dailyRecommendations.inApp;
                                          setNewsNotifications({
                                            ...newsNotifications,
                                            dailyRecommendations: { push: newState, email: newState, inApp: newState }
                                          });
                                        }}
                                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                                        style={{ backgroundColor: (newsNotifications.dailyRecommendations.push && newsNotifications.dailyRecommendations.email && newsNotifications.dailyRecommendations.inApp) ? '#87E697' : '#E4E4E4' }}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(newsNotifications.dailyRecommendations.push && newsNotifications.dailyRecommendations.email && newsNotifications.dailyRecommendations.inApp) ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Push</span>
                                        <button
                                          onClick={() => setNewsNotifications({
                                            ...newsNotifications,
                                            dailyRecommendations: { ...newsNotifications.dailyRecommendations, push: !newsNotifications.dailyRecommendations.push }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: newsNotifications.dailyRecommendations.push ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.dailyRecommendations.push ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Email</span>
                                        <button
                                          onClick={() => setNewsNotifications({
                                            ...newsNotifications,
                                            dailyRecommendations: { ...newsNotifications.dailyRecommendations, email: !newsNotifications.dailyRecommendations.email }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: newsNotifications.dailyRecommendations.email ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.dailyRecommendations.email ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>In-App</span>
                                        <button
                                          onClick={() => setNewsNotifications({
                                            ...newsNotifications,
                                            dailyRecommendations: { ...newsNotifications.dailyRecommendations, inApp: !newsNotifications.dailyRecommendations.inApp }
                                          })}
                                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                          style={{ backgroundColor: newsNotifications.dailyRecommendations.inApp ? '#87E697' : '#E4E4E4' }}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.dailyRecommendations.inApp ? 'translate-x-4' : 'translate-x-0.5'
                                              }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )
                      ) : (
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
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${allNotificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.reviewsAndRates.push ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.reviewsAndRates.email ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.reviewsAndRates.inApp ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.subscriptionRenewal.push ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.subscriptionRenewal.email ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalNotifications.subscriptionRenewal.inApp ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messages.push ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messages.email ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messages.inApp ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messageReminders.push ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messageReminders.email ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.messageReminders.inApp ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.chatRequests.push ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.chatRequests.email ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messagesNotifications.chatRequests.inApp ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.enabled ? 'translate-x-5' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.newsletter.push ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.newsletter.email ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.newsletter.inApp ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.dailyRecommendations.push ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.dailyRecommendations.email ? 'translate-x-4' : 'translate-x-0.5'
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
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsNotifications.dailyRecommendations.inApp ? 'translate-x-4' : 'translate-x-0.5'
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
                    </>
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
                      <span className="text-[11px]">&copy; BaoAfrik 2025. All rights reserved</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <Link to="/contact-support" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Contact Us</Link>
                      <span style={{ color: '#BABABA' }}>|</span>
                      <Link to="/terms" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Terms and conditions of use</Link>
                      <span style={{ color: '#BABABA' }}>|</span>
                      <Link to="/privacy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Privacy policies</Link>
                      <span style={{ color: '#BABABA' }}>|</span>
                      <Link to="/cookie-policy" className="hover:text-gray-900" style={{ color: '#BABABA' }}>Cookies</Link>
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
                        onChange={(e) => {
                          setTwoFactorEmail(e.target.value);
                          if (twoFactorErrors.email) {
                            setTwoFactorErrors(prev => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="Enter your mail address"
                        className="two-factor-input w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
                        style={{
                          borderColor: twoFactorErrors.email ? '#FF6E6E' : '#E9E9E9',
                          color: '#212121',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#CFE8FC';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = twoFactorErrors.email ? '#FF6E6E' : '#E9E9E9';
                        }}
                      />
                      {twoFactorErrors.email && (
                        <p className="text-[10px] mt-1" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                          {twoFactorErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                        Password
                      </label>
                      <input
                        type="password"
                        value={twoFactorPassword}
                        onChange={(e) => {
                          setTwoFactorPassword(e.target.value);
                          if (twoFactorErrors.password) {
                            setTwoFactorErrors(prev => ({ ...prev, password: undefined }));
                          }
                        }}
                        placeholder="Enter your password"
                        className="two-factor-input w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
                        style={{
                          borderColor: twoFactorErrors.password ? '#FF6E6E' : '#E9E9E9',
                          color: '#212121',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#CFE8FC';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = twoFactorErrors.password ? '#FF6E6E' : '#E9E9E9';
                        }}
                      />
                      {twoFactorErrors.password && (
                        <p className="text-[10px] mt-1" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                          {twoFactorErrors.password}
                        </p>
                      )}
                    </div>

                    {/* General Error Message */}
                    {twoFactorErrors.general && (
                      <div className="text-[11px] text-center" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                        {twoFactorErrors.general}
                      </div>
                    )}

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
                        disabled={isTwoFactorSubmitting}
                        className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                        style={{
                          backgroundColor: isTwoFactorSubmitting ? '#E9E9E9' : '#F9A825',
                          color: isTwoFactorSubmitting ? '#6A6A6A' : '#FFFFFF',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {isTwoFactorSubmitting ? 'Sending...' : 'Continue'}
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
                                {twoFactorPhoneCodes.map((code) => (
                                  <button
                                    key={code.isoCode}
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
                        disabled={isTwoFactorSubmitting}
                        className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                        style={{
                          backgroundColor: isTwoFactorSubmitting ? '#E9E9E9' : '#F9A825',
                          color: isTwoFactorSubmitting ? '#6A6A6A' : '#FFFFFF',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {isTwoFactorSubmitting ? 'Sending...' : 'Continue'}
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
                        disabled={twoFactorVerificationCode.join('').length !== 6 || isTwoFactorSubmitting}
                        className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                        style={{
                          backgroundColor: twoFactorVerificationCode.join('').length === 6 && !isTwoFactorSubmitting ? '#F9A825' : '#E9E9E9',
                          color: twoFactorVerificationCode.join('').length === 6 && !isTwoFactorSubmitting ? '#FFFFFF' : '#6A6A6A',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {isTwoFactorSubmitting ? 'Verifying...' : 'Continue'}
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
                      handleCloseTwoFactorModal();
                      // Refresh 2FA status to ensure toggle is correct
                      twoFactorService.getStatus().then(status => {
                        setIsTwoFactorEnabled(status.isEnabled);
                      }).catch(() => {
                        // Keep current state on error
                      });
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
          .phone-code-dropdown::-webkit-scrollbar {
            display: none;
          }
          .phone-code-dropdown {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .profile-settings-content::-webkit-scrollbar {
            display: none;
          }
          .profile-settings-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        </>
      )}

      {/* Disable Two Step Verification Modal */}
      {isDisableTwoFactorModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={handleCloseDisableTwoFactorModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              ref={disableTwoFactorModalRef}
              className="bg-white rounded-[30px] pt-12 sm:pt-14 px-6 sm:px-8 pb-16 relative max-w-md w-full"
              style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseDisableTwoFactorModal}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center"
              >
                <img
                  src={closeIcon}
                  alt="Close"
                  className="w-5 h-5"
                  style={{ filter: 'brightness(0) saturate(100%) invert(79%) sepia(6%) saturate(178%) hue-rotate(169deg) brightness(88%) contrast(83%)' }}
                />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <img src={keyIcon} alt="Key" className="w-16 h-16" />
              </div>

              {/* Title */}
              <h2
                className="text-xl text-center mb-1.5"
                style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
              >
                Disable two step authentication
              </h2>

              {/* Description */}
              <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                Please enter your information to disable two-step verification
              </p>

              {/* Form */}
              <form onSubmit={handleDisableTwoFactorEmailSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={disableTwoFactorEmail}
                    onChange={(e) => {
                      setDisableTwoFactorEmail(e.target.value);
                      if (disableTwoFactorErrors.email) {
                        setDisableTwoFactorErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="Enter your mail address"
                    className="two-factor-input w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
                    style={{
                      borderColor: disableTwoFactorErrors.email ? '#FF6E6E' : '#E9E9E9',
                      color: '#212121',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#CFE8FC';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = disableTwoFactorErrors.email ? '#FF6E6E' : '#E9E9E9';
                    }}
                  />
                  {disableTwoFactorErrors.email && (
                    <p className="text-[10px] mt-1" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                      {disableTwoFactorErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={disableTwoFactorPassword}
                    onChange={(e) => {
                      setDisableTwoFactorPassword(e.target.value);
                      if (disableTwoFactorErrors.password) {
                        setDisableTwoFactorErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="Enter your password"
                    className="two-factor-input w-full px-4 py-3 border rounded-[12px] text-sm bg-white focus:outline-none"
                    style={{
                      borderColor: disableTwoFactorErrors.password ? '#FF6E6E' : '#E9E9E9',
                      color: '#212121',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#CFE8FC';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = disableTwoFactorErrors.password ? '#FF6E6E' : '#E9E9E9';
                    }}
                  />
                  {disableTwoFactorErrors.password && (
                    <p className="text-[10px] mt-1" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                      {disableTwoFactorErrors.password}
                    </p>
                  )}
                </div>

                {/* General Error Message */}
                {disableTwoFactorErrors.general && (
                  <div className="text-[11px] text-center" style={{ color: '#FF6E6E', fontFamily: 'Poppins, sans-serif' }}>
                    {disableTwoFactorErrors.general}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCloseDisableTwoFactorModal}
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
                    disabled={isDisablingTwoFactor}
                    className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                    style={{
                      backgroundColor: isDisablingTwoFactor ? '#E9E9E9' : '#F9A825',
                      color: isDisablingTwoFactor ? '#6A6A6A' : '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {isDisablingTwoFactor ? 'Disabling...' : 'Disable'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <style>{`
          .two-factor-input::placeholder {
            color: #D9D9D9 !important;
            font-size: 12px !important;
            font-weight: 400 !important;
            font-family: 'Poppins', sans-serif !important;
          }
        `}</style>
        </>
      )}

      {/* Social Account Connection Modal */}
      {isSocialAccountModalOpen && selectedSocialProvider && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#0000001A' }}
            onClick={handleCloseSocialAccountModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              ref={socialAccountModalRef}
              className="bg-white rounded-[30px] pt-12 sm:pt-14 px-6 sm:px-8 pb-16 relative max-w-md w-full"
              style={{ boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseSocialAccountModal}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center"
              >
                <img
                  src={closeIcon}
                  alt="Close"
                  className="w-5 h-5"
                  style={{ filter: 'brightness(0) saturate(100%) invert(79%) sepia(6%) saturate(178%) hue-rotate(169deg) brightness(88%) contrast(83%)' }}
                />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {selectedSocialProvider === 'whatsapp' && <img src={zapIcon} alt="WhatsApp" className="w-16 h-16" />}
                {selectedSocialProvider === 'facebook' && <img src={fbIcon} alt="Facebook" className="w-16 h-16" />}
                {selectedSocialProvider === 'instagram' && <img src={igIcon} alt="Instagram" className="w-16 h-16" />}
                {selectedSocialProvider === 'linkedin' && (
                  <svg width="64" height="64" viewBox="0 0 448 512">
                    <rect width="448" height="512" rx="90" fill="#0A66C2" />
                    <path
                      d="M100.28 448H7.4V148.9h92.88zm-46.44-340a53.79 53.79 0 1153.79-53.79 53.79 53.79 0 01-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.3-79.3-48.3 0-55.7 37.7-55.7 76.7V448h-92.7V148.9h89v40.8h1.3c12.4-23.6 42.6-48.3 87.7-48.3 93.8 0 111.1 61.8 111.1 142.3z"
                      fill="#fff"
                    />
                  </svg>
                )}
                {selectedSocialProvider === 'x' && <img src={xIcon} alt="X" className="w-16 h-16" />}
              </div>

              {/* Title */}
              <h2
                className="text-xl text-center mb-1.5"
                style={{ color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500 }}
              >
                Connect {selectedSocialProvider.charAt(0).toUpperCase() + selectedSocialProvider.slice(1)}
              </h2>

              {/* Description */}
              <p className="text-xs text-center mb-6" style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>
                {selectedSocialProvider === 'whatsapp'
                  ? 'Enter your WhatsApp phone number to connect your account'
                  : `Connect your ${selectedSocialProvider} account to verify your identity`
                }
              </p>

              {/* Form */}
              {selectedSocialProvider === 'whatsapp' ? (
                <form onSubmit={(e) => { e.preventDefault(); handleConnectSocialAccount('whatsapp'); }} className="space-y-4">
                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif' }}>
                      Phone number
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className="relative flex-shrink-0" ref={whatsappPhoneCodeDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsWhatsappPhoneCodeDropdownOpen(!isWhatsappPhoneCodeDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-3 border rounded-[12px] bg-white focus:outline-none"
                          style={{
                            borderColor: '#E9E9E9',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/w20/${whatsappPhoneCode.flag}.png`}
                            alt={whatsappPhoneCode.label}
                            className="w-5 h-5 rounded-full"
                            style={{ objectFit: 'cover' }}
                          />
                          <span className="text-xs" style={{ color: '#939393' }}>
                            {whatsappPhoneCode.code}
                          </span>
                          <img
                            src={arrowDownIcon}
                            alt="Arrow"
                            className="w-4 h-4"
                            style={{ filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)' }}
                          />
                        </button>

                        {/* Dropdown */}
                        {isWhatsappPhoneCodeDropdownOpen && (
                          <div
                            className="absolute top-full left-0 mt-1 bg-white z-50 w-48"
                            style={{
                              borderRadius: '20px',
                              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                              overflow: 'hidden'
                            }}
                          >
                            <div className="two-factor-dropdown" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {twoFactorPhoneCodes.map((code) => (
                                <button
                                  key={code.isoCode}
                                  type="button"
                                  onClick={() => {
                                    setWhatsappPhoneCode(code);
                                    setIsWhatsappPhoneCodeDropdownOpen(false);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 transition-colors"
                                  style={{
                                    backgroundColor: whatsappPhoneCode.code === code.code ? '#F0F8FE' : 'transparent',
                                    borderRadius: whatsappPhoneCode.code === code.code ? '8px' : '0',
                                    margin: whatsappPhoneCode.code === code.code ? '4px 8px' : '0',
                                    width: whatsappPhoneCode.code === code.code ? 'calc(100% - 16px)' : '100%'
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
                                      color: whatsappPhoneCode.code === code.code ? '#64B5F6' : '#BABABA',
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
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
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
                      onClick={handleCloseSocialAccountModal}
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

                    {/* Connect Button */}
                    <button
                      type="submit"
                      disabled={!whatsappPhone.trim() || isConnectingSocial}
                      className="flex-1 py-2 px-4 rounded-[12px] text-sm font-light transition-colors"
                      style={{
                        backgroundColor: whatsappPhone.trim() && !isConnectingSocial ? '#F9A825' : '#E9E9E9',
                        color: whatsappPhone.trim() && !isConnectingSocial ? '#FFFFFF' : '#6A6A6A',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {isConnectingSocial ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* OAuth Connection Button */}
                  <button
                    onClick={() => handleConnectSocialAccount(selectedSocialProvider)}
                    disabled={isConnectingSocial}
                    className="w-full py-2.5 px-4 rounded-[12px] text-sm font-light transition-colors"
                    style={{
                      backgroundColor: isConnectingSocial ? '#E9E9E9' : '#F9A825',
                      color: isConnectingSocial ? '#6A6A6A' : '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {isConnectingSocial ? 'Connecting...' : `Connect with ${selectedSocialProvider.charAt(0).toUpperCase() + selectedSocialProvider.slice(1)}`}
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCloseSocialAccountModal}
                    className="w-full py-2 px-4 rounded-[12px] text-sm font-normal flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#F1F1F1',
                      color: '#6A6A6A',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <span style={{ color: '#6A6A6A' }}>X</span>
                    Cancel
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
        `}</style>
        </>
      )}
    </>
  );
};

export default ProfileSettings;

