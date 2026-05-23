import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TourForm from '../components/TourForm';
import TourList from '../components/TourList';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTours = async () => {
    try {
      const response = await axiosInstance.get('/api/tours');
      setTours(response.data);
    } catch (error) { console.error('Failed to fetch tours:', error); }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Called when a tour item is clicked
  const handleEditClick = (tour) => {
    setEditingTour(tour);
    setShowForm(true);
  };

  // Called after save or delete
  const handleSuccess = () => {
    setShowForm(false);
    setEditingTour(null);
    fetchTours();
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <div className="max-w-[420px] mx-auto bg-white min-h-[90vh] shadow-2xl relative rounded-t-[40px] flex flex-col">

        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b sticky top-0 bg-white z-10 rounded-t-[40px]">
          <h1 className="text-xl font-black text-gray-900 uppercase">Package List</h1>
          <button
            onClick={() => { setEditingTour(null); setShowForm(true); }}
            className="text-[#00A651] font-bold text-sm"
          >
            + New Package
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <TourList tours={tours} setEditingTour={handleEditClick} />
        </div>

        {/* Edit/Add modal */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-[420px] bg-white h-full overflow-y-auto">
              <TourForm
                editingTour={editingTour}
                onSuccess={handleSuccess}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;
