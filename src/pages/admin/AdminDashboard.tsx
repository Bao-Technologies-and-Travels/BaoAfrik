import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/pre/logo.png';
import ov1Icon from '../../assets/images/admin/ov1.svg';
import ov2Icon from '../../assets/images/admin/ov2.svg';
import perfomanceIcon from '../../assets/images/admin/perfomance.svg';
import userIcon from '../../assets/images/admin/user.svg';
import listingboxIcon from '../../assets/images/admin/listingbox.svg';
import requesticonIcon from '../../assets/images/admin/requesticon.svg';
import chatsIcon from '../../assets/images/admin/chats.svg';
import clockIcon from '../../assets/images/admin/clock.svg';
import exportIcon from '../../assets/images/admin/export.svg';
import settingIcon from '../../assets/images/admin/setting.svg';
import activeusersIcon from '../../assets/images/admin/activeusers.svg';
import activelistingsIcon from '../../assets/images/admin/activelistings.svg';
import peopleIcon from '../../assets/images/admin/people.svg';
import flagIcon from '../../assets/images/admin/flag.svg';
import notificationIcon from '../../assets/images/pre/notification.svg';
import arrowDownIcon from '../../assets/images/pre/arrow-down.svg';
import avatar from '../../assets/images/logos/avatar.png';
import logoIcon from '../../assets/images/logos/ba-brand-icon-colored.png';
import messageAvatarIcon from '../../assets/images/pre/main.png';
import appNotificationIcon from '../../assets/images/pre/nof.svg';
import visualIcon from '../../assets/images/admin/visual.svg';
import MustUsersArc from '../../components/ui/MustUsersArc';
import users2Icon from '../../assets/images/admin/users2.svg';
import productImage1 from '../../assets/images/pre/a1.png';
import productImage2 from '../../assets/images/pre/a2.png';
import productImage3 from '../../assets/images/pre/a3.png';
import selectIcon from '../../assets/images/admin/select.svg';
import viewIcon from '../../assets/images/admin/view.svg';
import trashIcon from '../../assets/images/admin/trash.svg';
import mouseCursorIcon from '../../assets/images/admin/mouse.svg';
import verifyIcon from '../../assets/images/pre/verify.svg';
import unverifyIcon from '../../assets/images/pre/unverify.svg';
import statIcon from '../../assets/images/admin/stat.svg.svg';
import stat2Icon from '../../assets/images/admin/stat2.svg';
import stat3Icon from '../../assets/images/admin/stat3.svg';
import profileIcon from '../../assets/images/pre/profile.svg';
import pencilIcon from '../../assets/images/pre/pencil.svg';
import statusIcon from '../../assets/images/pre/status.svg';
import suspendIcon from '../../assets/images/admin/suspend.svg';
import notifIcon from '../../assets/images/admin/notif.svg';
import arrowLeftIcon from '../../assets/images/pre/arrow-left.svg';
import sendIcon from '../../assets/images/admin/send.svg';
import starIcon from '../../assets/images/admin/star.svg';
import verityIcon from '../../assets/images/admin/verity.svg';
import grayArrowIcon from '../../assets/images/pre/gray.svg';
import blackArrowIcon from '../../assets/images/pre/black.svg';
import redtrashIcon from '../../assets/images/pre/redtrash.svg';
import warningIcon from '../../assets/images/admin/warning.svg';
import expandIcon from '../../assets/images/admin/expand.svg';

