import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmailVerification from './pages/auth/EmailVerification';
import Profile from './pages/Profile';
import Listings from './pages/Listings';
import CreateListing from './pages/CreateListing';
import Messages from './pages/Messages';
import ProductDetail from './pages/ProductDetail';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isProductDetailPage = location.pathname.startsWith('/product/');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showSearchBar={isProductDetailPage} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
