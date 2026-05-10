import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const TourList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/api/tours')
      .then((res) => setTours(res.data))
      .catch((err) => console.error('Failed to fetch tours:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-sm text-gray-500 mt-1">{tours.length} tours total</p>
        </div>
        <button
          onClick={() => navigate('/admin/tours/new')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Tour
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[11%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tours.map((tour) => (
                <tr key={tour._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={tour.imageUrl?.startsWith('http') ? tour.imageUrl : `http://localhost:5001${tour.imageUrl}`}
                        alt={tour.title}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop'; }}
                      />
                      <span className="text-sm font-medium text-gray-900">{tour.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{tour.location}</td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {tour.startDate ? (
                      <>
                        {new Date(tour.startDate).toLocaleDateString()} – {new Date(tour.endDate).toLocaleDateString()}
                      </>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{tour.capacity || '—'}</td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">AUD ${tour.price}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tour.status === 'Available'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {tour.status || 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => navigate(`/admin/tours/${tour._id}/edit`)}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tours.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              No tours yet. Click "Add Tour" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourList;