// Suggestion Option Component with hover state
const SuggestionOption: React.FC<{
  option: { key: string; label: string; icon: string };
  selectedCategory: string | null;
  onSelect: (category: 'users' | 'listings' | 'requests') => void;
}> = ({ option, selectedCategory, onSelect }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isActive = selectedCategory === option.key || isHovered;
  
  return (
    <div
      onClick={() => onSelect(option.key as 'users' | 'listings' | 'requests')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px',
        borderRadius: '8px',
        backgroundColor: isActive ? '#F0F8FE' : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      <img 
        src={option.icon} 
        alt={option.label} 
        style={{ 
          width: '16px', 
          height: '16px',
          filter: isActive ? 'none' : 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)',
          opacity: isActive ? 1 : 0.58
        }} 
      />
      <span style={{
        fontSize: '11px',
        color: isActive ? '#64B5F6' : '#939393',
        fontFamily: 'Poppins, sans-serif'
      }}>
        {option.label}
      </span>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Apply custom cursor to entire dashboard
  useEffect(() => {
    const style = document.createElement('style');
    const cursorUrl = `url("${mouseCursorIcon}"), auto`;
    style.textContent = `
      * {
        cursor: ${cursorUrl} !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  const [selectedSidebarOption, setSelectedSidebarOption] = useState('overview');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'messages'>('all');
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('France');
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchMode, setSearchMode] = useState<'suggestions' | 'category' | 'direct'>('suggestions');
  const [selectedCategory, setSelectedCategory] = useState<'users' | 'listings' | 'requests' | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Users management page state (Option A: same table layout, data changes)
  const [usersToggle, setUsersToggle] = useState<'activities' | 'list'>('activities');
  const [usersActivityTab, setUsersActivityTab] = useState<'all' | 'joined' | 'posted' | 'reviewed' | 'reported'>('all');
  const [usersListTab, setUsersListTab] = useState<'all' | 'new' | 'free' | 'verified' | 'unverified'>('all');
  const [usersSortBy, setUsersSortBy] = useState('Sort by');
  const [usersPage, setUsersPage] = useState(1);
  const [usersGoTo, setUsersGoTo] = useState('');
  const [hoveredUserRowKey, setHoveredUserRowKey] = useState<string | null>(null);
  const [selectedUserRowKey, setSelectedUserRowKey] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedUserEmails, setSelectedUserEmails] = useState<Set<string>>(new Set());
  const [removedUserEmails, setRemovedUserEmails] = useState<Set<string>>(new Set());

  // More options dropdown (portal)
  const [moreMenu, setMoreMenu] = useState<{
    email: string;
    anchorRect: DOMRect;
  } | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const moreMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  // User profile detail view state
  const [viewingUserProfile, setViewingUserProfile] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<any>(null);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isUserMetricsOpen, setIsUserMetricsOpen] = useState(true);
  const [activityCardMoreMenu, setActivityCardMoreMenu] = useState<{
    anchorRect: DOMRect;
  } | null>(null);
  const activityCardMoreMenuRef = useRef<HTMLDivElement | null>(null);
  const activityCardMoreMenuButtonRef = useRef<HTMLDivElement | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [isDeleteActivitySuccess, setIsDeleteActivitySuccess] = useState(false);
  const [isActivityDeleted, setIsActivityDeleted] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [sidebarMoreMenu, setSidebarMoreMenu] = useState<{
    anchorRect: DOMRect;
  } | null>(null);
  const sidebarMoreMenuRef = useRef<HTMLDivElement | null>(null);
  const sidebarMoreMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<string | null>(null);
  const [isSuspendSuccess, setIsSuspendSuccess] = useState(false);
  const [isUserSuspended, setIsUserSuspended] = useState(false);
  const [suspendCountdown, setSuspendCountdown] = useState(10);
  const [isManageAccessView, setIsManageAccessView] = useState(false);
  const [expandedAccessSections, setExpandedAccessSections] = useState<Set<string>>(new Set());
  const [expandedPermissionLists, setExpandedPermissionLists] = useState<Set<string>>(new Set());
  const [accessSearchValue, setAccessSearchValue] = useState('');
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const [accessToggles, setAccessToggles] = useState({
    listings: true,
    messages: true,
    requests: false,
    users: false
  });
  const [permissionToggles, setPermissionToggles] = useState<Record<string, Record<string, boolean>>>({
    listings: {
      'can-create': true,
      'can-delete': true,
      'can-modify': true,
      'can-review': true,
      'can-report': true,
      'can-share': true,
      'can-contact': true
    },
    messages: {
      'can-send-message': true,
      'can-send-files': true
    },
    requests: {
      'can-create-request': true,
      'can-respond': true
    },
    users: {
      'can-view': true,
      'can-edit': true
    }
  });

  // Mock data for search
  const mockUsers = [
    { id: 1, name: 'Kevin Mobinnid', plan: 'Free Plan', verified: false, avatar: avatar },
    { id: 2, name: 'Kevin Roland Tadjil', plan: 'Starter Plan', verified: true, avatar: avatar },
    { id: 3, name: 'Kevin Nel Amstrong', plan: 'Free Plan', verified: false, avatar: avatar },
    { id: 4, name: 'Kevin Tala N\'kom', plan: 'Pro Plan', verified: true, avatar: avatar },
  ];

  const mockListings = [
    { id: 1, name: 'Kevin Organic Oil', image: productImage1, category: 'Food & Spices' },
    { id: 2, name: 'Organic Coconut Oil', image: productImage2, category: 'Food & Spices' },
  ];

  const mockRequests = [
    { id: 1, name: 'White Pepper for Kevination...', image: productImage3, category: 'Food & Spices' },
  ];

  // Mock data for Users Management table
  const usersActivitiesRows = [
    { name: 'Clara Vanstone', email: 'mailaddresses@gmail.com', date: 'Mon, 21 Dec 2024', activity: "Joined Bao'Afrik", plan: 'Free Plan', avatar, avatarBg: '#E3F2FD', isNewUser: true, type: 'joined' as const },
    { name: 'Clara Vanstone', email: 'mailaddresses2@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Post a new listing', plan: 'Free Plan', avatar, avatarBg: '#F0F8FE', isNewUser: false, type: 'posted' as const },
    { name: 'Clara Vanstone', email: 'mailaddresses3@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Reviewed a listing', plan: 'Starter plan', avatar, avatarBg: '#EDFBF0', isNewUser: false, type: 'reviewed' as const },
    { name: 'Clara Vanstone', email: 'mailaddresses4@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Reported an issue', plan: 'Pro plan', avatar, avatarBg: '#FEF6E9', isNewUser: false, type: 'reported' as const },
    { name: 'Nadine Ngum', email: 'nadine.ngum@gmail.com', date: 'Mon, 21 Dec 2024', activity: "Joined Bao'Afrik", plan: 'Pro plan', avatar, avatarBg: '#FFF5F5', isNewUser: true, type: 'joined' as const },
    { name: 'Herman Kabore', email: 'herman.kabore@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Post a new listing', plan: 'Starter plan', avatar, avatarBg: '#F4F4F4', isNewUser: false, type: 'posted' as const },
    { name: 'Amara Diop', email: 'amara.diop@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Reviewed a listing', plan: 'Free Plan', avatar, avatarBg: '#F3F4FF', isNewUser: false, type: 'reviewed' as const },
    { name: 'Aicha Diallo', email: 'aicha.diallo@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Reported an issue', plan: 'Free Plan', avatar, avatarBg: '#F3FDF8', isNewUser: false, type: 'reported' as const },
    { name: 'Kevin Mobinnid', email: 'kevin.mobinnid@gmail.com', date: 'Mon, 21 Dec 2024', activity: "Joined Bao'Afrik", plan: 'Starter plan', avatar, avatarBg: '#F0FFF8', isNewUser: true, type: 'joined' as const },
    { name: 'Kevin Roland Tadjil', email: 'kevin.roland@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Post a new listing', plan: 'Pro plan', avatar, avatarBg: '#F6F0FF', isNewUser: false, type: 'posted' as const },
  ];

  // Mock data for Users List table
  const usersListRows = [
    { name: 'Clara Vanstone', email: 'mailaddresses@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Free Plan', avatar, avatarBg: '#E3F2FD', isNewUser: true, verified: false },
    { name: 'Clara Vanstone', email: 'mailaddresses2@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Free Plan', avatar, avatarBg: '#F0F8FE', isNewUser: false, verified: false },
    { name: 'Clara Vanstone', email: 'mailaddresses3@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Starter plan', avatar, avatarBg: '#EDFBF0', isNewUser: false, verified: true },
    { name: 'Clara Vanstone', email: 'mailaddresses4@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Pro plan', avatar, avatarBg: '#FEF6E9', isNewUser: false, verified: true },
    { name: 'Nadine Ngum', email: 'nadine.ngum@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Pro plan', avatar, avatarBg: '#FFF5F5', isNewUser: true, verified: true },
    { name: 'Herman Kabore', email: 'herman.kabore@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Starter plan', avatar, avatarBg: '#F4F4F4', isNewUser: false, verified: false },
    { name: 'Amara Diop', email: 'amara.diop@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Free Plan', avatar, avatarBg: '#F3F4FF', isNewUser: false, verified: true },
    { name: 'Aicha Diallo', email: 'aicha.diallo@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Free Plan', avatar, avatarBg: '#F3FDF8', isNewUser: false, verified: false },
    { name: 'Kevin Mobinnid', email: 'kevin.mobinnid@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Starter plan', avatar, avatarBg: '#F0FFF8', isNewUser: true, verified: true },
    { name: 'Kevin Roland Tadjil', email: 'kevin.roland@gmail.com', date: 'Mon, 21 Dec 2024', plan: 'Pro plan', avatar, avatarBg: '#F6F0FF', isNewUser: false, verified: true },
  ];

  const filteredUsersActivitiesRows =
    (usersActivityTab === 'all'
      ? usersActivitiesRows
      : usersActivitiesRows.filter((r) => r.type === usersActivityTab))
      .filter((r) => !removedUserEmails.has(r.email));

  const filteredUsersListRows = (() => {
    let filtered = usersListRows.filter((r) => !removedUserEmails.has(r.email));
    if (usersListTab === 'new') filtered = filtered.filter((r) => r.isNewUser);
    if (usersListTab === 'free') filtered = filtered.filter((r) => r.plan.toLowerCase().includes('free'));
    if (usersListTab === 'verified') filtered = filtered.filter((r) => r.verified);
    if (usersListTab === 'unverified') filtered = filtered.filter((r) => !r.verified);
    return filtered;
  })();

  const usersPageSize = 6;
  const usersTotalPages = 48; // match screenshot pagination
  const usersPaginationNumbers = [1, 2, 3];
  const pagedUsersRows = (usersToggle === 'activities' ? filteredUsersActivitiesRows : filteredUsersListRows)
    .slice((usersPage - 1) * usersPageSize, usersPage * usersPageSize);

  const getPlanBadgeStyle = (plan: string) => {
    const p = plan.toLowerCase();
    if (p.includes('starter')) {
      return { backgroundColor: '#F0F8FE', color: '#64B5F6' };
    }
    if (p.includes('pro')) {
      return { backgroundColor: '#EDFBF0', color: '#45C55B' };
    }
    return { backgroundColor: '#F4F4F4', color: '#939393' };
  };

  // Mock notification data
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', isRead: false, sender: 'Nadine Ngum', text: 'sent you a message', subText: 'Click to view', time: '19 min ago', day: 'Today' },
    { id: 2, type: 'app', isRead: false, text: 'Your profile has been updated,', subText: 'you are now...', subText2: 'Invoice 6 August 2025 Sequence: 2-7480...', time: '2 hrs ago', day: 'Today' },
    { id: 3, type: 'message', isRead: true, text: 'New Reviews and Rates from Nadine Ngum...', subText: '"I recently purchased a beautiful Kente...', time: '17:12', day: 'Yesterday' },
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

  // Handle search input changes
  useEffect(() => {
    if (searchValue === '/') {
      setSearchMode('suggestions');
      setSelectedCategory(null);
      setSearchResults([]);
    } else if (searchValue.startsWith('/') && searchValue.length > 1) {
      // User typed something after /, treat as direct search
      setSearchMode('direct');
      setSelectedCategory(null);
      const query = searchValue.substring(1).toLowerCase();
      const results: any[] = [];
      
      mockUsers.filter(user => user.name.toLowerCase().includes(query)).forEach(user => {
        results.push({ type: 'user', ...user, path: 'Users \\ User detail...' });
      });
      mockListings.filter(listing => listing.name.toLowerCase().includes(query)).forEach(listing => {
        results.push({ type: 'listing', ...listing, path: 'Listings \\ Listing detail...', image: listing.image });
      });
      mockRequests.filter(request => request.name.toLowerCase().includes(query)).forEach(request => {
        results.push({ type: 'request', ...request, path: 'Requests \\ Request detail...', image: request.image });
      });
      
      setSearchResults(results);
    } else if (selectedCategory && searchValue.startsWith(`@${selectedCategory === 'users' ? 'User' : selectedCategory === 'listings' ? 'Listing' : 'Request'}/`)) {
      setSearchMode('category');
      const query = searchValue.replace(`@${selectedCategory === 'users' ? 'User' : selectedCategory === 'listings' ? 'Listing' : 'Request'}/`, '').toLowerCase();
      if (selectedCategory === 'users') {
        setSearchResults(mockUsers.filter(user => user.name.toLowerCase().includes(query)));
      } else if (selectedCategory === 'listings') {
        setSearchResults(mockListings.filter(listing => listing.name.toLowerCase().includes(query)));
      } else {
        setSearchResults(mockRequests.filter(request => request.name.toLowerCase().includes(query)));
      }
    } else if (searchValue && !searchValue.startsWith('@') && !searchValue.startsWith('/')) {
      setSearchMode('direct');
      setSelectedCategory(null);
      const query = searchValue.toLowerCase();
      const results: any[] = [];
      
      mockUsers.filter(user => user.name.toLowerCase().includes(query)).forEach(user => {
        results.push({ type: 'user', ...user, path: 'Users \\ User detail...' });
      });
      mockListings.filter(listing => listing.name.toLowerCase().includes(query)).forEach(listing => {
        results.push({ type: 'listing', ...listing, path: 'Listings \\ Listing detail...', image: listing.image });
      });
      mockRequests.filter(request => request.name.toLowerCase().includes(query)).forEach(request => {
        results.push({ type: 'request', ...request, path: 'Requests \\ Request detail...', image: request.image });
      });
      
      setSearchResults(results);
    } else if (!searchValue) {
      setSearchMode('suggestions');
      setSelectedCategory(null);
      setSearchResults([]);
    } else {
      setSearchResults([]);
    }
  }, [searchValue, selectedCategory]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest('.language-selector');
      const notificationDropdown = target.closest('.notification-dropdown');
      const menuDropdown = target.closest('.menu-dropdown');
      const searchContainer = target.closest('.search-container');
      const moreOptionsDropdown = target.closest('.more-options-dropdown');
      const moreOptionsButton = target.closest('.more-options-button');

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }
      if (!notificationDropdown && isNotificationOpen) {
        setIsNotificationOpen(false);
      }
      if (!menuDropdown && isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }
      if (!searchContainer && isSearchFocused) {
        setIsSearchFocused(false);
        if (!searchValue) {
          setSearchMode('suggestions');
          setSelectedCategory(null);
        }
      }
      // Don't close more options dropdown if clicking on the button or dropdown itself
      if (!moreOptionsDropdown && !moreOptionsButton && moreMenu !== null) {
        setMoreMenu(null);
      }
      // Don't close activity card more menu if clicking on the button or dropdown itself
      const activityCardMoreOptionsDropdown = target.closest('.activity-card-more-options-dropdown');
      const activityCardMoreOptionsButton = target.closest('.activity-card-more-options-button');
      if (!activityCardMoreOptionsDropdown && !activityCardMoreOptionsButton && activityCardMoreMenu !== null) {
        setActivityCardMoreMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isNotificationOpen, isMenuDropdownOpen, isSearchFocused, searchValue]);

  // Close activity card more menu on outside click / scroll / resize (portal-safe)
  useEffect(() => {
    if (!activityCardMoreMenu) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedMenu = !!activityCardMoreMenuRef.current?.contains(target);
      const clickedButton = !!activityCardMoreMenuButtonRef.current?.contains(target);
      if (!clickedMenu && !clickedButton) {
        setActivityCardMoreMenu(null);
      }
    };
    const onScroll = () => setActivityCardMoreMenu(null);
    const onResize = () => setActivityCardMoreMenu(null);
    document.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [activityCardMoreMenu]);

  // Close sidebar more menu on outside click / scroll / resize (portal-safe)
  useEffect(() => {
    if (!sidebarMoreMenu) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedMenu = !!sidebarMoreMenuRef.current?.contains(target);
      const clickedButton = !!sidebarMoreMenuButtonRef.current?.contains(target);
      if (!clickedMenu && !clickedButton) {
        setSidebarMoreMenu(null);
      }
    };
    const onScroll = () => setSidebarMoreMenu(null);
    const onResize = () => setSidebarMoreMenu(null);
    document.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [sidebarMoreMenu]);

  // Countdown timer for suspend success modal
  useEffect(() => {
    if (isSuspendSuccess && userToSuspend) {
      setSuspendCountdown(10);
      const interval = setInterval(() => {
        setSuspendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsUserSuspended(true);
            setUserToSuspend(null);
            setIsSuspendSuccess(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSuspendSuccess, userToSuspend]);

  // Check if scrollable container has scrollable content
  useEffect(() => {
    if (!isManageAccessView) {
      setIsScrollable(false);
      return;
    }
    
    const checkScrollable = () => {
      if (scrollableContainerRef.current && expandedPermissionLists.size > 0) {
        const container = scrollableContainerRef.current;
        const hasScroll = container.scrollHeight > container.clientHeight;
        setIsScrollable(hasScroll);
      } else {
        setIsScrollable(false);
      }
    };

    checkScrollable();
    // Recheck when permission lists expand/collapse
    const timeoutId = setTimeout(checkScrollable, 100);
    
    return () => clearTimeout(timeoutId);
  }, [expandedPermissionLists, isManageAccessView]);

  // Countdown timer for delete success modal
  useEffect(() => {
    if (isDeleteActivitySuccess && activityToDelete) {
      setDeleteCountdown(5);
      const interval = setInterval(() => {
        setDeleteCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActivityDeleted(true);
            setActivityToDelete(null);
            setIsDeleteActivitySuccess(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isDeleteActivitySuccess, activityToDelete]);

  // Close more menu on outside click / scroll / resize (portal-safe)
  useEffect(() => {
    if (!moreMenu) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedMenu = !!moreMenuRef.current?.contains(target);
      const clickedButton = !!moreMenuButtonRef.current?.contains(target);
      if (!clickedMenu && !clickedButton) {
        setMoreMenu(null);
      }
    };

    const onScroll = () => setMoreMenu(null);
    const onResize = () => setMoreMenu(null);

    document.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [moreMenu]);

  const clearSelectionMode = () => {
    setSelectedUserEmails(new Set());
    setIsSelectionMode(false);
  };

  const renderMoreOptionsMenu = () => {
    if (!moreMenu) return null;

    const menuWidth = 200;
    const margin = 8;
    const left = Math.max(margin, Math.min(window.innerWidth - menuWidth - margin, moreMenu.anchorRect.right - menuWidth));
    const top = moreMenu.anchorRect.bottom + 8;

    const isUsersList = usersToggle === 'list';
    const primaryHoverOn = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
      e.currentTarget.style.backgroundColor = '#F0F8FE';
      const icon = e.currentTarget.querySelector('img');
      const text = e.currentTarget.querySelector('span');
      if (icon) (icon as HTMLImageElement).style.filter =
        'brightness(0) saturate(100%) invert(67%) sepia(45%) saturate(345%) hue-rotate(168deg) brightness(97%) contrast(93%)';
      if (text) (text as HTMLElement).style.color = '#64B5F6';
    };
    const primaryHoverOff = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.cursor = 'pointer';
      e.currentTarget.style.backgroundColor = 'transparent';
      const icon = e.currentTarget.querySelector('img');
      const text = e.currentTarget.querySelector('span');
      if (icon) (icon as HTMLImageElement).style.filter =
        'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)';
      if (text) (text as HTMLElement).style.color = '#939393';
    };

    const baseItemStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      borderRadius: '8px',
      cursor: `url(${mouseCursorIcon}), auto`,
      transition: 'background-color 0.2s'
    };

    return createPortal(
      <div
        ref={moreMenuRef}
        style={{
          position: 'fixed',
          top,
          left,
          width: `${menuWidth}px`,
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #F1F1F1',
          boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
          padding: '8px',
          zIndex: 99999
        }}
      >
        {/* Select */}
        <div
          onClick={() => {
            setIsSelectionMode(true);
            setSelectedUserEmails(new Set([moreMenu.email]));
            setMoreMenu(null);
          }}
          onMouseEnter={primaryHoverOn}
          onMouseLeave={primaryHoverOff}
          style={baseItemStyle}
        >
          <img
            src={selectIcon}
            alt="Select"
            style={{
              width: '16px',
              height: '16px',
              filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
            }}
          />
          <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
            {isUsersList ? 'Select user' : 'Select item'}
          </span>
        </div>

        {/* Secondary options */}
        {isUsersList ? (
          <>
            <div 
              onClick={() => {
                const user = usersListRows.find(u => u.email === moreMenu.email);
                if (user) {
                  setSelectedUserForProfile(user);
                  setViewingUserProfile(true);
                  setMoreMenu(null);
                }
              }}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={primaryHoverOn} 
              onMouseLeave={primaryHoverOff} 
              style={baseItemStyle}
            >
              <img
                src={profileIcon}
                alt="View profile"
                style={{
                  width: '16px',
                  height: '16px',
                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
                }}
              />
              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>View user profile</span>
            </div>

            <div 
              onClick={() => {
                setIsManageAccessView(true);
                setMoreMenu(null);
              }}
              onMouseEnter={primaryHoverOn} 
              onMouseLeave={primaryHoverOff} 
              style={baseItemStyle}
            >
              <img
                src={pencilIcon}
                alt="Edit access"
                style={{
                  width: '16px',
                  height: '16px',
                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
                }}
              />
              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>Edit user access</span>
            </div>

            <div onMouseEnter={primaryHoverOn} onMouseLeave={primaryHoverOff} style={baseItemStyle}>
              <img
                src={suspendIcon}
                alt="Suspend"
                style={{
                  width: '16px',
                  height: '16px',
                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
                }}
              />
              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>Suspend user account</span>
            </div>

            <div
              onClick={() => {
                setRemovedUserEmails((prev) => new Set(prev).add(moreMenu.email));
                setMoreMenu(null);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = 'pointer';
              }}
              style={baseItemStyle}
            >
              <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '12px', color: '#FF5151', fontFamily: 'Poppins, sans-serif' }}>Delete user account</span>
            </div>
          </>
        ) : (
          <>
            <div onMouseEnter={primaryHoverOn} onMouseLeave={primaryHoverOff} style={baseItemStyle}>
              <img
                src={viewIcon}
                alt="View"
                style={{
                  width: '16px',
                  height: '16px',
                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
                }}
              />
              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>View activity detail</span>
            </div>

            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = 'pointer';
              }}
              style={baseItemStyle}
            >
              <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '12px', color: '#FF5151', fontFamily: 'Poppins, sans-serif' }}>Delete the activity</span>
            </div>
          </>
        )}

        {/* Close */}
        <div
          onClick={() => setMoreMenu(null)}
          onMouseEnter={(e) => {
            e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.cursor = 'pointer';
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: '#FAFAFA',
            cursor: `url(${mouseCursorIcon}), auto`,
            transition: 'background-color 0.2s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span style={{ fontSize: '12px', color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Close</span>
        </div>
      </div>,
      document.body
    );
  };

  const handleCategorySelect = (category: 'users' | 'listings' | 'requests') => {
    setSelectedCategory(category);
    const prefix = `@${category === 'users' ? 'User' : category === 'listings' ? 'Listing' : 'Request'}/`;
    setSearchValue(prefix);
    setSearchMode('category');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      // Move cursor to end
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.setSelectionRange(prefix.length, prefix.length);
        }
      }, 0);
    }
  };

  const sidebarOptions = [
    {
      section: null,
      value: 'overview',
      label: 'Overview',
      activeIcon: ov2Icon,
      inactiveIcon: ov1Icon
    },
    {
      section: 'ACTIVITY',
      value: 'performance',
      label: 'Perfomance',
      activeIcon: perfomanceIcon,
      inactiveIcon: perfomanceIcon
    },
    {
      section: 'ACTIVITY',
      value: 'reported-issues',
      label: 'Reported Issues',
      activeIcon: flagIcon,
      inactiveIcon: flagIcon
    },
    {
      section: 'MANAGEMENT',
      value: 'users',
      label: 'Users',
      activeIcon: users2Icon,
      inactiveIcon: userIcon
    },
    {
      section: 'MANAGEMENT',
      value: 'listings',
      label: 'Listings',
      activeIcon: listingboxIcon,
      inactiveIcon: listingboxIcon
    },
    {
      section: 'MANAGEMENT',
      value: 'requests',
      label: 'Requests',
      activeIcon: requesticonIcon,
      inactiveIcon: requesticonIcon
    },
    {
      section: 'GENERAL',
      value: 'chat',
      label: 'Chat',
      activeIcon: chatsIcon,
      inactiveIcon: chatsIcon
    },
    {
      section: 'GENERAL',
      value: 'history',
      label: 'History',
      activeIcon: clockIcon,
      inactiveIcon: clockIcon
    },
    {
      section: 'GENERAL',
      value: 'export',
      label: 'Export data',
      activeIcon: exportIcon,
      inactiveIcon: exportIcon
    },
    {
      section: 'GENERAL',
      value: 'settings',
      label: 'Settings',
      activeIcon: settingIcon,
      inactiveIcon: settingIcon
    }
  ];

  const handleLogout = () => {
    // TODO: Implement logout
    navigate('/');
  };

  // Get current date and time for last update
  const getLastUpdate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day}, ${date} ${month}. ${year} - ${displayHours}:${displayMinutes} ${ampm}`;
  };


  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {renderMoreOptionsMenu()}
      <style>
        {`
          @keyframes rotateGlobe {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .admin-sidebar-scroll::-webkit-scrollbar {
            display: none;
          }
          .admin-sidebar-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .admin-content-scroll::-webkit-scrollbar {
            display: none;
          }
          .admin-content-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="flex">
        {/* Left Sidebar */}
        <div
          style={{
            width: '240px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #F1F1F1',
            margin: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 32px)',
            position: 'sticky',
            top: '16px'
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: '20px' }}>
            <img src={logo} alt="bao'Afrik" style={{ height: '24px', width: 'auto' }} />
          </div>

          {/* Navigation Options */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="admin-sidebar-scroll">
            {sidebarOptions.map((option, index) => {
              const isActive = selectedSidebarOption === option.value;
              const showSectionTitle = index === 0 || 
                (sidebarOptions[index - 1].section !== option.section && option.section);

              return (
                <React.Fragment key={option.value}>
                  {showSectionTitle && option.section && (
                    <div style={{ 
                      color: '#B0B0B0', 
                      fontSize: '10px', 
                      fontWeight: 500,
                      marginTop: index > 0 ? '16px' : '0',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {option.section}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedSidebarOption(option.value)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: '12px',
                      backgroundColor: (isActive && option.value !== 'overview') ? '#F0F8FE' : 'transparent',
                      color: isActive ? '#64B5F6' : '#6A6A6A',
                      fontSize: '12px',
                      fontWeight: isActive ? 500 : 400,
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: '2px',
                      transition: 'all 0.2s',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive || option.value === 'overview') {
                        (e.target as HTMLElement).style.backgroundColor = '#F9F9F9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive || option.value === 'overview') {
                        (e.target as HTMLElement).style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <img 
                      src={isActive ? option.activeIcon : option.inactiveIcon} 
                      alt={option.label} 
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{option.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              backgroundColor: '#F3F4F6',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '16px',
              fontFamily: 'Poppins, sans-serif'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#F3F4F6';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#6A6A6A', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Log Out</div>
                <div style={{ fontSize: '12px', color: '#6A6A6A', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Log out of BAO Afrik</div>
              </div>
            </div>
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '16px', paddingRight: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 32px)' }} className="admin-content-scroll">
          {/* Top Navigation Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            {/* Left Side: Search (default) OR Breadcrumbs (only for user-profile detail view) */}
            {selectedSidebarOption === 'users' && viewingUserProfile && selectedUserForProfile ? (
              <nav style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontFamily: 'Poppins, sans-serif',
                color: '#BABABA',
                minWidth: 0
              }}>
                <img
                  src={arrowLeftIcon}
                  alt="Back"
                  style={{ width: '14px', height: '14px', cursor: 'pointer', flexShrink: 0 }}
                  onClick={() => setViewingUserProfile(false)}
                />
                <span style={{ cursor: 'pointer' }} onClick={() => setViewingUserProfile(false)}>
                  Homepage
                </span>
                <span style={{ color: '#D4D4D4' }}>·</span>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setViewingUserProfile(false);
                    setUsersToggle('list');
                  }}
                >
                  Users activities
                </span>
                <span style={{ color: '#D4D4D4' }}>·</span>
                <span style={{ color: '#4D4D4D', fontWeight: 500 }}>User activity details</span>
              </nav>
            ) : (
              <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '300px' }} ref={searchDropdownRef}>
              <div style={{ position: 'relative' }}>
                {selectedCategory && (
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px',
                    color: '#D9D9D9',
                    fontFamily: 'Poppins, sans-serif',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    @{selectedCategory === 'users' ? 'User' : selectedCategory === 'listings' ? 'Listing' : 'Request'}/
                  </span>
                )}
              <input
                  ref={searchInputRef}
                type="text"
                  value={selectedCategory && searchValue.startsWith(`@${selectedCategory === 'users' ? 'User' : selectedCategory === 'listings' ? 'Listing' : 'Request'}/`) 
                    ? searchValue.replace(`@${selectedCategory === 'users' ? 'User' : selectedCategory === 'listings' ? 'Listing' : 'Request'}/`, '')
                    : searchValue}
                  onChange={(e) => {
                    if (selectedCategory) {
                      const prefix = `@${selectedCategory === 'users' ? 'User' : selectedCategory === 'listings' ? 'Listing' : 'Request'}/`;
                      setSearchValue(prefix + e.target.value);
                    } else {
                      setSearchValue(e.target.value);
                    }
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={selectedCategory ? '' : 'Search, press "/" for commands'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                    paddingLeft: selectedCategory 
                      ? `calc(12px + ${`@${selectedCategory === 'users' ? 'User' : selectedCategory === 'listings' ? 'Listing' : 'Request'}/`.length * 7}px)`
                      : '12px',
                  backgroundColor: '#F1F1F1',
                  borderRadius: '12px',
                    border: isSearchFocused ? '1px solid #CFE8FC' : 'none',
                    outline: 'none',
                    color: '#6A6A6A',
                  fontSize: '12px',
                    fontFamily: 'Poppins, sans-serif',
                    caretColor: '#CFE8FC'
                }}
              />
              </div>
              <style>
                {`
                  .search-container input::placeholder {
                    color: #B2B2B2;
                  }
                  .search-container input:focus {
                    border: 1px solid #CFE8FC !important;
                  }
                `}
              </style>

              {/* Search Dropdown */}
              {isSearchFocused && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  ...(searchMode === 'suggestions' ? { width: 'auto', minWidth: '200px' } : { right: 0 }),
                  marginTop: '4px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #F1F1F1',
                  boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                  zIndex: 1000,
                  maxHeight: searchMode === 'suggestions' ? '150px' : '400px',
                  overflowY: 'auto'
                }}>
                  {/* Suggestions Mode - Only show when "/" is typed */}
                  {searchMode === 'suggestions' && searchValue === '/' && (
                    <div style={{ padding: '8px' }}>
                      <p style={{
                        fontSize: '8px',
                        color: '#B0B0B0',
                        margin: '0 0 6px 0',
                        fontFamily: 'Poppins, sans-serif',
                        textTransform: 'uppercase'
                      }}>
                        SUGGESTED
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {[
                          { key: 'users', label: 'Users', icon: userIcon },
                          { key: 'listings', label: 'Listings', icon: listingboxIcon },
                          { key: 'requests', label: 'Requests', icon: requesticonIcon }
                        ].map((option) => (
                          <SuggestionOption
                            key={option.key}
                            option={option}
                            selectedCategory={selectedCategory}
                            onSelect={handleCategorySelect}
                          />
                        ))}
            </div>
                    </div>
                  )}

                  {/* Category Search Results */}
                  {searchMode === 'category' && selectedCategory && (
                    <div style={{ padding: '8px' }}>
                      {selectedCategory === 'users' && searchResults.map((user: any) => (
                        <div key={user.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px',
                          cursor: 'pointer'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#E3F2FD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: '11px',
                              color: '#6A6A6A',
                              margin: '0 0 3px 0',
                              fontFamily: 'Bricolage Grotesque, sans-serif',
                              fontWeight: 500
                            }}>
                              {user.name}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '9px',
                                color: '#64B5F6',
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                {user.plan}
                              </span>
                              <span style={{ color: '#B0B0B0', fontSize: '9px' }}>•</span>
                              <span style={{
                                fontSize: '9px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                {user.verified ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {selectedCategory === 'listings' && searchResults.map((listing: any) => (
                        <div key={listing.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px',
                          cursor: 'pointer'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#E3F2FD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <img src={listing.image} alt={listing.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: '11px',
                              color: '#6A6A6A',
                              margin: 0,
                              fontFamily: 'Bricolage Grotesque, sans-serif',
                              fontWeight: 500
                            }}>
                              {listing.name}
                            </p>
                          </div>
                        </div>
                      ))}
                      {selectedCategory === 'requests' && searchResults.map((request: any) => (
                        <div key={request.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px',
                          cursor: 'pointer'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#E3F2FD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <img src={request.image} alt={request.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: '11px',
                              color: '#6A6A6A',
                              margin: 0,
                              fontFamily: 'Bricolage Grotesque, sans-serif',
                              fontWeight: 500
                            }}>
                              {request.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Search Results */}
                  {searchMode === 'direct' && searchResults.length > 0 && (
                    <div style={{ padding: '8px' }}>
                      {searchResults.slice(0, 3).map((result: any, index: number) => (
                        <div key={`${result.type}-${result.id}-${index}`} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '6px',
                          cursor: 'pointer'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#E3F2FD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <img 
                              src={result.image || result.avatar} 
                              alt={result.name} 
                              style={{ 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                objectFit: 'cover' 
                              }} 
                            />
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '3px',
                            flex: 1,
                            minWidth: 0,
                            paddingTop: '4px'
                          }}>
                            <span style={{
                              fontSize: '8px',
                              color: '#64B5F6',
                              fontFamily: 'Poppins, sans-serif',
                              lineHeight: 1.2
                            }}>
                              {result.path}
                            </span>
                            <span style={{
                              fontSize: '13px',
                              color: '#6A6A6A',
                              fontFamily: 'Bricolage Grotesque, sans-serif',
                              fontWeight: 500,
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {result.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            )}

            {/* Right Side Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
              {/* Language Toggle */}
              <div className="relative language-selector" ref={languageDropdownRef}>
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E4E4',
                    borderRadius: '8px',
                    color: '#BABABA',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400
                  }}
                >
                  <span>{selectedLanguage}</span>
                  <img src={arrowDownIcon} alt="Arrow" style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
                </button>

                {isLanguageDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '160px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E4E4E4',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    padding: '6px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {['EN', 'FR', 'DE', 'ES'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setIsLanguageDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: selectedLanguage === lang ? '#F0F8FE' : 'transparent',
                          color: selectedLanguage === lang ? '#64B5F6' : '#212121',
                          fontSize: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Icon */}
              <div className="relative notification-dropdown" ref={notificationDropdownRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  style={{
                    position: 'relative',
                    width: 'auto',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <img 
                    src={notificationIcon} 
                    alt="Notifications" 
                    style={{ 
                      width: '24px', 
                      height: '24px',
                      filter: 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                    }}
                  />
                  {unreadCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#FF0000',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div 
                    className="notification-dropdown"
                    style={{
                      position: 'fixed',
                      right: '16px',
                      top: '64px',
                      width: '384px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1px solid #E4E4E4',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                      zIndex: 50,
                      maxHeight: '600px',
                      display: 'flex',
                      flexDirection: 'column',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {/* Header */}
                    <div style={{ padding: '20px', borderBottom: '1px solid #E4E4E4' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', margin: 0, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Notifications</h3>
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#9C9C9C'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>

                      {/* Tabs */}
                      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E4E4E4', position: 'relative' }}>
                        {(['all', 'unread', 'messages'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setNotificationTab(tab)}
                            style={{
                              paddingBottom: '8px',
                              fontSize: '12px',
                              fontWeight: 400,
                              color: notificationTab === tab ? '#64B5F6' : '#BABABA',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                              fontFamily: 'Poppins, sans-serif',
                              position: 'relative'
                            }}
                          >
                            {tab === 'all' ? 'All' : tab === 'unread' ? 'Unreads' : 'Messages'}
                            {notificationTab === tab && (
                              <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '-4px',
                                right: '-4px',
                                height: '2px',
                                backgroundColor: '#64B5F6'
                              }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notification List */}
                    <div style={{ 
                      flex: 1, 
                      overflowY: 'auto',
                      maxHeight: '400px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}>
                      <style>
                        {`
                          .notification-dropdown::-webkit-scrollbar {
                            display: none;
                          }
                        `}
                      </style>
                      {['Today', 'Yesterday'].map(day => {
                        const dayNotifs = filteredNotifications.filter(n => n.day === day);
                        if (dayNotifs.length === 0) return null;
                        
                        return (
                          <div key={day} style={{ paddingTop: day === 'Today' ? '12px' : '8px', paddingBottom: '4px' }}>
                            <p style={{ fontSize: '10px', fontWeight: 500, margin: '0 0 8px 24px', color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>{day}</p>
                            
                            {dayNotifs.map((notif) => (
                              <div key={notif.id} style={{ 
                                transition: 'background-color 0.2s',
                                cursor: 'pointer',
                                backgroundColor: notif.isRead ? 'transparent' : '#F5FBFF'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 24px' }}>
                                  <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '50%', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      backgroundColor: notif.type === 'message' ? '#E3F2FD' : '#F9A825',
                                      border: '2px solid white'
                                    }}>
                                      {notif.type === 'message' ? (
                                        <img src={avatar} alt="Avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                                      ) : (
                                        <img src={logoIcon} alt="Logo" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
                                      )}
                                    </div>
                                    <div style={{ 
                                      position: 'absolute', 
                                      bottom: '-2px', 
                                      right: '-2px', 
                                      width: '16px', 
                                      height: '16px', 
                                      borderRadius: '50%', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      backgroundColor: '#FFF'
                                    }}>
                                      <img src={notif.type === 'message' ? messageAvatarIcon : appNotificationIcon} alt="Icon" style={{ width: '12px', height: '12px' }} />
                                    </div>
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        {notif.sender ? (
                                          <p style={{ fontSize: '11px', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                                            <span style={{ 
                                              fontWeight: notif.isRead ? 400 : 600,
                                              color: notif.isRead ? '#939393' : '#616161'
                                            }}>
                                              {notif.sender}
                                            </span>
                                            <span style={{ color: '#939393' }}> {notif.text}</span>
                                          </p>
                                        ) : (
                                          <p style={{ 
                                            fontSize: '11px',
                                            fontWeight: notif.id === 2 && !notif.isRead ? 600 : 400,
                                            color: notif.isRead ? '#939393' : '#616161',
                                            margin: 0,
                                            fontFamily: 'Poppins, sans-serif'
                                          }}>
                                            {notif.text}
                                          </p>
                                        )}
                                        {notif.subText && (
                                          <p style={{ 
                                            fontSize: notif.id === 1 ? '11px' : '10px',
                                            color: notif.id === 1 && !notif.isRead ? '#64B5F6' : '#9E9E9E',
                                            margin: '2px 0 0 0',
                                            fontFamily: 'Poppins, sans-serif'
                                          }}>
                                            {notif.subText}
                                          </p>
                                        )}
                                        {notif.subText2 && (
                                          <p style={{ 
                                            fontSize: '10px',
                                            color: '#9E9E9E',
                                            margin: '2px 0 0 0',
                                            fontFamily: 'Poppins, sans-serif'
                                          }}>
                                            {notif.subText2}
                                          </p>
                                        )}
                                      </div>
                                      <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: notif.isRead ? '2px' : '4px',
                                        marginLeft: '8px',
                                        flexShrink: 0
                                      }}>
                                        <button style={{ 
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          padding: '2px',
                                          color: '#9C9C9C'
                                        }}>
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="6" cy="12" r="1.5"/>
                                            <circle cx="12" cy="12" r="1.5"/>
                                            <circle cx="18" cy="12" r="1.5"/>
                                          </svg>
                                        </button>
                                        {notif.isRead ? (
                                          <span style={{ fontSize: '10px', color: '#9E9E9E', fontFamily: 'Poppins, sans-serif' }}>{notif.time}</span>
                                        ) : (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: notif.id === 2 ? '12px' : '4px' }}>
                                            <span style={{ fontSize: '9px', color: '#9E9E9E', fontFamily: 'Poppins, sans-serif' }}>{notif.time}</span>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#64B5F6' }} />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {notif.id !== dayNotifs[dayNotifs.length - 1].id && <div style={{ borderBottom: '1px solid #F3F4F6', marginLeft: '72px' }} />}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    {unreadCount > 0 && (
                      <div style={{ 
                        padding: '16px 24px',
                        borderTop: '1px solid #E4E4E4',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <button
                          onClick={markAllAsRead}
                          style={{
                            color: '#939393',
                            fontSize: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          Mark all as read
                        </button>
                        <button 
                          onClick={() => {
                            navigate('/notifications');
                            setIsNotificationOpen(false);
                          }}
                          style={{
                            color: '#64B5F6',
                            fontSize: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          See all notifications →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    margin: 0,
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'Bricolage Grotesque, sans-serif'
                  }}>
                    Herman Kabore
                  </p>
                  <p style={{ 
                    margin: 0,
                    color: '#B0B0B0',
                    fontSize: '10px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Main Admin
                  </p>
                </div>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#E3F2FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                </div>
                <div className="relative menu-dropdown" ref={menuDropdownRef}>
                  <button
                    onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#171717'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          {selectedSidebarOption === 'users' ? (
            viewingUserProfile && selectedUserForProfile ? (
              // User Activity Details View
              <div style={{ paddingRight: '14px' }}>
                {/* Two column layout: right sidebar starts at the title row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 380px',
                    gap: '20px',
                    alignItems: 'start'
                  }}
                >
                  {/* Left: Title + Description + Activity Card */}
                  <div>
                    {/* Title and Description (match overview sizing) */}
                    <div style={{ marginBottom: '12px' }}>
                      <h1
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#202224',
                          margin: '0 0 2px 0',
                          fontFamily: 'Bricolage Grotesque, sans-serif'
                        }}
                      >
                        User activity details
                      </h1>
                      <p
                        style={{
                          color: '#9C9C9C',
                          fontSize: '12px',
                          margin: 0,
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        Lorem ipsum dolor sit amet consectetur. Amet mi porttitor duis facilisis amet erat urna.
                      </p>
                    </div>

                    {/* Activity Card */}
                    {!isActivityDeleted && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '18px',
                        border: '1px solid #F1F1F1',
                        padding: '16px'
                      }}
                    >
                    {/* Top Bar: Search + Export + Sort */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      {/* Search Bar */}
                      <div style={{ flex: 1, position: 'relative', maxWidth: '280px' }}>
                        <input
                          type="text"
                          placeholder="Search an activity?"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontFamily: 'Poppins, sans-serif',
                            color: '#6A6A6A',
                            backgroundColor: '#F1F1F1',
                            outline: 'none',
                            caretColor: '#CFE8FC'
                          }}
                        />
                      </div>

                      {/* Export Data Button + Sort By Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
                        {/* Export Data Button */}
                        <button style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#64B5F6',
                          fontSize: '11px',
                          fontFamily: 'Poppins, sans-serif',
                          padding: 0
                        }}>
                          <span style={{ color: '#64B5F6' }}>Export data</span>
                          <img
                            src={exportIcon}
                            alt="Export"
                            style={{
                              width: '14px',
                              height: '14px',
                              filter:
                                'brightness(0) saturate(100%) invert(67%) sepia(45%) saturate(345%) hue-rotate(168deg) brightness(97%) contrast(93%)'
                            }}
                          />
                        </button>

                        {/* Sort By Dropdown */}
                        <select style={{
                          padding: '4px 10px',
                          paddingRight: '28px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '11px',
                          color: '#939393',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 8px center',
                          backgroundSize: '12px'
                        }}>
                          <option>Sort by</option>
                        </select>
                      </div>
                    </div>

                    {/* Date Header */}
                    <div style={{
                      color: '#939393',
                      fontSize: '11px',
                      fontFamily: 'Poppins, sans-serif',
                      marginTop: '16px',
                      marginBottom: '16px'
                    }}>
                      Mon, 21 Dec 2025
                    </div>

                    {/* Activity Entry */}
                    <div style={{
                      display: 'flex',
                      gap: '12px'
                    }}>
                      {/* Profile with Notification Bell */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: '#D5E9BD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={selectedUserForProfile.avatar}
                            alt={selectedUserForProfile.name}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        {/* Notification Bell Icon */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #F1F1F1',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                          <img
                            src={notifIcon}
                            alt="Notification"
                            style={{
                              width: '12px',
                              height: '12px',
                              filter: 'brightness(0) saturate(100%) invert(67%) sepia(45%) saturate(345%) hue-rotate(168deg) brightness(97%) contrast(93%)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Activity Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          marginBottom: '0px',
                          marginTop: '4px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#6A6A6A',
                            fontFamily: 'Bricolage Grotesque, sans-serif',
                            fontWeight: 500
                          }}>
                            Account created
                          </span>
                          <div 
                            ref={activityCardMoreMenuButtonRef}
                            className="activity-card-more-options-button"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActivityCardMoreMenu({ anchorRect: rect });
                            }}
                            style={{
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="4" cy="8" r="1.5" fill={activityCardMoreMenu ? '#64B5F6' : '#4D4D4D'}/>
                              <circle cx="8" cy="8" r="1.5" fill={activityCardMoreMenu ? '#64B5F6' : '#4D4D4D'}/>
                              <circle cx="12" cy="8" r="1.5" fill={activityCardMoreMenu ? '#64B5F6' : '#4D4D4D'}/>
                            </svg>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '11px',
                              color: '#939393',
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                              This user @
                            </span>
                            <span style={{
                              fontSize: '11px',
                              color: '#939393',
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 500
                            }}>
                              {selectedUserForProfile.name.split(' ')[0]}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              color: '#B0B0B0',
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                              {selectedUserForProfile.name.split(' ').slice(1).join(' ')} joined Bao'Afrik
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#64B5F6',
                                fontFamily: 'Poppins, sans-serif',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                            >
                              View more
                            </span>
                          </div>
                          <span style={{
                            fontSize: '10px',
                            color: '#B0B0B0',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            19 min ago
                          </span>
                        </div>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Activity Card More Options Dropdown */}
                    {!isActivityDeleted && activityCardMoreMenu && (() => {
                      const menuWidth = 200;
                      const margin = 8;
                      const left = Math.max(margin, Math.min(window.innerWidth - menuWidth - margin, activityCardMoreMenu.anchorRect.right - menuWidth));
                      const top = activityCardMoreMenu.anchorRect.bottom + 8;

                      return createPortal(
                        <div
                          ref={activityCardMoreMenuRef}
                          className="activity-card-more-options-dropdown"
                          style={{
                            position: 'fixed',
                            top,
                            left,
                            width: `${menuWidth}px`,
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #F1F1F1',
                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                            padding: '8px',
                            zIndex: 99999
                          }}
                        >
                          {/* Delete the activity */}
                          <div
                            onClick={() => {
                              const activityText = `${selectedUserForProfile.name.split(' ')[0]} joined Bao'Afrik`;
                              setActivityToDelete(activityText);
                              setActivityCardMoreMenu(null);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.cursor = 'pointer';
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px',
                              borderRadius: '8px',
                              cursor: `url(${mouseCursorIcon}), auto`,
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
                            <span style={{ fontSize: '12px', color: '#FF5151', fontFamily: 'Poppins, sans-serif' }}>Delete the activity</span>
                          </div>

                          {/* Close */}
                          <div
                            onClick={() => setActivityCardMoreMenu(null)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.cursor = 'pointer';
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px',
                              borderRadius: '8px',
                              backgroundColor: '#FAFAFA',
                              cursor: `url(${mouseCursorIcon}), auto`,
                              transition: 'background-color 0.2s',
                              marginTop: '4px'
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <span style={{ fontSize: '12px', color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Close</span>
                          </div>
                        </div>,
                        document.body
                      );
                    })()}

                    {/* Delete Confirmation Modal */}
                    {activityToDelete && !isDeleteActivitySuccess && (
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: '#0000001A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10000
                        }}
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            setActivityToDelete(null);
                          }
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '30px',
                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                            padding: '30px',
                            maxWidth: '420px',
                            width: '90%',
                            minHeight: '320px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close Button */}
                          <button
                            type="button"
                            onClick={() => setActivityToDelete(null)}
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {/* Icon */}
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                            <img
                              src={redtrashIcon}
                              alt="Delete"
                              style={{ width: '80px', height: '80px' }}
                            />
                          </div>

                          {/* Text */}
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
                              The activity " <span style={{ color: '#B0B0B0' }}>{activityToDelete}</span> " will be<br />
                              permanently deleted, do you<br />
                              wish to continue ?
                            </p>
                          </div>

                          {/* Buttons */}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setActivityToDelete(null)}
                              style={{
                                backgroundColor: '#F1F1F1',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
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
                              onClick={() => {
                                setIsDeleteActivitySuccess(true);
                              }}
                              style={{
                                backgroundColor: '#FF5151',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                              <span style={{ color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Yes, Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delete Success Modal */}
                    {activityToDelete && isDeleteActivitySuccess && (
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: '#0000001A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10000
                        }}
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            setIsActivityDeleted(true);
                            setActivityToDelete(null);
                            setIsDeleteActivitySuccess(false);
                          }
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '30px',
                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                            padding: '30px',
                            maxWidth: '420px',
                            width: '90%',
                            minHeight: '320px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsActivityDeleted(true);
                              setActivityToDelete(null);
                              setIsDeleteActivitySuccess(false);
                            }}
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {/* Icon */}
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                            <img
                              src={verityIcon}
                              alt="Success"
                              style={{ width: '65px', height: '65px' }}
                            />
                          </div>

                          {/* Text */}
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
                              The activity " <span style={{ color: '#B0B0B0' }}>{activityToDelete}</span> " has been successfully deleted.
                            </p>
                          </div>

                          {/* Buttons */}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setIsActivityDeleted(false);
                                setActivityToDelete(null);
                                setIsDeleteActivitySuccess(false);
                                setDeleteCountdown(5);
                              }}
                              style={{
                                backgroundColor: '#F1F1F1',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                <path d="M3 21v-5h5" />
                              </svg>
                              <span style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Undo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsActivityDeleted(true);
                                setActivityToDelete(null);
                                setIsDeleteActivitySuccess(false);
                              }}
                              style={{
                                backgroundColor: '#F9A825',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
                                cursor: 'pointer',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px'
                              }}
                            >
                              Close - {deleteCountdown}s
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: User Details Sidebar (aligned with title) */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid #F1F1F1',
                      padding: '14px',
                      marginTop: '10px'
                    }}
                  >
                    {/* Top Section: User Profile */}
                    <div
                      style={{
                        backgroundColor: '#FAFAFA',
                        borderRadius: '14px',
                        padding: '14px',
                        marginBottom: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      {/* Profile with Dot */}
                      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#D5E9BD',
                          border: '2px solid #FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={selectedUserForProfile.avatar}
                            alt={selectedUserForProfile.name}
                            style={{
                            width: '46px',
                            height: '46px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        {/* Status Dot */}
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: '#D9D9D9',
                          border: '2px solid #FFFFFF'
                        }} />
                      </div>

                      {/* User Name */}
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#212121',
                        margin: '0 0 4px 0',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        textAlign: 'center'
                      }}>
                        {selectedUserForProfile.name}
                      </h3>

                      {/* Last Login */}
                      <p style={{
                        fontSize: '11px',
                        color: '#B0B0B0',
                        margin: '0 0 4px 0',
                        fontFamily: 'Poppins, sans-serif',
                        textAlign: 'center'
                      }}>
                        Last login: today at 19:25
                      </p>

                      {/* Account Suspended Badge */}
                      {isUserSuspended && (
                        <div style={{
                          display: 'inline-block',
                          padding: '0px 8px',
                          backgroundColor: '#FEF6E9',
                          border: '1px solid #FDE4BB',
                          borderRadius: '8px',
                          marginBottom: '12px'
                        }}>
                          <span style={{
                            fontSize: '11px',
                            color: '#F9A825',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 300
                          }}>
                            Account Suspended
                          </span>
                        </div>
                      )}

                      {/* Three Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center'
                      }}>
                        {[
                          { icon: chatsIcon, alt: 'Chat' },
                          { icon: sendIcon, alt: 'Send' },
                          { icon: 'ellipsis', alt: 'More' }
                        ].map((action, idx) => {
                          const isMoreButton = action.icon === 'ellipsis';
                          const isMoreMenuOpen = isMoreButton && sidebarMoreMenu !== null;
                          return (
                            <button
                              key={idx}
                              ref={isMoreButton ? sidebarMoreMenuButtonRef : null}
                              onClick={(e) => {
                                if (isMoreButton) {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setSidebarMoreMenu(prev => prev ? null : { anchorRect: rect });
                                }
                              }}
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                backgroundColor: isMoreMenuOpen ? '#F0F8FE' : '#FFFFFF',
                                border: isMoreMenuOpen ? '1px solid #CFE8FC' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.02)'
                              }}
                            >
                              {action.icon === 'ellipsis' ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <circle cx="4" cy="8" r="1.5" fill={isMoreMenuOpen ? '#64B5F6' : '#212121'}/>
                                  <circle cx="8" cy="8" r="1.5" fill={isMoreMenuOpen ? '#64B5F6' : '#212121'}/>
                                  <circle cx="12" cy="8" r="1.5" fill={isMoreMenuOpen ? '#64B5F6' : '#212121'}/>
                                </svg>
                              ) : (
                                <img
                                  src={action.icon}
                                  alt={action.alt}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    filter: 'brightness(0) saturate(100%) invert(13%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)'
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Sidebar More Options Dropdown */}
                      {sidebarMoreMenu && (() => {
                        const menuWidth = 200;
                        const margin = 8;
                        const left = Math.max(margin, Math.min(window.innerWidth - menuWidth - margin, sidebarMoreMenu.anchorRect.right - menuWidth));
                        const top = sidebarMoreMenu.anchorRect.bottom + 8;

                        const primaryHoverOn = (e: React.MouseEvent<HTMLDivElement>) => {
                          e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
                          e.currentTarget.style.backgroundColor = '#F0F8FE';
                          const icon = e.currentTarget.querySelector('img');
                          const text = e.currentTarget.querySelector('span');
                          if (icon) (icon as HTMLImageElement).style.filter =
                            'brightness(0) saturate(100%) invert(67%) sepia(45%) saturate(345%) hue-rotate(168deg) brightness(97%) contrast(93%)';
                          if (text) (text as HTMLElement).style.color = '#64B5F6';
                        };
                        const primaryHoverOff = (e: React.MouseEvent<HTMLDivElement>) => {
                          e.currentTarget.style.cursor = 'pointer';
                          e.currentTarget.style.backgroundColor = 'transparent';
                          const icon = e.currentTarget.querySelector('img');
                          const text = e.currentTarget.querySelector('span');
                          if (icon) (icon as HTMLImageElement).style.filter =
                            'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)';
                          if (text) (text as HTMLElement).style.color = '#939393';
                        };

                        const baseItemStyle: React.CSSProperties = {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          borderRadius: '8px',
                          cursor: `url(${mouseCursorIcon}), auto`,
                          transition: 'background-color 0.2s'
                        };

                        return createPortal(
                          <div
                            ref={sidebarMoreMenuRef}
                            className="sidebar-more-options-dropdown"
                            style={{
                              position: 'fixed',
                              top,
                              left,
                              width: `${menuWidth}px`,
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid #F1F1F1',
                              boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                              padding: '8px',
                              zIndex: 99999
                            }}
                          >
                            {/* Edit user access */}
                            <div 
                              onClick={() => {
                                setIsManageAccessView(true);
                                setSidebarMoreMenu(null);
                              }}
                              onMouseEnter={primaryHoverOn} 
                              onMouseLeave={primaryHoverOff} 
                              style={baseItemStyle}
                            >
                              <img
                                src={pencilIcon}
                                alt="Edit access"
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
                                }}
                              />
                              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>Edit user access</span>
                            </div>

                            {/* Suspend/Unsuspend the user */}
                            <div 
                              onClick={() => {
                                if (isUserSuspended) {
                                  setIsUserSuspended(false);
                                  setSidebarMoreMenu(null);
                                } else {
                                  const userName = `@${selectedUserForProfile.name.split(' ')[0]}`;
                                  setUserToSuspend(userName);
                                  setSidebarMoreMenu(null);
                                }
                              }}
                              onMouseEnter={primaryHoverOn} 
                              onMouseLeave={primaryHoverOff} 
                              style={baseItemStyle}
                            >
                              <img
                                src={suspendIcon}
                                alt={isUserSuspended ? "Unsuspend" : "Suspend"}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
                                }}
                              />
                              <span style={{ fontSize: '12px', color: '#939393', fontFamily: 'Poppins, sans-serif' }}>
                                {isUserSuspended ? 'Unsuspend the user' : 'Suspend the user'}
                              </span>
                            </div>

                            {/* Delete user account */}
                            <div
                              onMouseEnter={(e) => {
                                e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.cursor = 'pointer';
                              }}
                              style={baseItemStyle}
                            >
                              <img src={trashIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
                              <span style={{ fontSize: '12px', color: '#FF5151', fontFamily: 'Poppins, sans-serif' }}>Delete user account</span>
                            </div>

                            {/* Close */}
                            <div
                              onClick={() => setSidebarMoreMenu(null)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.cursor = `url(${mouseCursorIcon}), auto`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.cursor = 'pointer';
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                borderRadius: '8px',
                                backgroundColor: '#FAFAFA',
                                cursor: `url(${mouseCursorIcon}), auto`,
                                transition: 'background-color 0.2s',
                                marginTop: '4px'
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                              <span style={{ fontSize: '12px', color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}>Close</span>
                            </div>
                          </div>,
                          document.body
                        );
                      })()}

                    {/* Suspend Confirmation Modal */}
                    {userToSuspend && !isSuspendSuccess && (
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: '#0000001A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10000
                        }}
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            setUserToSuspend(null);
                          }
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '30px',
                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                            padding: '30px',
                            maxWidth: '420px',
                            width: '90%',
                            minHeight: '280px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close Button */}
                          <button
                            type="button"
                            onClick={() => setUserToSuspend(null)}
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {/* Icon */}
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                            <img
                              src={warningIcon}
                              alt="Warning"
                              style={{ width: '80px', height: '80px' }}
                            />
                          </div>

                          {/* Text */}
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
                              <span style={{ color: '#64B5F6' }}>{userToSuspend}</span> account will be suspended. Do you wish to continue?
                            </p>
                          </div>

                          {/* Buttons */}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setUserToSuspend(null)}
                              style={{
                                backgroundColor: '#F1F1F1',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
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
                              onClick={() => {
                                setIsSuspendSuccess(true);
                              }}
                              style={{
                                backgroundColor: '#212121',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
                                cursor: 'pointer',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px'
                              }}
                            >
                              Yes, Deactivate
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Suspend Success Modal */}
                    {userToSuspend && isSuspendSuccess && (
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: '#0000001A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10000
                        }}
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            setIsUserSuspended(true);
                            setUserToSuspend(null);
                            setIsSuspendSuccess(false);
                          }
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '30px',
                            boxShadow: '0 4px 30px 0 rgba(0, 0, 0, 0.05)',
                            padding: '30px',
                            maxWidth: '420px',
                            width: '90%',
                            minHeight: '280px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserSuspended(true);
                              setUserToSuspend(null);
                              setIsSuspendSuccess(false);
                            }}
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6l12 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {/* Icon */}
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}>
                            <img
                              src={verityIcon}
                              alt="Success"
                              style={{ width: '65px', height: '65px' }}
                            />
                          </div>

                          {/* Text */}
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
                              <span style={{ color: '#64B5F6' }}>{userToSuspend}</span> account has been<br />
                              successfully suspended.
                            </p>
                          </div>

                          {/* Buttons */}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setIsUserSuspended(false);
                                setUserToSuspend(null);
                                setIsSuspendSuccess(false);
                                setSuspendCountdown(10);
                              }}
                              style={{
                                backgroundColor: '#F1F1F1',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                <path d="M3 21v-5h5" />
                              </svg>
                              <span style={{ color: '#6A6A6A', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Undo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsUserSuspended(true);
                                setUserToSuspend(null);
                                setIsSuspendSuccess(false);
                              }}
                              style={{
                                backgroundColor: '#F9A825',
                                borderRadius: '12px',
                                border: 'none',
                                padding: '10px 28px',
                                cursor: 'pointer',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px'
                              }}
                            >
                              Close · {suspendCountdown}s
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>

                    {/* Manage Access View */}
                    {isManageAccessView && (
                      <>
                        {/* Manage Access Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          {/* Left: X button and "Manage access" text */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <button
                              onClick={() => setIsManageAccessView(false)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                            <span style={{
                              fontSize: '14px',
                              color: '#212121',
                              fontFamily: 'Bricolage Grotesque, sans-serif',
                              fontWeight: 600
                            }}>
                              Manage access
                            </span>
                          </div>

                          {/* Right: Access badge and expand button */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            {/* Access Badge */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 6px',
                              backgroundColor: '#F0F8FE',
                              borderRadius: '6px',
                              height: '20px'
                            }}>
                              <span style={{
                                fontSize: '10px',
                                color: '#64B5F6',
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                85/112 Access
                              </span>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="#64B5F6" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </div>

                            {/* Expand Button */}
                            <button
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <img
                                src={expandIcon}
                                alt="Expand"
                                style={{ width: '16px', height: '16px' }}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Description Text */}
                        <p style={{
                          fontSize: '11px',
                          color: '#9C9C9C',
                          fontFamily: 'Poppins, sans-serif',
                          margin: '0 0 16px 0',
                          lineHeight: '1.5',
                          marginTop: '0px'
                        }}>
                          Manage user access permissions and control what features this user can access.
                        </p>

                        {/* Search Bar */}
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                          <input
                            type="text"
                            value={accessSearchValue}
                            onChange={(e) => setAccessSearchValue(e.target.value)}
                            placeholder="search"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              backgroundColor: '#F1F1F1',
                              borderRadius: '8px',
                              border: 'none',
                              outline: 'none',
                              color: '#6A6A6A',
                              fontSize: '12px',
                              fontFamily: 'Poppins, sans-serif',
                              caretColor: '#CFE8FC'
                            }}
                          />
                        </div>

                        {/* Access Rows - Scrollable Container */}
                        <div 
                          ref={scrollableContainerRef}
                          className="access-rows-scrollable"
                          style={{ 
                            position: 'relative',
                            height: '500px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            paddingRight: '4px',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                          } as React.CSSProperties}
                          onScroll={(e) => {
                            const target = e.currentTarget;
                            const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
                            // Update fade visibility based on scroll position
                          }}
                        >
                          <style>{`
                            .access-rows-scrollable::-webkit-scrollbar {
                              display: none !important;
                              width: 0 !important;
                              height: 0 !important;
                              background: transparent !important;
                            }
                            .access-rows-scrollable {
                              -ms-overflow-style: none !important;
                              scrollbar-width: none !important;
                            }
                          `}</style>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {/* Listings Access Row */}
                          <div>
                            {/* Top Row: Title, Dot, Badge, Toggle */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontSize: '12px',
                                  color: '#212121',
                                  fontFamily: 'Bricolage Grotesque, sans-serif',
                                  fontWeight: 600
                                }}>
                                  Listings
                                </span>
                                <span style={{ color: '#939393', fontSize: '12px' }}>•</span>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#70E183',
                                  fontFamily: 'Poppins, sans-serif'
                                }}>
                                  18/18 Access
                                </span>
                              </div>
                              <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={accessToggles.listings}
                                  onChange={(e) => setAccessToggles({ ...accessToggles, listings: e.target.checked })}
                                  style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: accessToggles.listings ? '#70E183' : '#D9D9D9',
                                  borderRadius: '10px',
                                  transition: 'background-color 0.3s'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: '16px',
                                    width: '16px',
                                    left: accessToggles.listings ? '17px' : '3px',
                                    bottom: '2px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '50%',
                                    transition: 'left 0.3s'
                                  }} />
                                </span>
                              </label>
                            </div>
                            {/* Bottom Row: Description and Arrow */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <p style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif',
                                margin: 0,
                                lineHeight: '1.5'
                              }}>
                                Lorem ipsum dolor sit amet consectetur. Neque vitae rhon cus amet nec diam in.
                              </p>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#939393"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                  transform: expandedPermissionLists.has('listings') ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s',
                                  cursor: 'pointer',
                                  flexShrink: 0
                                }}
                                onClick={() => {
                                  const newSet = new Set(expandedPermissionLists);
                                  if (newSet.has('listings')) {
                                    newSet.delete('listings');
                                  } else {
                                    newSet.add('listings');
                                  }
                                  setExpandedPermissionLists(newSet);
                                }}
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </div>
                            {/* Permission List */}
                            {expandedPermissionLists.has('listings') && (
                              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {[
                                  { key: 'can-create', label: 'Can create a listing' },
                                  { key: 'can-delete', label: 'Can delete a listing' },
                                  { key: 'can-modify', label: 'Can modify a listing' },
                                  { key: 'can-review', label: 'Can review listings from other users' },
                                  { key: 'can-report', label: 'Can report listing from other users' },
                                  { key: 'can-share', label: 'Can share a listing' },
                                  { key: 'can-contact', label: 'Can contact a seller for a listing' }
                                ].map((permission) => (
                                  <div key={permission.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '2px 0'
                                  }}>
                                    <span style={{
                                      fontSize: '10px',
                                      color: '#939393',
                                      fontFamily: 'Poppins, sans-serif'
                                    }}>
                                      {permission.label}
                                    </span>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '30px', height: '16px', cursor: 'pointer' }}>
                                      <input
                                        type="checkbox"
                                        checked={permissionToggles.listings[permission.key] || false}
                                        onChange={(e) => {
                                          setPermissionToggles({
                                            ...permissionToggles,
                                            listings: {
                                              ...permissionToggles.listings,
                                              [permission.key]: e.target.checked
                                            }
                                          });
                                        }}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                      />
                                      <span style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: (permissionToggles.listings[permission.key] || false) ? '#70E183' : '#D9D9D9',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.3s'
                                      }}>
                                        <span style={{
                                          position: 'absolute',
                                          content: '""',
                                          height: '12px',
                                          width: '12px',
                                          left: (permissionToggles.listings[permission.key] || false) ? '14px' : '2px',
                                          bottom: '2px',
                                          backgroundColor: '#FFFFFF',
                                          borderRadius: '50%',
                                          transition: 'left 0.3s'
                                        }} />
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Messages Access Row */}
                          <div>
                            {/* Top Row: Title, Dot, Badge, Toggle */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontSize: '12px',
                                  color: '#212121',
                                  fontFamily: 'Bricolage Grotesque, sans-serif',
                                  fontWeight: 600
                                }}>
                                  Messages
                                </span>
                                <span style={{ color: '#939393', fontSize: '12px' }}>•</span>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#70E183',
                                  fontFamily: 'Poppins, sans-serif'
                                }}>
                                  18/18 Access
                                </span>
                              </div>
                              <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={accessToggles.messages}
                                  onChange={(e) => setAccessToggles({ ...accessToggles, messages: e.target.checked })}
                                  style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: accessToggles.messages ? '#70E183' : '#D9D9D9',
                                  borderRadius: '10px',
                                  transition: 'background-color 0.3s'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: '16px',
                                    width: '16px',
                                    left: accessToggles.messages ? '17px' : '3px',
                                    bottom: '2px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '50%',
                                    transition: 'left 0.3s'
                                  }} />
                                </span>
                              </label>
                            </div>
                            {/* Bottom Row: Description and Arrow */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <p style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif',
                                margin: 0,
                                lineHeight: '1.5'
                              }}>
                                Lorem ipsum dolor sit amet consectetur. Neque vitae rhon cus amet nec diam in.
                              </p>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#939393"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                  transform: expandedPermissionLists.has('messages') ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s',
                                  cursor: 'pointer',
                                  flexShrink: 0
                                }}
                                onClick={() => {
                                  const newSet = new Set(expandedPermissionLists);
                                  if (newSet.has('messages')) {
                                    newSet.delete('messages');
                                  } else {
                                    newSet.add('messages');
                                  }
                                  setExpandedPermissionLists(newSet);
                                }}
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </div>
                            {/* Permission List */}
                            {expandedPermissionLists.has('messages') && (
                              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {[
                                  { key: 'can-send-message', label: 'Can send message to a user' },
                                  { key: 'can-send-files', label: 'Can send files to a user' }
                                ].map((permission) => (
                                  <div key={permission.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '2px 0'
                                  }}>
                                    <span style={{
                                      fontSize: '10px',
                                      color: '#939393',
                                      fontFamily: 'Poppins, sans-serif'
                                    }}>
                                      {permission.label}
                                    </span>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '30px', height: '16px', cursor: 'pointer' }}>
                                      <input
                                        type="checkbox"
                                        checked={permissionToggles.messages[permission.key] || false}
                                        onChange={(e) => {
                                          setPermissionToggles({
                                            ...permissionToggles,
                                            messages: {
                                              ...permissionToggles.messages,
                                              [permission.key]: e.target.checked
                                            }
                                          });
                                        }}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                      />
                                      <span style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: (permissionToggles.messages[permission.key] || false) ? '#70E183' : '#D9D9D9',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.3s'
                                      }}>
                                        <span style={{
                                          position: 'absolute',
                                          content: '""',
                                          height: '12px',
                                          width: '12px',
                                          left: (permissionToggles.messages[permission.key] || false) ? '14px' : '2px',
                                          bottom: '2px',
                                          backgroundColor: '#FFFFFF',
                                          borderRadius: '50%',
                                          transition: 'left 0.3s'
                                        }} />
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Requests Access Row */}
                          <div>
                            {/* Top Row: Title, Dot, Badge, Toggle */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontSize: '12px',
                                  color: '#212121',
                                  fontFamily: 'Bricolage Grotesque, sans-serif',
                                  fontWeight: 600
                                }}>
                                  Requests
                                </span>
                                <span style={{ color: '#939393', fontSize: '12px' }}>•</span>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#FAB951',
                                  fontFamily: 'Poppins, sans-serif'
                                }}>
                                  12/18 Access
                                </span>
                              </div>
                              <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={accessToggles.requests}
                                  onChange={(e) => setAccessToggles({ ...accessToggles, requests: e.target.checked })}
                                  style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: accessToggles.requests ? '#70E183' : '#D9D9D9',
                                  borderRadius: '10px',
                                  transition: 'background-color 0.3s'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: '16px',
                                    width: '16px',
                                    left: accessToggles.requests ? '17px' : '3px',
                                    bottom: '2px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '50%',
                                    transition: 'left 0.3s'
                                  }} />
                                </span>
                              </label>
                            </div>
                            {/* Bottom Row: Description and Arrow */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <p style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif',
                                margin: 0,
                                lineHeight: '1.5'
                              }}>
                                Lorem ipsum dolor sit amet consectetur. Neque vitae rhon cus amet nec diam in.
                              </p>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#939393"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                  transform: expandedPermissionLists.has('requests') ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s',
                                  cursor: 'pointer',
                                  flexShrink: 0
                                }}
                                onClick={() => {
                                  const newSet = new Set(expandedPermissionLists);
                                  if (newSet.has('requests')) {
                                    newSet.delete('requests');
                                  } else {
                                    newSet.add('requests');
                                  }
                                  setExpandedPermissionLists(newSet);
                                }}
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </div>
                            {/* Permission List */}
                            {expandedPermissionLists.has('requests') && (
                              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {[
                                  { key: 'can-create-request', label: 'Can create a request' },
                                  { key: 'can-respond', label: 'Can respond to a request' }
                                ].map((permission) => (
                                  <div key={permission.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '2px 0'
                                  }}>
                                    <span style={{
                                      fontSize: '10px',
                                      color: '#939393',
                                      fontFamily: 'Poppins, sans-serif'
                                    }}>
                                      {permission.label}
                                    </span>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '30px', height: '16px', cursor: 'pointer' }}>
                                      <input
                                        type="checkbox"
                                        checked={permissionToggles.requests[permission.key] || false}
                                        onChange={(e) => {
                                          setPermissionToggles({
                                            ...permissionToggles,
                                            requests: {
                                              ...permissionToggles.requests,
                                              [permission.key]: e.target.checked
                                            }
                                          });
                                        }}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                      />
                                      <span style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: (permissionToggles.requests[permission.key] || false) ? '#70E183' : '#D9D9D9',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.3s'
                                      }}>
                                        <span style={{
                                          position: 'absolute',
                                          content: '""',
                                          height: '12px',
                                          width: '12px',
                                          left: (permissionToggles.requests[permission.key] || false) ? '14px' : '2px',
                                          bottom: '2px',
                                          backgroundColor: '#FFFFFF',
                                          borderRadius: '50%',
                                          transition: 'left 0.3s'
                                        }} />
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Users Access Row */}
                          <div>
                            {/* Top Row: Title, Dot, Badge, Toggle */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontSize: '12px',
                                  color: '#212121',
                                  fontFamily: 'Bricolage Grotesque, sans-serif',
                                  fontWeight: 600
                                }}>
                                  Users
                                </span>
                                <span style={{ color: '#939393', fontSize: '12px' }}>•</span>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#FAB951',
                                  fontFamily: 'Poppins, sans-serif'
                                }}>
                                  18/18 Access
                                </span>
                              </div>
                              <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={accessToggles.users}
                                  onChange={(e) => setAccessToggles({ ...accessToggles, users: e.target.checked })}
                                  style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: accessToggles.users ? '#70E183' : '#D9D9D9',
                                  borderRadius: '10px',
                                  transition: 'background-color 0.3s'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: '16px',
                                    width: '16px',
                                    left: accessToggles.users ? '17px' : '3px',
                                    bottom: '2px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '50%',
                                    transition: 'left 0.3s'
                                  }} />
                                </span>
                              </label>
                            </div>
                            {/* Bottom Row: Description and Arrow */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <p style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif',
                                margin: 0,
                                lineHeight: '1.5'
                              }}>
                                Lorem ipsum dolor sit amet consectetur. Neque vitae rhon cus amet nec diam in.
                              </p>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#939393"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                  transform: expandedPermissionLists.has('users') ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s',
                                  cursor: 'pointer',
                                  flexShrink: 0
                                }}
                                onClick={() => {
                                  const newSet = new Set(expandedPermissionLists);
                                  if (newSet.has('users')) {
                                    newSet.delete('users');
                                  } else {
                                    newSet.add('users');
                                  }
                                  setExpandedPermissionLists(newSet);
                                }}
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </div>
                            {/* Permission List */}
                            {expandedPermissionLists.has('users') && (
                              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {[
                                  { key: 'can-view', label: 'Can view user profiles' },
                                  { key: 'can-edit', label: 'Can edit user information' }
                                ].map((permission) => (
                                  <div key={permission.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '2px 0'
                                  }}>
                                    <span style={{
                                      fontSize: '10px',
                                      color: '#939393',
                                      fontFamily: 'Poppins, sans-serif'
                                    }}>
                                      {permission.label}
                                    </span>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '30px', height: '16px', cursor: 'pointer' }}>
                                      <input
                                        type="checkbox"
                                        checked={permissionToggles.users[permission.key] || false}
                                        onChange={(e) => {
                                          setPermissionToggles({
                                            ...permissionToggles,
                                            users: {
                                              ...permissionToggles.users,
                                              [permission.key]: e.target.checked
                                            }
                                          });
                                        }}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                      />
                                      <span style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: (permissionToggles.users[permission.key] || false) ? '#70E183' : '#D9D9D9',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.3s'
                                      }}>
                                        <span style={{
                                          position: 'absolute',
                                          content: '""',
                                          height: '12px',
                                          width: '12px',
                                          left: (permissionToggles.users[permission.key] || false) ? '14px' : '2px',
                                          bottom: '2px',
                                          backgroundColor: '#FFFFFF',
                                          borderRadius: '50%',
                                          transition: 'left 0.3s'
                                        }} />
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          </div>
                          {/* Fade Effect at Bottom - Only show when expanded and scrollable */}
                          {expandedPermissionLists.size > 0 && isScrollable && (
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: '4px',
                              height: '40px',
                              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
                              pointerEvents: 'none',
                              zIndex: 1
                            }} />
                          )}
                        </div>
                      </>
                    )}

                    {/* Tabs */}
                    {!isManageAccessView && (
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '16px',
                      marginLeft: '-14px',
                      marginRight: '-14px',
                      paddingLeft: '14px',
                      paddingRight: '14px',
                      borderBottom: '1px solid #F1F1F1'
                    }}>
                      {['About user', 'Reviews and rates', 'Reported issues ab...'].map((tab, idx) => (
                        <button
                          key={idx}
                          style={{
                            padding: '8px 0',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: idx === 0 ? '2px solid #64B5F6' : '2px solid transparent',
                            color: idx === 0 ? '#64B5F6' : '#B0B0B0',
                          fontSize: '11px',
                            fontFamily: 'Poppins, sans-serif',
                            cursor: 'pointer',
                            marginBottom: '-1px'
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    )}

                    {/* See user bio */}
                    {!isManageAccessView && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 0',
                      marginBottom: '8px',
                      marginLeft: '-14px',
                      marginRight: '-14px',
                      paddingLeft: '14px',
                      paddingRight: '14px',
                      borderBottom: '1px solid #F1F1F1'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#6A6A6A',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        See user bio
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    )}

                    {/* Account Information */}
                    {!isManageAccessView && (
                    <>
                    <div style={{ marginBottom: '12px' }}>
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setIsAccountInfoOpen(!isAccountInfoOpen)}
                      >
                        <span style={{
                          fontSize: '12px',
                          color: '#6A6A6A',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Account Information
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isAccountInfoOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      {isAccountInfoOpen && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px'
                      }}>
                        {/* Column 1 */}
                        <div>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '4px'
                            }}>
                              <img
                                src={userIcon}
                                alt="Joined"
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  filter: 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                                }}
                              />
                              <span style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                Joined
                              </span>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              color: '#939393',
                              fontFamily: 'Poppins, sans-serif',
                              paddingLeft: '20px'
                            }}>
                              06 Dec, 2025
                            </span>
                          </div>
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '4px'
                            }}>
                              <img
                                src={userIcon}
                                alt="Location"
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  filter: 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                                }}
                              />
                              <span style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                Account Location
                              </span>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              color: '#939393',
                              fontFamily: 'Poppins, sans-serif',
                              paddingLeft: '20px'
                            }}>
                              France
                            </span>
                          </div>
                        </div>
                        {/* Column 2 */}
                        <div>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '4px'
                            }}>
                              <img
                                src={sendIcon}
                                alt="Mail"
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  filter: 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                                }}
                              />
                              <span style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                Mail Address
                              </span>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              color: '#939393',
                              fontFamily: 'Poppins, sans-serif',
                              paddingLeft: '20px'
                            }}>
                              {selectedUserForProfile.email}
                            </span>
                          </div>
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '4px'
                            }}>
                              <img
                                src={userIcon}
                                alt="Connection"
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  filter: 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                                }}
                              />
                              <span style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif'
                              }}>
                                Last Connexion
                              </span>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              color: '#939393',
                              fontFamily: 'Poppins, sans-serif',
                              paddingLeft: '20px'
                            }}>
                              From France
                            </span>
                          </div>
                        </div>
                      </div>
                      )}
                      {/* Divider below Account Information */}
                      <div style={{
                        height: '1px',
                        backgroundColor: '#F1F1F1',
                        marginTop: '12px',
                        marginLeft: '-14px',
                        marginRight: '-14px'
                      }} />
                    </div>

                    {/* Status Section */}
                    <div style={{ marginBottom: '16px' }}>
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                      >
                        <span style={{
                          fontSize: '12px',
                          color: '#6A6A6A',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Status
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isStatusOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      {isStatusOpen && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px'
                      }}>
                        {/* Profile Completed Card */}
                        <div style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '8px',
                          border: '1px solid #F1F1F1'
                        }}>
                          <img
                            src={verityIcon}
                            alt="Verified"
                            style={{ width: '16px', height: '16px', marginBottom: '6px' }}
                          />
                          <div style={{
                            fontSize: '10px',
                            color: '#B0B0B0',
                            fontFamily: 'Poppins, sans-serif',
                            marginBottom: '8px'
                          }}>
                            Profile completed
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '10px',
                              color: '#939393',
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                              20%
                            </span>
                            <div style={{
                              flex: 1,
                              height: '4px',
                              backgroundColor: '#E4E4E4',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: '20%',
                                height: '100%',
                                backgroundColor: '#45C55B',
                                borderRadius: '2px'
                              }} />
                            </div>
                          </div>
                        </div>
                        {/* User Plan Card */}
                        <div style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '8px',
                          border: '1px solid #F1F1F1',
                          position: 'relative'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '6px'
                          }}>
                            <img
                              src={starIcon}
                              alt="Plan"
                              style={{
                                width: '16px',
                                height: '16px'
                              }}
                            />
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '14px',
                              height: '14px',
                              cursor: 'pointer'
                            }}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" stroke="#B0B0B0" strokeWidth="1"/>
                                <circle cx="4" cy="7" r="1" fill="#212121"/>
                                <circle cx="7" cy="7" r="1" fill="#212121"/>
                                <circle cx="10" cy="7" r="1" fill="#212121"/>
                              </svg>
                            </div>
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#212121',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 500,
                            marginBottom: '6px'
                          }}>
                            User plan · Free
                          </div>
                          <p style={{
                            fontSize: '10px',
                            color: '#B0B0B0',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            Post free until 23 March 2026
                          </p>
                        </div>
                      </div>
                      )}
                      {/* Divider below Status */}
                      <div style={{
                        height: '1px',
                        backgroundColor: '#F1F1F1',
                        marginTop: '16px',
                        marginLeft: '-14px',
                        marginRight: '-14px'
                      }} />
                    </div>

                    {/* User Metrics Section */}
                    <div>
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px'
                        }}
                      >
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                          onClick={() => setIsUserMetricsOpen(!isUserMetricsOpen)}
                        >
                          <span style={{
                            fontSize: '12px',
                            color: '#6A6A6A',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            User Metrics
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isUserMetricsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: '#64B5F6',
                          fontFamily: 'Poppins, sans-serif',
                          cursor: 'pointer'
                        }}>
                          See all user metrics
                        </span>
                      </div>
                      {isUserMetricsOpen && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px'
                      }}>
                        {/* Posted Listings Card */}
                        <div style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '1px 6px',
                          border: '1px solid #F1F1F1',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: '0px',
                              marginTop: '2px'
                            }}>
                              <span style={{
                                fontSize: '9px',
                                color: '#B0B0B0',
                                fontFamily: 'Bricolage Grotesque, sans-serif',
                                margin: 0
                              }}>
                                Posted listings
                              </span>
                              <img src={peopleIcon} alt="Listings" style={{ width: '20px', height: '20px' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0px', marginTop: '1px' }}>
                              <p style={{ 
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#212121',
                                margin: 0,
                                fontFamily: 'Bricolage Grotesque, sans-serif'
                              }}>
                                248
                              </p>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '2px',
                                backgroundColor: '#EDFBF0',
                                padding: '1px 3px',
                                borderRadius: '8px'
                              }}>
                                <svg width="7" height="7" viewBox="0 0 24 24" fill="none">
                                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span style={{ color: '#22C55E', fontSize: '7px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+17.89%</span>
                              </div>
                            </div>
                          </div>
                          <p style={{ 
                            color: '#9C9C9C',
                            fontSize: '8px',
                            margin: 0,
                            marginTop: '4px',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            Last month: 94
                          </p>
                        </div>
                        {/* Active Listings Card */}
                        <div style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '1px 6px',
                          border: '1px solid #F1F1F1',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* Fade effect on the right */}
                          <div 
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              bottom: 0,
                              width: '40px',
                              pointerEvents: 'none',
                              zIndex: 1,
                              background: 'linear-gradient(to left, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%)'
                            }}
                          />
                          {/* Navigation button */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            right: '4px',
                            transform: 'translateY(-50%)',
                            zIndex: 2
                          }}>
                            <button 
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: 'transparent',
                                padding: 0
                              }}
                            >
                              <img src={grayArrowIcon} alt="Next" style={{ width: '20px', height: '20px', transform: 'rotate(180deg)' }} />
                            </button>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '0px',
                            marginTop: '2px'
                          }}>
                            <span style={{
                              fontSize: '9px',
                              color: '#B0B0B0',
                              fontFamily: 'Bricolage Grotesque, sans-serif',
                              margin: 0
                            }}>
                              Active listings
                            </span>
                            <img src={peopleIcon} alt="Listings" style={{ width: '20px', height: '20px' }} />
                          </div>
                          <div style={{ marginBottom: '0px', marginTop: '1px' }}>
                            <p style={{ 
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#212121',
                              margin: 0,
                              fontFamily: 'Bricolage Grotesque, sans-serif'
                            }}>
                              217
                            </p>
                          </div>
                          <span style={{
                            fontSize: '8px',
                            color: '#F9A825',
                            fontFamily: 'Poppins, sans-serif',
                            cursor: 'pointer'
                          }}>
                            31 inactive listings &gt;
                          </span>
                        </div>
                      </div>
                      )}
                    </div>
                    </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Normal Users Management View
              <div style={{ paddingRight: '14px' }}>
                {/* Users Management Header */}
                <div style={{ marginTop: '10px', marginBottom: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#202224',
                    margin: '0 0 2px 0',
                    fontFamily: 'Bricolage Grotesque, sans-serif'
                  }}>
                    {usersToggle === 'activities' ? 'User activities' : 'User lists'}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <p style={{
                      color: '#9C9C9C',
                      fontSize: '12px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {usersToggle === 'activities'
                        ? 'Explore the recent actions and events performed by users within the BAO Afrik platform.'
                        : 'Find a directory of registered users. Sort and manage accounts easily.'}
                    </p>

                    {/* Toggle (aligned with description) */}
                    <div style={{
                      backgroundColor: '#F4F4F4',
                      borderRadius: '9px',
                      padding: '3px',
                      display: 'flex',
                      gap: '3px',
                      flexShrink: 0,
                      border: '1px solid #F1F1F1'
                    }}>
                      {[
                        { key: 'activities', label: 'Activities' },
                        { key: 'list', label: 'User lists' }
                      ].map((t) => {
                        const isActive = usersToggle === (t.key as 'activities' | 'list');
                        return (
                          <button
                            key={t.key}
                            onClick={() => setUsersToggle(t.key as 'activities' | 'list')}
                            style={{
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px 10px',
                              borderRadius: '7px',
                              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                              color: isActive ? '#64B5F6' : '#939393',
                              fontSize: '11px',
                              fontFamily: 'Poppins, sans-serif',
                              lineHeight: 1,
                              whiteSpace: 'nowrap',
                              boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.05)' : 'none'
                            }}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Cards (only for Users list) */}
              {usersToggle === 'list' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  {/* Total user account */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '8px',
                    border: '1px solid #F1F1F1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ 
                          color: '#9C9C9C',
                          fontSize: '10px',
                          margin: '0 0 4px 0',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Total user account
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <p style={{ 
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#212121',
                            margin: 0,
                            fontFamily: 'Bricolage Grotesque, sans-serif'
                          }}>
                            569
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            backgroundColor: '#EDFBF0',
                            padding: '1.5px 5px',
                            borderRadius: '10px'
                          }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{ color: '#22C55E', fontSize: '8px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+17.89%</span>
                          </div>
                        </div>
                        {/* last month removed */}
                      </div>
                      <img src={statIcon} alt="Total users" style={{ width: '24px', height: '24px' }} />
                    </div>
                  </div>

                  {/* Active accounts */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '8px',
                    border: '1px solid #F1F1F1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ 
                          color: '#9C9C9C',
                          fontSize: '10px',
                          margin: '0 0 4px 0',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Active accounts
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <p style={{ 
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#212121',
                            margin: 0,
                            fontFamily: 'Bricolage Grotesque, sans-serif'
                          }}>
                            321
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            backgroundColor: '#EDFBF0',
                            padding: '1.5px 5px',
                            borderRadius: '10px'
                          }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{ color: '#22C55E', fontSize: '8px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+17.89%</span>
                          </div>
                        </div>
                        {/* last month removed */}
                      </div>
                      <img src={stat2Icon} alt="Active accounts" style={{ width: '24px', height: '24px' }} />
                    </div>
                  </div>

                  {/* Inactive accounts */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '8px',
                    border: '1px solid #F1F1F1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ 
                          color: '#9C9C9C',
                          fontSize: '10px',
                          margin: '0 0 4px 0',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Inactive accounts
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <p style={{ 
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#212121',
                            margin: 0,
                            fontFamily: 'Bricolage Grotesque, sans-serif'
                          }}>
                            204
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            backgroundColor: '#FFE9E9',
                            padding: '1.5px 5px',
                            borderRadius: '10px'
                          }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                              <path d="M17 7L7 17M7 17H17M7 17V7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{ color: '#EF4444', fontSize: '8px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>-4.23%</span>
                          </div>
                        </div>
                        {/* last month removed */}
                      </div>
                      <img src={peopleIcon} alt="Inactive accounts" style={{ width: '24px', height: '24px' }} />
                    </div>
                  </div>

                  {/* Suspended accounts */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '8px',
                    border: '1px solid #F1F1F1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ 
                          color: '#9C9C9C',
                          fontSize: '10px',
                          margin: '0 0 4px 0',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Suspended accounts
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <p style={{ 
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#212121',
                            margin: 0,
                            fontFamily: 'Bricolage Grotesque, sans-serif'
                          }}>
                            13
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            backgroundColor: '#F4F4F4',
                            padding: '1.5px 5px',
                            borderRadius: '10px'
                          }}>
                            <span style={{ color: '#939393', fontSize: '8px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>0.00%</span>
                          </div>
                        </div>
                        {/* last month removed */}
                      </div>
                      <img src={stat3Icon} alt="Suspended accounts" style={{ width: '24px', height: '24px' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Users Activities Table (same layout; data changes with toggle/tab) */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #F1F1F1',
                padding: '12px 14px'
              }}>
                {/* Top bar 1: tabs + export + sort OR selection controls */}
                {!isSelectionMode ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: usersToggle === 'list' ? '26px' : '18px', flexWrap: 'wrap' }}>
                      {usersToggle === 'activities' ? (
                        [
                          { key: 'all', label: 'All user recent activities' },
                          { key: 'joined', label: 'Joined' },
                          { key: 'posted', label: 'Posted' },
                          { key: 'reviewed', label: 'Reviewed' },
                          { key: 'reported', label: 'Reported' },
                        ].map((tab) => {
                          const isActive = usersActivityTab === (tab.key as any);
                          return (
                            <button
                              key={tab.key}
                              onClick={() => setUsersActivityTab(tab.key as any)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                padding: '0 0 10px 0',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontFamily: 'Poppins, sans-serif',
                                color: isActive ? '#64B5F6' : '#B0B0B0',
                                fontWeight: 400,
                                borderBottom: isActive ? '2px solid #64B5F6' : '2px solid transparent'
                              }}
                            >
                              {tab.label}
                            </button>
                          );
                        })
                      ) : (
                        [
                          { key: 'all', label: 'All users' },
                          { key: 'new', label: 'New users' },
                          { key: 'free', label: 'Free Plan' },
                          { key: 'verified', label: 'Verified' },
                          { key: 'unverified', label: 'Unverified' },
                        ].map((tab) => {
                          const isActive = usersListTab === (tab.key as any);
                          return (
                            <button
                              key={tab.key}
                              onClick={() => setUsersListTab(tab.key as any)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                padding: '0 0 10px 0',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontFamily: 'Poppins, sans-serif',
                                color: isActive ? '#64B5F6' : '#B0B0B0',
                                fontWeight: 400,
                                borderBottom: isActive ? '2px solid #64B5F6' : '2px solid transparent'
                              }}
                            >
                              {tab.label}
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <button
                        type="button"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#64B5F6',
                          fontSize: '11px',
                          fontFamily: 'Poppins, sans-serif',
                          padding: 0,
                          marginRight: usersToggle === 'list' ? '8px' : 0
                        }}
                      >
                        <span style={{ color: '#64B5F6' }}>{usersToggle === 'activities' ? 'Export data' : 'Export users datas'}</span>
                        <img
                          src={exportIcon}
                          alt="Export"
                          style={{
                            width: '14px',
                            height: '14px',
                            filter: 'brightness(0) saturate(100%) invert(67%) sepia(45%) saturate(345%) hue-rotate(168deg) brightness(97%) contrast(93%)'
                          }}
                        />
                      </button>

                      <select
                        value={usersSortBy}
                        onChange={(e) => setUsersSortBy(e.target.value)}
                        style={{
                          padding: '0 18px 0 0',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '11px',
                          color: '#B0B0B0',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B0B0B0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 4px center',
                          backgroundSize: '12px'
                        }}
                      >
                        <option>Sort by</option>
                        <option>Date</option>
                        <option>Activity</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', padding: '8px 0' }}>
                    <span style={{ color: '#64B5F6', fontSize: '11px', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {selectedUserEmails.size} item{selectedUserEmails.size !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={() => {
                        setMoreMenu(null);
                        clearSelectionMode();
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#939393',
                        fontSize: '11px',
                        fontFamily: 'Poppins, sans-serif',
                        padding: 0
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Clear all selections
                    </button>
                    <button
                      type="button"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#939393',
                        fontSize: '11px',
                        fontFamily: 'Poppins, sans-serif',
                        padding: 0
                      }}
                    >
                      <img
                        src={exportIcon}
                        alt="Export"
                        style={{
                          width: '14px',
                          height: '14px',
                          filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)'
                        }}
                      />
                      {usersToggle === 'list' ? 'Export user data' : 'Export item data'}
                    </button>
                    {usersToggle === 'list' ? (
                      <>
                        <button
                          type="button"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#B0B0B0',
                            fontSize: '11px',
                            fontFamily: 'Poppins, sans-serif',
                            padding: 0
                          }}
                        >
                          <img src={suspendIcon} alt="Suspend" style={{ width: '14px', height: '14px', filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%)' }} />
                          Suspend user account
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const emailsToRemove = Array.from(selectedUserEmails);
                            if (emailsToRemove.length === 0) return;
                            setRemovedUserEmails((prev) => {
                              const next = new Set(prev);
                              emailsToRemove.forEach((email) => next.add(email));
                              return next;
                            });
                            setMoreMenu(null);
                            clearSelectionMode();
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: selectedUserEmails.size ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#FF5151',
                            fontSize: '11px',
                            fontFamily: 'Poppins, sans-serif',
                            padding: 0,
                            opacity: selectedUserEmails.size ? 1 : 0.5
                          }}
                        >
                          <img src={trashIcon} alt="Delete" style={{ width: '14px', height: '14px' }} />
                          Delete user account
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const emailsToRemove = Array.from(selectedUserEmails);
                          if (emailsToRemove.length === 0) return;
                          setRemovedUserEmails((prev) => {
                            const next = new Set(prev);
                            emailsToRemove.forEach((email) => next.add(email));
                            return next;
                          });
                          setMoreMenu(null);
                          clearSelectionMode();
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: selectedUserEmails.size ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#FF5151',
                          fontSize: '11px',
                          fontFamily: 'Poppins, sans-serif',
                          padding: 0,
                          opacity: selectedUserEmails.size ? 1 : 0.5
                        }}
                      >
                        <img src={trashIcon} alt="Delete" style={{ width: '14px', height: '14px' }} />
                        Remove from activity list
                      </button>
                    )}
                  </div>
                )}

                <div style={{ height: '1px', backgroundColor: '#F1F1F1', marginTop: '-1px' }} />

                {/* Top bar 2: column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: isSelectionMode ? (usersToggle === 'activities' ? '2.2fr 1.2fr 1.6fr 1fr 0.8fr' : '2.2fr 1.2fr 1fr 1fr 0.8fr') : (usersToggle === 'activities' ? '2.2fr 1.2fr 1.6fr 1fr 0.8fr' : '2.2fr 1.2fr 1fr 1fr 0.8fr'), gap: '10px', padding: '14px 0 12px 0' }}>
                  {(usersToggle === 'activities' ? [
                    { key: 'Users', label: 'Users' },
                    { key: 'Date of creation', label: 'Date of creation' },
                    { key: 'Activity', label: 'Activity' },
                    { key: 'User plan', label: 'User plan' },
                    ...(isSelectionMode ? [] : [{ key: 'Actions', label: 'Actions' }])
                  ] : [
                    { key: 'Users', label: 'Users' },
                    { key: 'Joined', label: 'Joined' },
                    { key: 'User plan', label: 'User plan' },
                    { key: 'User status', label: 'User status' },
                    ...(isSelectionMode ? [] : [{ key: 'Actions', label: 'Actions' }])
                  ]).map((h) => (
                    <div key={h.key} style={{ fontSize: '10px', color: '#939393', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {h.label}
                      {h.key !== 'Actions' && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8l-6-6-6 6" />
                          <path d="M18 16l-6 6-6-6" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ height: '1px', backgroundColor: '#F1F1F1' }} />

                {/* Rows */}
                <div>
                  {pagedUsersRows.map((row, idx) => {
                    const rowKey = `${row.email}-${idx}`;
                    const isRowActive = hoveredUserRowKey === rowKey || selectedUserRowKey === rowKey;

                    return (
                    <div
                      key={rowKey}
                      onMouseEnter={() => setHoveredUserRowKey(rowKey)}
                      onMouseLeave={() => setHoveredUserRowKey(null)}
                      onClick={(e) => {
                        // Don't trigger row selection if clicking on interactive elements
                        const target = e.target as HTMLElement;
                        if (target.closest('.more-options-button') || 
                            target.closest('.checkbox-container') || 
                            isSelectionMode) {
                          return;
                        }
                        setSelectedUserRowKey(rowKey);
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isSelectionMode ? (usersToggle === 'activities' ? '2.2fr 1.2fr 1.6fr 1fr 0.8fr' : '2.2fr 1.2fr 1fr 1fr 0.8fr') : (usersToggle === 'activities' ? '2.2fr 1.2fr 1.6fr 1fr 0.8fr' : '2.2fr 1.2fr 1fr 1fr 0.8fr'),
                        gap: '10px',
                        padding: '14px 8px',
                        borderBottom: idx < pagedUsersRows.length - 1 ? '1px solid #F1F1F1' : 'none',
                        backgroundColor: isRowActive ? '#F6FBFF' : 'transparent',
                        borderRadius: 0
                      }}
                    >
                      {/* Users column */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        {isSelectionMode && (
                          <div
                            className="checkbox-container"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const newSelected = new Set(selectedUserEmails);
                              if (newSelected.has(row.email)) {
                                newSelected.delete(row.email);
                              } else {
                                newSelected.add(row.email);
                              }
                              setSelectedUserEmails(newSelected);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            style={{
                              width: '18px',
                              height: '18px',
                              border: selectedUserEmails.has(row.email) ? '2px solid #64B5F6' : '2px solid #D9D9D9',
                              borderRadius: '4px',
                              backgroundColor: selectedUserEmails.has(row.email) ? '#64B5F6' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          >
                            {selectedUserEmails.has(row.email) && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        )}
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: (row as any).avatarBg || '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src={row.avatar} alt={row.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', color: '#212121', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {row.name}
                            </span>
                            {row.isNewUser && (
                              <span style={{ backgroundColor: '#F0F8FE', color: '#64B5F6', fontSize: '8px', borderRadius: '4px', padding: '2px 6px', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>
                                New user
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '10px', color: '#939393', fontFamily: 'Poppins, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            {row.email}
                          </div>
                        </div>
                      </div>

                      {/* Date/Joined */}
                      <div style={{ fontSize: '10px', color: '#939393', fontFamily: 'Poppins, sans-serif', paddingTop: '6px' }}>{row.date}</div>
                      
                      {/* Activity (only for activities view) */}
                      {usersToggle === 'activities' && (
                        <div style={{ fontSize: '10px', color: '#939393', fontFamily: 'Poppins, sans-serif', paddingTop: '6px' }}>{(row as any).activity}</div>
                      )}

                      {/* User plan */}
                      <div style={{ paddingTop: '4px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontFamily: 'Poppins, sans-serif',
                          ...getPlanBadgeStyle(row.plan)
                        }}>
                          {row.plan}
                        </span>
                      </div>

                      {/* User status (only for list view) */}
                      {usersToggle === 'list' && (
                        <div style={{ paddingTop: '4px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontFamily: 'Poppins, sans-serif',
                            backgroundColor: (row as any).verified ? '#EDFBF0' : '#F4F4F4',
                            color: (row as any).verified ? '#22C55E' : '#939393'
                          }}>
                            <img 
                              src={(row as any).verified ? verifyIcon : unverifyIcon} 
                              alt={(row as any).verified ? 'Verified' : 'Unverified'} 
                              style={{ width: '8px', height: '8px' }} 
                            />
                            {(row as any).verified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      {isSelectionMode ? (
                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '2px' }}>
                          {selectedUserEmails.has(row.email) && (
                            <span style={{ fontSize: '11px', color: '#64B5F6', fontFamily: 'Poppins, sans-serif' }}>Selected</span>
                          )}
                        </div>
                      ) : (
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '2px', position: 'relative' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '24px', height: '24px', border: 'none', borderRadius: '50%', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="more-options-button"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                moreMenuButtonRef.current = e.currentTarget as HTMLButtonElement;
                                setMoreMenu((prev) => (prev?.email === row.email ? null : { email: row.email, anchorRect: rect }));
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: moreMenu?.email === row.email ? '0.3px solid #64B5F6' : '0.3px solid #B0B0B0',
                                backgroundColor: '#FFFFFF',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1001,
                                position: 'relative'
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3" cy="6" r="1.2" fill={moreMenu?.email === row.email ? '#64B5F6' : '#B0B0B0'} />
                                <circle cx="6" cy="6" r="1.2" fill={moreMenu?.email === row.email ? '#64B5F6' : '#B0B0B0'} />
                                <circle cx="9" cy="6" r="1.2" fill={moreMenu?.email === row.email ? '#64B5F6' : '#B0B0B0'} />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>

                {/* Pagination (MyListings style; left controls + right Go to) */}
                <div style={{ height: '1px', backgroundColor: '#F1F1F1', marginTop: '8px' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      aria-label="Previous page"
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#F0F0F0',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      {usersPaginationNumbers.map((page) => (
                        <span
                          key={page}
                          onClick={() => setUsersPage(page)}
                          style={{
                            cursor: 'pointer',
                            fontFamily: 'Bricolage Grotesque, sans-serif',
                            fontSize: '14px',
                            color: page === usersPage ? '#212121' : '#B0B0B0'
                          }}
                        >
                          {page}
                        </span>
                      ))}
                      <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '14px' }}>…</span>
                      <span style={{ color: '#B0B0B0', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '14px' }}>{usersTotalPages}</span>
                    </div>

                    <button
                      aria-label="Next page"
                      onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#F0F0F0',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#939393', fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>Go to :</span>
                    <input
                      type="text"
                      placeholder="e.g 40"
                      value={usersGoTo}
                      onChange={(e) => setUsersGoTo(e.target.value)}
                      style={{
                        border: '1px solid #BABABA',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontSize: '12px',
                        color: '#D9D9D9',
                        width: '64px',
                        textAlign: 'center'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const n = parseInt(usersGoTo, 10);
                        if (!Number.isNaN(n)) setUsersPage(Math.min(usersTotalPages, Math.max(1, n)));
                      }}
                      style={{
                        backgroundColor: '#212121',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontFamily: 'Bricolage Grotesque, sans-serif',
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )
          ) : (
          <div>
            {/* Metrics Cards and Reported Issues Container */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 0.85fr) 1fr',
              gap: '10px',
              marginTop: '0',
              marginBottom: '0',
              alignItems: 'start'
            }}>
              {/* Row for title/description + dropdown + reported issues title */}
              <div style={{ gridColumn: '1 / 3', marginBottom: '0' }}>
                <h1 style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#212121',
                  margin: 0,
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}>
                  Dashboard
                </h1>
                <p style={{ 
                  color: '#9C9C9C',
                  fontSize: '12px',
                  margin: '2px 0 0 0',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Last update: {getLastUpdate()}{' '}
                  <button
                    style={{
                      color: '#64B5F6',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '12px',
                      fontFamily: 'Poppins, sans-serif',
                      padding: 0
                    }}
                  >
                    Refresh
                  </button>
                </p>
              </div>

              {/* Row for dropdown and title above Active Listings and Reported Issues */}
              <div style={{ gridColumn: '3', display: 'flex', justifyContent: 'flex-end', marginBottom: '0', marginTop: '22px' }}>
                <select style={{
                  padding: '6px 10px',
                  paddingRight: '28px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E4',
                  fontSize: '11px',
                  color: '#6A6A6A',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '12px'
                }}>
                  <option>This week</option>
                </select>
              </div>
              <div style={{ gridColumn: '4', marginBottom: '0', marginTop: '6px' }}>
                <h2 style={{ 
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#212121',
                  margin: 0,
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}>
                  Reported Issues
                </h2>
              </div>
              {/* Visitors Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '10px',
                border: '1px solid #F1F1F1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '10px',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Visitors number
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <p style={{ 
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#212121',
                        margin: 0,
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}>
                        569
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        backgroundColor: '#EDFBF0',
                        padding: '2px 6px',
                        borderRadius: '12px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: '#22C55E', fontSize: '9px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+17.89%</span>
                      </div>
                    </div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '8px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Last month: 2094
                    </p>
                  </div>
                  <img src={peopleIcon} alt="Visitors" style={{ width: '24px', height: '24px' }} />
                </div>
              </div>

              {/* Active Users Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '10px',
                border: '1px solid #F1F1F1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '10px',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Active users
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <p style={{ 
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#212121',
                        margin: 0,
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}>
                        201
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        backgroundColor: '#FFE9E9',
                        padding: '2px 6px',
                        borderRadius: '12px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M17 7L7 17M7 17H17M7 17V7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: '#EF4444', fontSize: '9px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>-4.23%</span>
                      </div>
                    </div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '8px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Last month: 2094
                    </p>
                  </div>
                  <img src={activeusersIcon} alt="Active Users" style={{ width: '24px', height: '24px' }} />
                </div>
              </div>

              {/* Active Listings Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '10px',
                border: '1px solid #F1F1F1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '10px',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Active listings
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <p style={{ 
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#212121',
                        margin: 0,
                        fontFamily: 'Bricolage Grotesque, sans-serif'
                      }}>
                        714
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        backgroundColor: '#EDFBF0',
                        padding: '2px 6px',
                        borderRadius: '12px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: '#22C55E', fontSize: '9px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+109</span>
                      </div>
                    </div>
                    <p style={{ 
                      color: '#9C9C9C',
                      fontSize: '8px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Last month: 2094
                    </p>
                  </div>
                  <img src={activelistingsIcon} alt="Active Listings" style={{ width: '24px', height: '24px' }} />
                </div>
              </div>

              {/* Reported Issues - aligned with Active Listings */}
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-24px' }}>
                {/* Reported Issues */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '12px',
                  border: '0.5px solid #F1F1F1',
                  width: '100%',
                  maxWidth: '320px'
                }}>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { name: 'Clara Vanstone', issue: 'Phishing attempt', time: '30 min ago', avatar: avatar, bgColor: '#E3F2FD' },
                      { name: 'Robert OWEN', issue: 'Phishing attempt', time: '2h ago', avatar: avatar, bgColor: '#FFF3E0' },
                      { name: 'Kalhesi Doumbia', issue: 'Phishing attempt', time: 'Yesterday', avatar: avatar, bgColor: '#F3E5F5' }
                    ].map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: item.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }} 
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                            <p style={{ 
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#212121',
                              margin: 0,
                              fontFamily: 'Poppins, sans-serif',
                              flex: 1
                            }}>
                              {item.name}
                            </p>
                            <button style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              flexShrink: 0
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 4" fill="none">
                                <circle cx="4" cy="2" r="2" fill="#9C9C9C" />
                                <circle cx="12" cy="2" r="2" fill="#9C9C9C" />
                                <circle cx="20" cy="2" r="2" fill="#9C9C9C" />
                              </svg>
                            </button>
                          </div>
                          <p style={{ 
                            fontSize: '10px',
                            color: '#9C9C9C',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {item.issue}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <p style={{ 
                              fontSize: '9px',
                              color: '#B0B0B0',
                              margin: 0,
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                              {item.time}
                            </p>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#64B5F6'
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '12px' }}>
                    <button style={{
                      color: '#64B5F6',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      See all reported issues →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Performance Overview (left) + User per country (right) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 0.85fr) 1fr',
              gap: '10px',
              marginTop: '0',
              marginBottom: '12px',
              alignItems: 'start'
            }}>
            {/* Performance Overview - left 3 columns */}
            <div style={{ 
              gridColumn: '1 / 4',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '16px',
              border: '1px solid #F1F1F1',
              width: '100%',
              marginTop: '-100px'
            }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '4px',
                  marginTop: '0'
                }}>
                  <h2 style={{ 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#212121',
                    margin: 0,
                    fontFamily: 'Bricolage Grotesque, sans-serif'
                  }}>
                    Performance Overview
                  </h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select style={{
                      padding: '6px 10px',
                      paddingRight: '28px',
                      borderRadius: '8px',
                      border: '1px solid #E4E4E4',
                      fontSize: '11px',
                      color: '#6A6A6A',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '12px'
                    }}>
                      <option>Listings</option>
                    </select>
                    <select style={{
                      padding: '6px 10px',
                      paddingRight: '28px',
                      borderRadius: '8px',
                      border: '1px solid #E4E4E4',
                      fontSize: '11px',
                      color: '#6A6A6A',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '12px'
                    }}>
                      <option>Month</option>
                    </select>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#9C9C9C' 
                    }} />
                    <span style={{ fontSize: '9px', color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' }}>Past weeks</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#F9A825' 
                    }} />
                    <span style={{ fontSize: '9px', color: '#9C9C9C', fontFamily: 'Poppins, sans-serif' }}>Current Week</span>
                  </div>
                </div>

                {/* Chart */}
                <div
                  style={{
                    position: 'relative',
                    height: '280px',
                    padding: '14px 14px 10px 14px',
                    backgroundColor: 'transparent',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', height: '100%' }}>
                    {/* Y-axis */}
                    <div
                      style={{
                        width: '34px',
                        flexShrink: 0,
                        height: '100%',
                        position: 'relative'
                      }}
                    >
                      {['40k', '30k', '20k', '10k', '0k'].map((v, idx) => {
                        // Align with grid lines: 0%, 25%, 50%, 75%, 100%
                        const positions = [0, 0.25, 0.5, 0.75, 1];
                        // Calculate position accounting for line height (1px) - center the text on the line
                        // Same approach for all labels: position + 0.5px offset, then translateY(-50%) to center
                        // Adjust 30k (idx 1), 20k (idx 2), 10k (idx 3), and 0k (idx 4) to move them up
                        const offset =
                          idx === 1 ? '-8px' :
                          idx === 2 ? '-16px' :
                          idx === 3 ? '-24px' :
                          idx === 4 ? '-34px' :
                          '0.5px';
                        return (
                          <div
                            key={v}
                            style={{
                              position: 'absolute',
                              top: `calc(${positions[idx] * 100}% + ${offset})`,
                              transform: 'translateY(-50%)',
                  display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif',
                                lineHeight: 1
                              }}
                            >
                              {v}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bars + X axis */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Plot area (grid + axes + bars) */}
                      <div
                        style={{
                          flex: 1,
                          position: 'relative',
                          paddingLeft: '6px',
                          paddingRight: '6px',
                          paddingBottom: '10px'
                        }}
                      >
                        {/* Grid lines (aligned with Y-axis numbers) */}
                        {[0, 1, 2, 3, 4].map((i) => {
                          // Align with Y-axis labels: 0%, 25%, 50%, 75%, 100%
                          const positions = [0, 0.25, 0.5, 0.75, 1];
                          return (
                            <div
                              key={i}
                              style={{
                                position: 'absolute',
                                left: '0',
                                right: '0',
                                top: `${positions[i] * 100}%`,
                                height: '1px',
                                backgroundImage:
                                  'repeating-linear-gradient(to right, #D9D9D9 0 6px, transparent 6px 18px)',
                                opacity: 1,
                                pointerEvents: 'none',
                                transform: 'translateY(-0.5px)'
                              }}
                            />
                          );
                        })}

                        {/* Bars */}
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: '1px',
                            display: 'flex',
                            alignItems: 'stretch',
                            justifyContent: 'space-between',
                            gap: '16px',
                            paddingLeft: '16px',
                            paddingRight: '6px',
                            paddingBottom: '0px'
                          }}
                        >
                  {[
                            { month: 'Mar', trackH: 28, fillH: 55 },
                            { month: 'Apr', trackH: 46, fillH: 35 },
                            { month: 'May', trackH: 100, fillH: 30 },
                            { month: 'Jun', trackH: 70, fillH: 30 },
                            { month: 'Jul', trackH: 80, fillH: 20 },
                            { month: 'Aug', trackH: 80, fillH: 14 },
                            { month: 'Sep', trackH: 50, fillH: 30 },
                            { month: 'Oct', trackH: 76, fillH: 36 },
                            { month: 'Nov', trackH: 58, fillH: 26 },
                            { month: 'Dec', trackH: 90, fillH: 56, isCurrent: true }
                          ].map((item) => {
                            const trackWidth = 'clamp(34px, 4.2vw, 48px)';
                            const trackRadius = '12px';
                            const fillRadius = '10px';

                            return (
                              <div
                                key={item.month}
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  minWidth: 0,
                                  height: '100%',
                                  alignItems: 'flex-end'
                                }}
                              >
                                <div
                                  style={{
                                    width: trackWidth,
                                    height: `${item.trackH}%`,
                                    backgroundColor: '#FAFAFA',
                                    borderRadius: trackRadius,
                                    position: 'relative',
                                    overflow: 'visible',
                                    border: '1px solid rgba(0,0,0,0.04)'
                                  }}
                                >
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '2px',
                                      right: '2px',
                                      bottom: '2px',
                                      height: `${item.fillH}%`,
                                      backgroundColor: item.isCurrent ? 'transparent' : '#E4E4E4',
                                      backgroundImage: item.isCurrent
                                        ? 'linear-gradient(0deg, rgba(249, 168, 37, 0.20) 0%, rgba(249, 168, 37, 0.80) 100%)'
                                        : undefined,
                                      borderRadius: fillRadius,
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {/* zebra stripes for current week */}
                        {item.isCurrent && (
                                      <div
                                        style={{
                            position: 'absolute',
                                          inset: 0,
                                          backgroundImage:
                                            'repeating-linear-gradient(135deg, rgba(249, 168, 37, 0.15) 0px, rgba(249, 168, 37, 0.15) 6px, rgba(255, 255, 255, 0) 6px, rgba(255, 255, 255, 0) 12px)'
                                        }}
                                      />
                                    )}
                                  </div>
                                  
                                  {/* blue dot marker - at top of fill bar */}
                                  {item.isCurrent && (
                                    <div
                                      style={{
                                        position: 'absolute',
                                        bottom: `calc(${item.fillH}% + 2px)`,
                            left: '50%',
                                        transform: 'translate(-50%, 50%)',
                                        width: '12px',
                                        height: '12px',
                            borderRadius: '50%',
                                        backgroundColor: '#64B5F6',
                                        boxShadow: '0 0 0 1px #FFFFFF',
                                        zIndex: 10
                                      }}
                                    />
                        )}
                      </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          paddingLeft: '6px',
                          paddingRight: '6px',
                          paddingTop: '16px'
                        }}
                      >
                        {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                          <div
                            key={m}
                            style={{
                              flex: 1,
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#B0B0B0',
                                fontFamily: 'Poppins, sans-serif'
                              }}
                            >
                              {m}
                            </span>
                    </div>
                  ))}
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* User per country - right column (independent of Performance Overview height) */}
            <div style={{ gridColumn: '4', display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '10px',
                  border: '0.5px solid #F1F1F1',
                  width: '100%',
                  maxWidth: '320px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0px'
                  }}>
                    <h2 style={{ 
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#212121',
                      margin: 0,
                      fontFamily: 'Bricolage Grotesque, sans-serif'
                    }}>
                      User per country
                    </h2>
                    <select style={{
                      padding: '6px 10px',
                      paddingRight: '28px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '11px',
                      color: '#B0B0B0',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '12px'
                    }}>
                      <option>This week</option>
                    </select>
                  </div>

                  {/* Progress Chart */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginTop: '-74px',
                    marginBottom: '8px'
                  }}>
                    <MustUsersArc 
                      percentage={67.56}
                      users={104}
                      width={200}
                    />
                  </div>

                  {/* Country Breakdown Section */}
                  <div style={{
                    padding: '4px 10px',
                    backgroundColor: '#FAFAFA',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ flex: 1 }}>
                      {/* Less users at top left */}
                      <p style={{ 
                        fontSize: '9px',
                        color: '#6A6A6A',
                        margin: '0 0 4px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        Less users: 2.89%
                      </p>
                      
                      {/* France text */}
                      <p style={{ 
                        fontSize: '10px',
                        color: '#939393',
                        margin: '0 0 3px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        France
                      </p>
                      
                      {/* Users count and badge - badge directly to the right in one line */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'nowrap' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          color: '#202224', 
                          fontWeight: 500, 
                          fontFamily: 'Bricolage Grotesque, sans-serif',
                          whiteSpace: 'nowrap'
                        }}>
                          67 Users
                        </span>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '3px',
                          backgroundColor: '#EDFBF0',
                          padding: '2px 5px',
                          borderRadius: '10px'
                        }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ color: '#22C55E', fontSize: '8px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>+17.89%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Globe visualization - reduced size to fit appropriately */}
                    <div 
                      ref={globeRef}
                      style={{
                        width: '160px',
                        height: '65px',
                        position: 'relative',
                        flexShrink: 0,
                        marginLeft: 'auto'
                      }}
                    >
                      <img 
                        src={visualIcon} 
                        alt="Globe" 
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities - Full width to align with cards above */}
            <div style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 0.85fr) 1fr',
              gap: '10px',
              marginTop: '12px',
              marginBottom: '0',
              alignItems: 'start'
            }}>
              <div style={{
                gridColumn: '1 / 5',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
                padding: '10px 6px 10px 12px',
              border: '1px solid #F1F1F1',
                boxSizing: 'border-box',
                width: 'calc(100% - 20px)',
                maxWidth: 'calc(100% - 20px)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h2 style={{ 
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#212121',
                  margin: 0,
                  fontFamily: 'Bricolage Grotesque, sans-serif'
                }}>
                  Recents activities
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select style={{
                    padding: '4px 10px',
                    paddingRight: '28px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    fontSize: '11px',
                    color: '#6A6A6A',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '12px'
                  }}>
                    <option>All</option>
                  </select>
                  <select style={{
                    padding: '4px 10px',
                    paddingRight: '28px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    fontSize: '11px',
                    color: '#6A6A6A',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23939393' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '12px'
                  }}>
                    <option>Sort by</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F1F1F1' }}>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Users
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8l-6-6-6 6" />
                            <path d="M18 16l-6 6-6-6" />
                          </svg>
                        </div>
                      </th>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Date of creation
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8l-6-6-6 6" />
                            <path d="M18 16l-6 6-6-6" />
                          </svg>
                        </div>
                      </th>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Activity
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8l-6-6-6 6" />
                            <path d="M18 16l-6 6-6-6" />
                          </svg>
                        </div>
                      </th>
                      <th style={{ 
                        padding: '5px 8px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#939393',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Clara Vanstone', email: 'mailaddresses@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Joined BAO Afrik', isNewUser: true, avatar: avatar },
                      { name: 'Clara Vanstone', email: 'mailaddresses@gmail.com', date: 'Mon, 21 Dec 2024', activity: 'Post new listing', isNewUser: false, avatar: avatar }
                    ].map((item, index) => (
                      <tr key={index} style={{ borderBottom: index < 1 ? '1px solid #F1F1F1' : 'none' }}>
                        {/* Users Column */}
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            {/* Square Profile Image */}
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              backgroundColor: '#E3F2FD',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <img 
                                src={item.avatar} 
                                alt={item.name} 
                                style={{ 
                                  width: '26px', 
                                  height: '26px', 
                                  borderRadius: '4px',
                                  objectFit: 'cover'
                                }} 
                              />
                            </div>
                            {/* User Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <p style={{ 
                                  fontSize: '10px',
                            color: '#212121',
                                  margin: 0,
                            fontWeight: 500,
                                  fontFamily: 'Bricolage Grotesque, sans-serif'
                          }}>
                            {item.name}
                          </p>
                                {item.isNewUser && (
                                  <span style={{
                                    backgroundColor: '#F0F8FE',
                                    color: '#64B5F6',
                                    fontSize: '8px',
                                    fontWeight: 500,
                                    padding: '2px 5px',
                                    borderRadius: '4px',
                                    fontFamily: 'Poppins, sans-serif',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    New user
                                  </span>
                                )}
                              </div>
                          <p style={{ 
                                fontSize: '9px',
                                color: '#939393',
                                margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {item.email}
                          </p>
                            </div>
                          </div>
                        </td>
                        {/* Date of creation Column */}
                        <td style={{ padding: '8px' }}>
                          <p style={{ 
                            fontSize: '10px',
                            color: '#939393',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {item.date}
                          </p>
                        </td>
                        {/* Activity Column */}
                        <td style={{ padding: '8px' }}>
                            <p style={{ 
                              fontSize: '10px',
                            color: '#939393',
                              margin: 0,
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                            {item.activity}
                            </p>
                        </td>
                        {/* Actions Column */}
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {/* Eye Icon Button */}
                            <button
                              style={{
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            {/* More Options Button */}
                            <button
                              type="button"
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: '0.3px solid #B0B0B0',
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3" cy="6" r="1.2" fill="#B0B0B0" />
                                <circle cx="6" cy="6" r="1.2" fill="#B0B0B0" />
                                <circle cx="9" cy="6" r="1.2" fill="#B0B0B0" />
                                </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
