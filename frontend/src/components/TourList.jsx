const TourList = ({ tours, setEditingTour }) => {
  return (
    <div className="space-y-4">
      {tours.map((tour) => (
        <div 
          key={tour._id} 
          onClick={() => setEditingTour(tour)} 
          className="bg-white p-3 flex items-center space-x-4 border border-gray-100 rounded-2xl shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-xl overflow-hidden flex items-center justify-center text-2xl">
            {tour.imageUrl ? <img src={tour.imageUrl} className="w-full h-full object-cover" /> : '🏝️'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 truncate">{tour.title}</h3>
            <p className="text-gray-400 text-xs">{tour.location || 'Australia'}</p>
            <div className="mt-2">
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold">
                AUD {tour.price}
              </span>
            </div>
          </div>
          <div className="text-gray-300">›</div>
        </div>
      ))}
    </div>
  );
};

export default TourList;