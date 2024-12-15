import { Search } from "lucide-react";

export default function SearchFilters({ filters, onFilterChange }) {
  const { search, subject, topic } = filters;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-10 input-field p-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
        </div>

        <select
          value={subject}
          onChange={(e) => onFilterChange("subject", e.target.value)}
          className="input-field dark:bg-gray-800 p-2 dark:text-gray-200 dark:border-gray-700"
        >
          <option value="">All Subjects</option>
          <option value="image-processing">Image Processing</option>
          <option value="medical-equipment">Medical Equipment</option>
          <option value="biostatistics">Biostatistics</option>
          <option value="digital-control">Digital Control</option>
          <option value="medical-planning">Medical Planning</option>
        </select>

        <select
          value={topic}
          onChange={(e) => onFilterChange("topic", e.target.value)}
          className="input-field dark:bg-gray-800 p-2 dark:text-gray-200 dark:border-gray-700"
        >
          <option value="">All Topics</option>
          <option value="lecture_notes">Lecture Notes</option>
          <option value="textbook">Textbook</option>
          <option value="problem_set">Problem Set</option>
          <option value="video_tutorial">Video Tutorial</option>
        </select>
      </div>
    </div>
  );
}
