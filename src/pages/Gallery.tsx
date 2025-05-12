
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const images = [
    {
      src: "/images/gallery1.jpg",
      alt: "Training session",
      category: "training"
    },
    {
      src: "/images/gallery2.jpg",
      alt: "Group drills",
      category: "training"
    },
    {
      src: "/images/gallery3.jpg",
      alt: "One-on-one coaching",
      category: "coaching"
    },
    {
      src: "/images/gallery4.jpg",
      alt: "Shooting practice",
      category: "training"
    },
    {
      src: "/images/gallery5.jpg",
      alt: "Team huddle",
      category: "team"
    },
    {
      src: "/images/gallery6.jpg",
      alt: "Skills competition",
      category: "events"
    },
    {
      src: "/images/gallery7.jpg",
      alt: "Player development",
      category: "coaching"
    },
    {
      src: "/images/gallery8.jpg",
      alt: "Academy tournament",
      category: "events"
    },
    {
      src: "/images/gallery9.jpg",
      alt: "Strength training",
      category: "training"
    }
  ];

  const videos = [
    {
      src: "https://www.youtube.com/embed/VIDEO_ID_1",
      title: "Shooting Form Breakdown",
      thumbnail: "/images/video-thumb1.jpg"
    },
    {
      src: "https://www.youtube.com/embed/VIDEO_ID_2",
      title: "Dribbling Masterclass",
      thumbnail: "/images/video-thumb2.jpg"
    },
    {
      src: "https://www.youtube.com/embed/VIDEO_ID_3",
      title: "Basketball IQ Training",
      thumbnail: "/images/video-thumb3.jpg"
    }
  ];

  const [filter, setFilter] = useState('all');
  
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Media <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-xl text-gray-300">
              Explore photos and videos from our training sessions, events, and player successes.
            </p>
          </div>
        </div>
      </section>
      
      {/* Photo Gallery */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-8">
            Photo <span className="gradient-text">Gallery</span>
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'all' ? 'bg-baseline-yellow text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('training')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'training' ? 'bg-baseline-yellow text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Training
            </button>
            <button 
              onClick={() => setFilter('coaching')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'coaching' ? 'bg-baseline-yellow text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Coaching
            </button>
            <button 
              onClick={() => setFilter('team')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'team' ? 'bg-baseline-yellow text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Team
            </button>
            <button 
              onClick={() => setFilter('events')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'events' ? 'bg-baseline-yellow text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Events
            </button>
          </div>
          
          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <div 
                key={index} 
                className="cursor-pointer overflow-hidden rounded-lg hover-scale"
                onClick={() => setSelectedImage(image.src)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Video Section */}
      <section className="section-padding bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-8">
            Video <span className="gradient-text">Highlights</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <div key={index} className="bg-black rounded-lg overflow-hidden border border-gray-800 hover-scale">
                <div className="aspect-video relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-baseline-yellow flex items-center justify-center">
                      <div className="ml-1 w-0 h-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-black"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button 
              className="absolute top-4 right-4 bg-baseline-yellow text-black w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Gallery;
