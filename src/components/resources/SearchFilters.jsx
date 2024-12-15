import { Search } from 'lucide-react';

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
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 input-field p-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
        </div>
        
        <select
          value={subject}
          onChange={(e) => onFilterChange('subject', e.target.value)}
          className="input-field dark:bg-gray-800 p-2 dark:text-gray-200 dark:border-gray-700"
        >
          <option value="">All Subjects</option>
          <option value="mathematics">Mathematics</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="biology">Biology</option>
          <option value="computer-science">Computer Science</option>
        </select>

        <select
          value={topic}
          onChange={(e) => onFilterChange('topic', e.target.value)}
          className="input-field dark:bg-gray-800 p-2 dark:text-gray-200 dark:border-gray-700"
        >
          <option value="">All Topics</option>
          <option value="calculus">Calculus</option>
          <option value="algebra">Algebra</option>
          <option value="mechanics">Mechanics</option>
          <option value="organic-chemistry">Organic Chemistry</option>
          <option value="programming">Programming</option>
        </select>
      </div>
    </div>
  );
}