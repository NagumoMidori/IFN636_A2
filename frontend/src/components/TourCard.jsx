import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const imageUrl = getImageUrl(tour.imageUrl);

  return (
    <div
      onClick={() => navigate(`/tours/${tour._id}`)}
      className="group cursor-pointer"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={imageUrl}
          alt={tour.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=450&fit=crop';
          }}
        />
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-gray-900 truncate group-hover:underline">{tour.title}</h3>
        </div>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          {tour.location}
        </p>
        <p className="text-[15px] text-gray-900 mt-1">
          <span className="font-semibold">AUD ${tour.price}</span>
          {tour.type === 'promo' && tour.originalPrice > tour.price && (
            <span className="ml-1.5 text-sm text-gray-400 line-through">AUD ${tour.originalPrice}</span>
          )}
          <span className="text-gray-500 font-normal"> / person</span>
        </p>
      </div>
    </div>
  );
};

export default TourCard;
