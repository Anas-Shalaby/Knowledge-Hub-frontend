import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import axios from "axios";
import { Star, Download, Trash, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ResourceDetails() {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await axios.get(
          `https://notes-app-ibkq.onrender.com/api/resources/${id}`
        );
        setResource(data);
      } catch (err) {
        setError(err.response?.data?.message || t("common.error"));
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, navigate, t]);

  const downloadResource = async () => {
    try {
      const response = await axios.get(
        `https://notes-app-ibkq.onrender.com/api/resources/${resource._id}/download`,
        {
          responseType: "blob", // Important for file download
        }
      );
      // If redirected, open the URL in a new tab
      window.location.href = `https://notes-app-ibkq.onrender.com/api/resources/${resource._id}/download`;
      toast.success(t("resources.details.downloadButton"));
    } catch (error) {
      toast.error(t("resources.details.downloadError"));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://notes-app-ibkq.onrender.com/api/resources/${id}/reviews`,
        review
      );
      toast.success(t("resources.details.submitReview"));
      // Refresh resource to show new review
      const { data } = await axios.get(
        `https://notes-app-ibkq.onrender.com/api/resources/${id}`
      );
      setResource(data);
      setReview({ rating: 5, comment: "" });
    } catch (error) {
      toast.error(t("resources.details.reviewError"));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://notes-app-ibkq.onrender.com/api/resources/${id}`
      );
      toast.success(t("resources.details.deleteSuccess"));
      navigate("/");
    } catch (error) {
      toast.error(t("resources.details.deleteError"));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600 dark:text-red-400 dark:bg-gray-900 min-h-screen">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 gap-8">
        {/* Resource Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {resource.title}
            </h1>
            {user && user._id === resource.user._id && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors"
              >
                <Trash className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-300">
              {resource.subject}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-300">
              {resource.topic}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {resource.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {resource.rating.toFixed(1)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ({resource.numReviews} reviews)
              </span>
            </div>

            <button
              onClick={downloadResource}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{t("resources.details.downloadButton")}</span>
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {t("resources.details.reviews")}
          </h2>

          {user && (
            <form onSubmit={handleReviewSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("resources.details.rating")}
                </label>
                <select
                  value={review.rating}
                  onChange={(e) =>
                    setReview((prev) => ({
                      ...prev,
                      rating: Number(e.target.value),
                    }))
                  }
                  className="input-field dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} stars
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("resources.details.comment")}
                </label>
                <textarea
                  value={review.comment}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  className="input-field dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                {t("resources.details.submitReview")}
              </button>
            </form>
          )}

          {resource.reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              {t("resources.details.noReviews")}
            </p>
          ) : (
            <div className="space-y-4">
              {resource.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b last:border-b-0 pb-4 last:pb-0 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {review.user.name}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {t("resources.details.confirmDelete")}
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("resources.details.deleteConfirmation")}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 dark:bg-red-700 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-800"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
