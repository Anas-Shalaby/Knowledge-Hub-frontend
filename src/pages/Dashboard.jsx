import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  FileText, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Trophy, 
  Upload,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon, title, value, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-xl p-5 transform transition-all hover:scale-105 hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const ResourceList = ({ title, resources, emptyMessage, icon, linkPath, linkText }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        {linkPath && (
          <Link 
            to={linkPath} 
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            {linkText}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      {resources.length === 0 ? (
        <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {resources.map((resource) => (
            <li 
              key={resource._id} 
              className="border-b pb-3 last:border-b-0 hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors"
            >
              <Link 
                to={`/resources/${resource._id}`} 
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{resource.title}</p>
                  <p className="text-sm text-gray-500">{resource.subject}</p>
                </div>
                <ChevronRight className="text-gray-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://notes-app-ibkq.onrender.com/api/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        // Validate response data
        if (!response.data) {
          throw new Error('No dashboard data received');
        }

        // Ensure all expected fields exist with default values
        const processedData = {
          uploadedResources: response.data.uploadedResources || [],
          recommendedResources: response.data.recommendedResources || [],
          contributionStats: {
            resourcesUploaded: response.data.contributionStats?.resourcesUploaded || 0,
            averageRating: response.data.contributionStats?.averageRating ?? 0,
            leaderboardRank: response.data.contributionStats?.leaderboardRank || 'N/A'
          },
          recentActivity: response.data.recentActivity || []
        };

        setDashboardData(processedData);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        toast.error(t('common.error'));
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchDashboardData();
    }
  }, [user, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
          <strong className="font-bold">{t('common.error')}</strong>
          <span className="block sm:inline">{t('dashboard.dataLoadError')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Upload className="h-6 w-6 text-green-500" />}
          title={t('dashboard.resourcesUploaded')}
          value={dashboardData.contributionStats.resourcesUploaded}
          className="bg-green-50"
        />
        <StatCard 
          icon={<Star className="h-6 w-6 text-yellow-500" />}
          title={t('dashboard.averageRating')}
          value={typeof dashboardData.contributionStats.averageRating === 'number' 
            ? dashboardData.contributionStats.averageRating.toFixed(1) 
            : 'N/A'}
          className="bg-yellow-50"
        />
        <StatCard 
          icon={<Trophy className="h-6 w-6 text-purple-500" />}
          title={t('dashboard.leaderboardRank')}
          value={dashboardData.contributionStats.leaderboardRank}
          className="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResourceList 
          title={t('dashboard.uploadedResources')}
          resources={dashboardData.uploadedResources}
          emptyMessage={t('dashboard.noUploadedResources')}
          icon={<FileText className="text-purple-600 h-6 w-6" />}
          linkPath="/upload"
          linkText={t('resources.upload.uploadButton')}
        />
        <ResourceList 
          title={t('dashboard.recommendedResources')}
          resources={dashboardData.recommendedResources}
          emptyMessage={t('dashboard.noRecommendedResources')}
          icon={<Star className="text-yellow-600 h-6 w-6" />}
        />
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="text-indigo-600 h-6 w-6" />
          <h2 className="text-xl font-semibold text-gray-800">{t('dashboard.recentActivity')}</h2>
        </div>
        {dashboardData.recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-4">{t('dashboard.noRecentActivity')}</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {dashboardData.recentActivity.map((activity, index) => (
              <li key={index} className="py-4 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'upload' && 
                        `${t('dashboard.uploadedResource')} ${activity.title}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
