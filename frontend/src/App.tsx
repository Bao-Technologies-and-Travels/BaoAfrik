import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationToastProvider } from './contexts/NotificationToastContext';
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
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import SellerProfile from './pages/SellerProfile';
import UserAccount from './pages/UserAccount';
import Messages from './pages/Messages';
import Listings from './pages/Listings';
import MyListings from './pages/MyListings';
import CreateListing from './pages/CreateListing';
import Notifications from './pages/Notifications';
import NotificationDetail from './pages/NotificationDetail';
import ArchivedChats from './pages/ArchivedChats';
import './App.css';
import { ToastProvider } from './contexts/ToastContext';

function AppContent() {
  const location = useLocation();
  const isProductDetailPage = location.pathname.startsWith('/product/');
  const isSellerProfilePage = location.pathname.startsWith('/seller/');
  const isUserAccountPage = location.pathname === '/account';
  const authPages = ['/login', '/register', '/verify-email', '/email-verification-success', '/social-login-validation', '/social-login-error', '/profile-setup', '/user-preferences', '/forgot-password', '/reset-password-sent', '/reset-password', '/password-reset-success'];
  const isAuthPage = authPages.includes(location.pathname);
  const customLayoutPages = ['/messages', '/create-listing', '/notifications', '/notification-detail', '/archived-chats'];
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
        </Routes>
      </div>
    );
  }

  // For seller profile pages on mobile, render without header
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
      <Header showSearchBar={isProductDetailPage} isProductDetailPage={isProductDetailPage} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/edit-listing/:id" element={<CreateListing />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </Router>
        </NotificationToastProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
