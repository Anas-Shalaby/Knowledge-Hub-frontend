import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Trophy,
  UserCircle,
  Languages,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: t("navbar.home"),
      path: "/",
      id: 1,
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: t("navbar.resources"),
      path: "/upload",
      id: 2,
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: t("navbar.leaderboard"),
      path: "/leaderboard",
      id: 3,
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200 hidden sm:inline">
            {t("navbar.appName")}
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                <UserCircle className="w-5 h-5" />
                <span className="truncate max-w-[100px]">{user.username}</span>
              </Link>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-300 ease-in-out"
                aria-label="Toggle Language"
              >
                <Languages className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language === "en" ? "عربي" : "English"}
                </span>
              </button>
              <button
                onClick={logout}
                className="bg-red-500 dark:bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-600 dark:hover:bg-red-800 transition-colors text-sm"
              >
                {t("navbar.logout")}
              </button>
            </div>
          ) : (
            <div className="space-x-3">
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-500 text-sm"
              >
                {t("navbar.login")}
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 dark:bg-indigo-700 text-white px-3 py-1 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 text-sm"
              >
                {t("navbar.signup")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-gray-800 z-40 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={toggleMenu}
                className="text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-300 ease-in-out"
              aria-label="Toggle Language"
            >
              <Languages className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === "en" ? "عربي" : "English"}
              </span>
            </button>
            {/* Navigation Items */}
            <div className="space-y-6">
              {navItems.map((item) => (
                <>
                  <Link
                    key={item.id}
                    to={item.path}
                    className="block py-3 text-2xl text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 border-b"
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </>
              ))}
            </div>

            {/* User Actions */}
            <div className="mt-8">
              {user ? (
                <div className="space-y-4">
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center space-x-4 text-xl text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                    onClick={toggleMenu}
                  >
                    <UserCircle className="w-7 h-7" />
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="w-full bg-red-500 dark:bg-red-700 text-white px-4 py-3 rounded-md hover:bg-red-600 dark:hover:bg-red-800 text-lg"
                  >
                    {t("navbar.logout")}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="block text-xl text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-500 py-3 border-b"
                    onClick={toggleMenu}
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-3 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 text-lg text-center"
                    onClick={toggleMenu}
                  >
                    {t("navbar.signup")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
