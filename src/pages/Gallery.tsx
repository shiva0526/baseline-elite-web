
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  
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
          
          {/* Enhanced Carousel Gallery */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}
              className="w-full"
              onMouseEnter={autoplayPlugin.current.stop}
              onMouseLeave={autoplayPlugin.current.reset}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {filteredImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="relative group overflow-hidden rounded-xl">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Image */}
                      <div 
                        className="cursor-pointer overflow-hidden"
                        onClick={() => setSelectedImage(image.src)}
                      >
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold text-lg mb-1">{image.alt}</h3>
                        <span className="inline-block px-3 py-1 bg-baseline-yellow text-black text-sm rounded-full font-medium capitalize">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Custom Navigation Buttons */}
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 border-baseline-yellow text-baseline-yellow hover:bg-baseline-yellow hover:text-black transition-colors duration-300" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 border-baseline-yellow text-baseline-yellow hover:bg-baseline-yellow hover:text-black transition-colors duration-300" />
            </Carousel>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {filteredImages.map((_, index) => (
                <div 
                  key={index} 
                  className="w-2 h-2 rounded-full bg-gray-600 transition-colors duration-300"
                ></div>
              ))}
            </div>
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
