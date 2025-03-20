import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context Providers
import { AuthProvider } from './Context/AuthContext.jsx';

// Layout Components
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import PrivateRoute from './components/Protectrouter/Protector.jsx';

// Auth Pages
import Login from './components/auth/Login/Login.jsx';
import Register from './components/auth/Register/Register.jsx';
import ForgotPassword from './components/auth/ForgotPassword/ForgotPassword.jsx';

// Main Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import MealsPage from './pages/MealsPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container flex flex-col min-h-screen">
          <Navbar />
          <main className="main-content flex-grow mt-0 relative">
            <Routes>
              {/* Public Routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Private Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/workouts/*" 
                element={
                  <PrivateRoute>
                    <WorkoutsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/meals/*" 
                element={
                  <PrivateRoute>
                    <MealsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/progress/*" 
                element={
                  <PrivateRoute>
                    <ProgressPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;