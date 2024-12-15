import { Star, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ResourceCard({ resource }) {
  const {user} = useAuth();

  // Validate resource prop with more detailed error handling
  if (!resource || typeof resource !== 'object') {
    console.error('Invalid resource prop:', resource);
    return null;
  }

  // Destructure with default values to prevent undefined errors
  const {
    _id = '',
    title = 'Untitled Resource',
    subject = 'Uncategorized',
    topic = 'General',
    rating = 0,
    numReviews = 0,
    user: resourceUser = { name: 'Unknown' }
  } = resource;

  // Convert rating to a number and ensure it's within valid range
  const safeRating = Number(rating) || 0;
  const safeNumReviews = Number(numReviews) || 0;

  // Ensure title is a string
  const safeTitle = String(title || 'Untitled Resource');
  const safeTopic = String(topic || 'General');
  const safeSubject = String(subject || 'Uncategorized');

  return (
    <Link
      to={`/resources/${_id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {safeTitle}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{safeSubject}</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{safeTopic}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {safeRating.toFixed(1)} ({safeNumReviews} reviews)
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            by {resourceUser.name || 'Unknown'}
          </span>
        </div>
      </div>
    </Link>
  );
}