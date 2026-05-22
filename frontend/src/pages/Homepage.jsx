import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TourGrid from '../components/TourGrid';

const Homepage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const fetchTours = async () => {
        try {
          const params = {};
          if (searchTerm.trim()) {
            params.search = searchTerm.trim();
          }
          const res = await axiosInstance.get('/api/tours', { params });
          setTours(res.data);
        } catch (err) {
          console.error('Failed to fetch tours:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchTours();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="bg-white">
      {/* Search / Filter bar area */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-2xl relative">
              <div className="flex items-center border border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 mr-3 shrink-0">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search destinations across Australia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          {searchTerm.trim() ? `Search results for "${searchTerm.trim()}"` : 'Popular Tours'}
        </h2>
        <TourGrid tours={tours} loading={loading} />
      </section>
    </div>
  );
};

export default Homepage;
