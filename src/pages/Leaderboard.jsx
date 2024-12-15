import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trophy,
  Medal,
  Star,
  ChevronUp,
  ChevronDown,
  UserCircle2,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const LeaderboardItem = ({
  username,
  userId,
  rank,
  points,
  badges,
  level,
  email,
}) => {
  const { t } = useLanguage();
  const [showBadgeDetails, setShowBadgeDetails] = useState(false);

  const getBadgeIcon = (badge) => {
    const badgeIcons = {
      "Rookie Uploader": <Star className="w-4 h-4 text-blue-500" />,
      "Resource Master": <Medal className="w-4 h-4 text-yellow-500" />,
      "Knowledge Sharer": <Trophy className="w-4 h-4 text-green-500" />,
      "Helpful Reviewer": <Star className="w-4 h-4 text-purple-500" />,
    };
    return badgeIcons[badge] || null;
  };

  const renderBadgeTooltip = (badge) => {
    const badgeDescriptions = {
      "Rookie Uploader": t("leaderboard.badgeDescriptions.Rookie Uploader"),
      "Resource Master": t("leaderboard.badgeDescriptions.Resource Master"),
      "Knowledge Sharer": t("leaderboard.badgeDescriptions.Knowledge Sharer"),
      "Helpful Reviewer": t("leaderboard.badgeDescriptions.Helpful Reviewer"),
    };
    return badgeDescriptions[badge] || badge;
  };

  const badgeProgressionInfo = {
    "Rookie Uploader": {
      threshold: 5,
      icon: <Star className="w-4 h-4 text-blue-500" />,
    },
    "Resource Master": {
      threshold: 20,
      icon: <Medal className="w-4 h-4 text-yellow-500" />,
    },
    "Knowledge Sharer": {
      threshold: 10,
      icon: <Trophy className="w-4 h-4 text-green-500" />,
    },
    "Helpful Reviewer": {
      threshold: 5,
      icon: <Star className="w-4 h-4 text-purple-500" />,
    },
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-3 hover:shadow-lg transition-all duration-300 group relative">
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <span className="font-bold text-gray-600 dark:text-gray-300 w-8 text-center hidden sm:block">
          {t("leaderboard.columns.rank")} {rank}
        </span>
        <div className="flex-grow text-center sm:text-left flex items-center space-x-3">
          <Link
            to={`/profile/${userId}`}
            className="flex items-center space-x-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <UserCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {username}
            </h3>
          </Link>
          <div
            className="flex space-x-1 cursor-pointer"
            onClick={() => setShowBadgeDetails(!showBadgeDetails)}
          >
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center tooltip"
                title={renderBadgeTooltip(badge)}
              >
                {getBadgeIcon(badge)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right flex items-center space-x-2">
          <div className="flex items-center">
            <span>
              {t("leaderboard.columns.level")} {level}
            </span>
            <Info
              className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500"
              title={t("leaderboard.tooltips.levelTooltip", { level })}
            />
          </div>
          <span>•</span>
          <span>
            {points} {t("leaderboard.columns.points")}
          </span>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {email}
          </div>
        </div>
        {rank <= 3 && (
          <div className="hidden sm:block">
            {rank === 1 && <Trophy className="w-6 h-6 text-yellow-500" />}
            {rank === 2 && (
              <Medal className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            )}
            {rank === 3 && (
              <Medal className="w-5 h-5 text-yellow-700 dark:text-yellow-600" />
            )}
          </div>
        )}
      </div>

      {showBadgeDetails && (
        <div className="absolute z-10 top-full left-0 mt-2 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg p-4">
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {t("leaderboard.tooltips.badgeProgress")}
          </h4>
          {Object.entries(badgeProgressionInfo).map(([badge, info]) => (
            <div key={badge} className="flex items-center justify-between mb-2">
              {info.icon}
              <span className="ml-2 flex-grow text-gray-800 dark:text-gray-200">
                {t(`leaderboard.badges.${badge}`)}
              </span>
              <div className="w-1/3 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min((points / info.threshold) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("points");
  const [timeFilter, setTimeFilter] = useState("all");
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "https://notes-app-ibkq.onrender.com/api/contributions/leaderboard",
          {
            params: { timeFilter },
          }
        );
        setLeaderboard(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "points" ? "level" : "points"));
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    return sortOrder === "points"
      ? b.totalPoints - a.totalPoints
      : b.level - a.level;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8" />
            <span>{t("leaderboard.title")}</span>
          </h1>
        </div>

        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={toggleSortOrder}
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{t(`leaderboard.sortBy.${sortOrder}`)}</span>
                {sortOrder === "points" ? <ChevronUp /> : <ChevronDown />}
              </button>

              <div className="flex space-x-2 ml-4">
                {["all", "weekly", "monthly"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      timeFilter === filter
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {t(`leaderboard.filters.${filter}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {sortedLeaderboard.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t("leaderboard.noResults")}
            </p>
          ) : (
            sortedLeaderboard.map((user, index) => (
              <LeaderboardItem key={user._id} rank={index + 1} {...user} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
