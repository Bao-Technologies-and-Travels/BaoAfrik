import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationToastProvider } from './contexts/NotificationToastContext';
import { ContactSupportProvider } from './contexts/ContactSupportContext';
import ContactSupportModal from './components/ContactSupportModal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmailVerification from './pages/auth/EmailVerification';
import EmailVerificationSuccess from './pages/auth/EmailVerificationSuccess';
import SocialLoginValidation from './pages/auth/SocialLoginValidation';
import SocialLoginError from './pages/auth/SocialLoginError';
import ProfileSetup from './pages/auth/ProfileSetup';
import UserPreferences from './pages/auth/UserPreferences';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPasswordSent from './pages/auth/ResetPasswordSent';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess';
import TwoFactorEmail from './pages/auth/TwoFactorEmail';
import TwoFactorPhone from './pages/auth/TwoFactorPhone';
import TwoFactorCode from './pages/auth/TwoFactorCode';
import TwoFactorSuccess from './pages/auth/TwoFactorSuccess';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import SellerProfile from './pages/SellerProfile';
import UserAccount from './pages/UserAccount';
import Messages from './pages/Messages';
import Listings from './pages/Listings';
import CreateListing from './pages/CreateListing';
import Notifications from './pages/Notifications';
import NotificationDetail from './pages/NotificationDetail';
import ArchivedChats from './pages/ArchivedChats';
import ProfileSettings from './pages/ProfileSettings';
import MyListings from './pages/MyListings';
import MyRequests from './pages/MyRequests';
import Requests from './pages/Requests';
import ImageSearch from './pages/ImageSearch';
import AdminDashboard from './pages/admin/AdminDashboard';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import CommunityGuidelines from './pages/CommunityGuidelines';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isSellerProfilePage = location.pathname.startsWith('/seller/');
  const isUserAccountPage = location.pathname === '/account';
  const authPages = ['/login', '/register', '/verify-email', '/email-verification-success', '/social-login-validation', '/social-login-error', '/profile-setup', '/user-preferences', '/forgot-password', '/reset-password-sent', '/reset-password', '/password-reset-success', '/two-factor-email', '/two-factor-phone', '/two-factor-code', '/two-factor-success'];
const customLayoutPages = ['/messages', '/create-listing', '/notifications', '/notification-detail', '/archived-chats', '/settings', '/my-listings', '/my-requests', '/image-search', '/admin'];
  const isAuthPage = authPages.includes(location.pathname);
  const isCustomLayoutPage = customLayoutPages.includes(location.pathname);

  // For auth pages, render without header/footer
  if (isAuthPage) {
    return (
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
          <Route path="/social-login-validation" element={<SocialLoginValidation />} />
          <Route path="/social-login-error" element={<SocialLoginError />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/user-preferences" element={<UserPreferences />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password-sent" element={<ResetPasswordSent />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
          <Route path="/two-factor-email" element={<TwoFactorEmail />} />
          <Route path="/two-factor-phone" element={<TwoFactorPhone />} />
          <Route path="/two-factor-code" element={<TwoFactorCode />} />
          <Route path="/two-factor-success" element={<TwoFactorSuccess />} />
        </Routes>
      </div>
    );
  }

  // For custom layout pages (like Messages), render without global header/footer
  if (isCustomLayoutPage) {
    return (
      <div className="min-h-screen">
        <Routes>
          <Route path="/messages" element={<Messages />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notification-detail" element={<NotificationDetail />} />
          <Route path="/archived-chats" element={<ArchivedChats />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/image-search" element={<ImageSearch />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    );
  }

  // For seller profile pages, render without header (Header is now in SellerProfile component)
  if (isSellerProfilePage) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1">
          <Routes>
            <Route path="/seller/:sellerId" element={<SellerProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  // For user account page, render without header (Header is now in UserAccount component)
  if (isUserAccountPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1">
          <Routes>
            <Route path="/account" element={<UserAccount />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  // For all other pages, render with header/footer
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="hidden lg:block">
        <Header />
      </div>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationToastProvider>
        <ContactSupportProvider>
          <Router>
            <AppContent />
          </Router>
          <ContactSupportModal />
        </ContactSupportProvider>
      </NotificationToastProvider>
    </AuthProvider>
  );
}

export default App;
