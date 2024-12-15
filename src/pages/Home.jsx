import { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceCard from '../components/resources/ResourceCard';
import SearchFilters from '../components/resources/SearchFilters';

export default function Home() {
  const [resources, setResources] = useState([]);
  const [groupedResources, setGroupedResources] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    topic: ''
  });
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.subject) params.append('subject', filters.subject);
        if (filters.topic) params.append('topic', filters.topic);

        const { data } = await axios.get(
          `https://notes-app-ibkq.onrender.com/api/resources?${params.toString()}`
        );
        
        // Validate and filter resources
        const validResources = data.filter(resource => 
          resource && 
          typeof resource === 'object' && 
          resource._id && 
          resource.title
        );

        // Group resources by subject
        const grouped = validResources.reduce((acc, resource) => {
          const subject = String(resource.subject || 'Uncategorized');
          if (!acc[subject]) {
            acc[subject] = [];
          }
          acc[subject].push(resource);
          return acc;
        }, {});

        setResources(validResources);
        setGroupedResources(grouped);
      } catch (error) {
        console.error('Error fetching resources:', error);
        // Set empty state to prevent rendering errors
        setResources([]);
        setGroupedResources({});
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filters]);

  useEffect(() => {
    // Check system preference and set initial dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
    document.documentElement.classList.toggle('dark', prefersDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900 text-black dark:text-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-14 bg-white dark:bg-gray-900 text-black dark:text-gray-200 min-h-screen">
      
      
      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {Object.keys(groupedResources).length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          No resources found. Try adjusting your filters.
        </div>
      ) : (
        Object.entries(groupedResources).map(([subject, subjectResources]) => (
          <div key={subject} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{subject}</h2>
            <div className="grid grid-cols-1 gap-6">
              {subjectResources.map(resource => {
                // Additional safety check before rendering
                if (!resource || !resource._id) return null;
                return (
                  <ResourceCard 
                    key={resource._id} 
                    resource={resource} 
                  />
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}