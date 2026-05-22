import { useState } from 'react';
import { getImageUrl } from '../utils/imageUtils';

const FALLBACK = '/images/bondi_beach.jpg';

const TourImageGallery = ({ title, imageUrl }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainImage = getImageUrl(imageUrl);
  const galleryImages = Array.from({ length: 5 }, () => mainImage || FALLBACK);

  const handleError = (event) => {
    event.currentTarget.src = FALLBACK;
  };

  return (
    <>
      {/* Desktop: 5-image mosaic grid */}
      <div className="hidden overflow-hidden rounded-3xl bg-gray-100 md:grid md:h-[430px] md:grid-cols-4 md:grid-rows-2 md:gap-2">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="col-span-2 row-span-2 relative overflow-hidden focus:outline-none"
        >
          <img
            src={galleryImages[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            onError={handleError}
          />
        </button>

        {galleryImages.slice(1, 5).map((src, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="relative overflow-hidden focus:outline-none"
          >
            <img
              src={src}
              alt={`${title} ${index + 2}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              onError={handleError}
            />
            {index === 3 && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81V14.75c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.06l-2.22-2.22a.75.75 0 00-1.06 0L9.06 15H3.25a.75.75 0 01-.75-.75v-3.19zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
                Show all photos
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile: compact gallery */}
      <div className="overflow-hidden rounded-3xl bg-gray-100 md:hidden">
        <div className="aspect-[4/3]">
          <img
            src={galleryImages[0]}
            alt={title}
            className="h-full w-full object-cover"
            onError={handleError}
          />
        </div>
        <div className="grid grid-cols-4 gap-1 p-1">
          {galleryImages.slice(1, 5).map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-square overflow-hidden focus:outline-none"
            >
              <img
                src={src}
                alt={`${title} ${index + 2}`}
                className="h-full w-full object-cover"
                onError={handleError}
              />
              {index === 3 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white">
                  Show all
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-4">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-gray-700 shadow hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <div className="grid gap-3">
              {galleryImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`${title} ${index + 1}`}
                  className="w-full rounded-xl object-cover"
                  onError={handleError}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TourImageGallery;
