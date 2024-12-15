import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import axios from "axios";
import { Upload as UploadIcon } from "lucide-react";
import path from "path";
import toast from "react-hot-toast";

export default function Upload() {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    description: "",
    fileUrl: "",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file type
    if (
      selectedFile &&
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "video/mp4",
      ].includes(selectedFile.type)
    ) {
      toast.error(t("resources.upload.fileTypeError"));
      return;
    }

    setFile(selectedFile);

    // Generate a unique filename
    const uniqueFileName = `${Date.now()}_${selectedFile.name}`;
    setFormData((prev) => ({
      ...prev,
      fileUrl: uniqueFileName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return setError(t("resources.upload.fileTypeError"));
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fileUrl", file, formData.fileUrl);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("subject", formData.type);
    formDataToSend.append("topic", formData.category);
    formDataToSend.append("description", formData.description);

    try {
      setError("");
      setLoading(true);
      const response = await axios.post(
        "https://notes-app-ibkq.onrender.com/api/resources",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success(t("resources.upload.uploadSuccess"));
      navigate("/");
    } catch (err) {
      toast.error(t("resources.upload.uploadError"));
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {t("resources.upload.title")}
      </h2>
      <p className="text-center text-gray-600 mb-6">
        {t("resources.upload.description")}
      </p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            {t("resources.upload.form.title")}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field p-2"
            placeholder={t("resources.upload.form.titlePlaceholder")}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              {t("resources.upload.form.type")}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field p-2"
              required
            >
              <option value="">
                {t("common.select")} {t("resources.upload.form.type")}
              </option>
              <option value="lecture-notes">Lecture Notes</option>
              <option value="textbook">Textbook</option>
              <option value="problem-set">Problem Set</option>
              <option value="video-tutorial">Video Tutorial</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              {t("resources.upload.form.category")}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field p-2"
              required
            >
              <option value="">
                {t("common.select")} {t("resources.upload.form.category")}
              </option>
              <option value="mathematics">{t("subjects.mathematics")}</option>
              <option value="physics">{t("subjects.physics")}</option>
              <option value="chemistry">{t("subjects.chemistry")}</option>
              <option value="biology">{t("subjects.biology")}</option>
              <option value="computer-science">
                {t("subjects.computerScience")}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            {t("resources.upload.form.description")}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder={t("resources.upload.form.descriptionPlaceholder")}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("resources.upload.form.file")}
          </label>
          <p className="text-xs text-gray-500 mb-2">
            {t("resources.upload.form.fileHelp")}
          </p>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>{t("resources.upload.form.file")}</span>
                  <input
                    id="file"
                    name="fileUrl"
                    type="file"
                    accept=".pdf,.docx,.pptx,.mp4"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
            </div>
          </div>
          {file && <p className="mt-2 text-sm text-gray-500">{file.name}</p>}
        </div>

        <div className="space-x-4 w-full">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 w-full text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? t("common.loading") : t("common.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
