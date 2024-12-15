import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trophy,
  Medal,
  Star,
  BookOpen,
  Upload,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const BadgeCard = ({ badge, progress, description, icon }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-all">
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="ml-3 font-semibold text-gray-800 dark:text-gray-200">
          {badge}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {description}
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {t("profile.progressLabel")}
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
};

const ResourceCard = ({ resource, isOwn }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-start space-x-4 hover:shadow-lg transition-all">
      <div className="flex-shrink-0">
        <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {resource.description}
        </p>
        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {t("profile.uploadDate")}:{" "}
            {new Date(resource.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center space-x-1 text-sm">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-gray-800 dark:text-gray-200">
            {resource.rating || "N/A"}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t("profile.downloads")}: {resource.downloadCount || 0}
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("resources");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://notes-app-ibkq.onrender.com/api/profile/${userId}`
        );
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 py-12 bg-white dark:bg-gray-900 min-h-screen">
        {t("common.error")}: {error}
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  const badgeIcons = {
    "Rookie Uploader": <Upload className="w-6 h-6 text-blue-500" />,
    "Resource Master": <Medal className="w-6 h-6 text-yellow-500" />,
    "Knowledge Sharer": <Trophy className="w-6 h-6 text-green-500" />,
    "Helpful Reviewer": <Star className="w-6 h-6 text-purple-500" />,
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex items-center space-x-6">
            <UserIcon className="w-16 h-16 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profile.user.username}
              </h1>
              <p className="text-indigo-100">{profile.user.email}</p>
              <div className="mt-2 flex items-center space-x-4 text-white">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span>
                    {t("profile.level")} {profile.user.level}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span>
                    {profile.user.totalPoints} {t("profile.points")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700">
          {["resources", "badges", "contributions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center font-semibold transition-colors 
                ${
                  activeTab === tab
                    ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {t(`profile.tabs.${tab}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 dark:bg-gray-900">
          {activeTab === "resources" && (
            <div className="space-y-4">
              {profile.resources.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  {t("profile.noResources")}
                </p>
              ) : (
                profile.resources.map((resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    isOwn={isOwnProfile}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "badges" && (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(profile.badgeProgression).map(
                ([badge, details]) => (
                  <BadgeCard
                    key={badge}
                    badge={badge}
                    progress={details.current / details.threshold}
                    description={details.description}
                    icon={badgeIcons[badge]}
                  />
                )
              )}
            </div>
          )}

          {activeTab === "contributions" && (
            <div className="space-y-4">
              {profile.contributions.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  {t("profile.noContributions")}
                </p>
              ) : (
                profile.contributions.map((contribution) => (
                  <div
                    key={contribution._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      {contribution.type === "upload" && (
                        <Upload className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                      )}
                      {contribution.type === "review" && (
                        <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {contribution.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contribution.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(contribution.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
