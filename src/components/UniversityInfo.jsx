import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const UniversityInfo = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // GGSIPU Campus Location
  const mapCenter = {
    lat: 28.5921,
    lng: 77.0460
  };

  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(mapCenter);
    map.fitBounds(bounds);
  }, [mapCenter]);

  // Campus images data
  const campusImages = [
    {
      id: 1,
      src: '/src/assets/images/main-gate.jpg', // Add your images to assets/images/
      title: 'Main Gate',
      caption: 'Main entrance to GGSIPU Campus, Sector 16C, Dwarka',
      tag: '#entrance'
    },
    {
      id: 2,
      src: '/src/assets/images/library.jpg',
      title: 'University Library',
      caption: 'Central library with extensive collection of books and digital resources',
      tag: '#academics'
    },
    {
      id: 3,
      src: '/src/assets/images/auditorium.jpg',
      title: 'Auditorium',
      caption: 'Modern auditorium for seminars, conferences, and cultural events',
      tag: '#events'
    },
    {
      id: 4,
      src: '/src/assets/images/it-block.jpg',
      title: 'IT Block',
      caption: 'Computer Science and IT department buildings with modern facilities',
      tag: '#technology'
    },
    {
      id: 5,
      src: '/src/assets/images/cse-dept.jpg',
      title: 'CSE Department',
      caption: 'Computer Science Engineering department with labs and lecture halls',
      tag: '#academics'
    },
    {
      id: 6,
      src: '/src/assets/images/cafeteria.jpg',
      title: 'Cafeteria',
      caption: 'Food court and cafeteria serving various cuisines for students and staff',
      tag: '#food'
    },
    {
      id: 7,
      src: '/src/assets/images/sports-complex.jpg',
      title: 'Sports Complex',
      caption: 'Sports facilities including basketball court, gymnasium, and playground',
      tag: '#sports'
    },
    {
      id: 8,
      src: '/src/assets/images/admin-block.jpg',
      title: 'Admin Block',
      caption: 'Administrative offices and student service center',
      tag: '#administration'
    }
  ];

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`;
    window.open(url, '_blank');
  };

  const getTagColor = (tag) => {
    const colors = {
      '#entrance': 'bg-blue-100 text-blue-800',
      '#academics': 'bg-green-100 text-green-800',
      '#events': 'bg-purple-100 text-purple-800',
      '#technology': 'bg-indigo-100 text-indigo-800',
      '#food': 'bg-orange-100 text-orange-800',
      '#sports': 'bg-red-100 text-red-800',
      '#administration': 'bg-gray-100 text-gray-800'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* University Website Access */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Guru Gobind Singh Indraprastha University (GGSIPU)
            </h2>
            <p className="text-gray-600 mb-4">
              Official university website for academic notices, results, and announcements
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="https://www.ggsipu.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Official Website
            </a>
          </div>
        </div>
      </div>

      {/* Live Location + Navigation Support */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Campus Location</h2>
          <button
            onClick={getDirections}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          📍 GGSIPU Main Campus, Sector 16C, Dwarka, New Delhi, Delhi 110078
        </div>

        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
            onLoad={onLoad}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            <Marker
              position={mapCenter}
              title="GGSIPU Main Campus"
            />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Visual Campus Guide */}
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Campus Guide</h2>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          className="rounded-lg overflow-hidden"
        >
          {campusImages.map((image, index) => (
            <SwiperSlide key={image.id}>
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-80 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/800x400?text=${encodeURIComponent(image.title)}`;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2">{image.title}</h3>
                      <p className="text-white/90 text-sm">{image.caption}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(image.tag)}`}>
                      {image.tag}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center mt-6 space-x-2 overflow-x-auto">
          {campusImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeSlide === index ? 'border-blue-500 scale-110' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/64x64?text=${encodeURIComponent(image.title.charAt(0))}`;
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityInfo;
