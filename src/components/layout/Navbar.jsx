import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, LogOut, Languages, Trophy, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">StudyShare</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Language Toggle Button */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-300 ease-in-out"
              aria-label="Toggle Language"
            >
              <Languages className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'عربي' : 'English'}
              </span>
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t('dashboard.contributionStats')}</span>
                </Link>

                <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <Trophy className="h-4 w-4" />
                  <span>{t('leaderboard.title')}</span>
                </Link>
                
                <Link 
                  to="/upload" 
                  className="btn-primary flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {t('resources.upload.uploadButton')}
                </Link>
                
                <button 
                  onClick={logout} 
                  className="flex items-center space-x-1 text-red-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('auth.logout.title')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-800"
                >
                  {t('auth.login.loginButton')}
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  {t('auth.signup.signupButton')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}