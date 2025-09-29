
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );
  
  // Enhanced carousel tracking
  const [carouselApi, setCarouselApi] = useState<any>();
  
  useEffect(() => {
    if (!carouselApi) return;
    
    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on('select', onSelect);
    onSelect();
    
    return () => carouselApi?.off('select', onSelect);
  }, [carouselApi]);
  
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
          
          {/* Enhanced Dynamic Carousel Gallery */}
          <div className="relative -mx-4 md:-mx-8 lg:-mx-16">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: "center",
                loop: true,
                dragFree: true,
              }}
              plugins={[autoplayPlugin.current]}
              className="w-full overflow-hidden"
              onMouseEnter={() => {
                if (isPlaying) {
                  autoplayPlugin.current.stop();
                }
              }}
              onMouseLeave={() => {
                if (isPlaying) {
                  autoplayPlugin.current.reset();
                }
              }}
            >
              <CarouselContent className="-ml-1">
                {filteredImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-1 basis-4/5 md:basis-2/3 lg:basis-1/2">
                    <div className="relative group overflow-hidden rounded-2xl mx-2 shadow-2xl">
                      {/* Ken Burns Effect Container */}
                      <div className="relative overflow-hidden h-96 md:h-[500px]">
                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Dynamic Ken Burns Image */}
                        <div 
                          className="cursor-pointer w-full h-full overflow-hidden"
                          onClick={() => setSelectedImage(image.src)}
                        >
                          <img 
                            src={image.src} 
                            alt={image.alt} 
                            className={`w-full h-full object-cover transition-all duration-[8000ms] ease-in-out transform
                              ${currentSlide === index ? 'scale-110 animate-ken-burns' : 'scale-100'}
                              group-hover:scale-125 group-hover:brightness-110
                            `}
                          />
                        </div>
                        
                        {/* Floating Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white font-bold text-xl md:text-2xl mb-3 drop-shadow-lg">
                              {image.alt}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="inline-block px-4 py-2 bg-baseline-yellow/90 backdrop-blur-sm text-black text-sm rounded-full font-semibold capitalize shadow-lg">
                                {image.category}
                              </span>
                              <div className="w-2 h-2 rounded-full bg-white/60"></div>
                              <span className="text-white/80 text-sm font-medium">
                                Baseline Elite Academy
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover Play Indicator */}
                        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                            <Play className="w-5 h-5 text-baseline-yellow ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Enhanced Navigation Buttons */}
              <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/30 backdrop-blur-md border-2 border-baseline-yellow/50 text-baseline-yellow hover:bg-baseline-yellow hover:text-black hover:border-baseline-yellow transition-all duration-300 shadow-xl" />
              <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/30 backdrop-blur-md border-2 border-baseline-yellow/50 text-baseline-yellow hover:bg-baseline-yellow hover:text-black hover:border-baseline-yellow transition-all duration-300 shadow-xl" />
            </Carousel>
            
            {/* Dynamic Progress Indicator */}
            <div className="flex justify-center items-center mt-8 space-x-3">
              <button
                onClick={() => {
                  if (isPlaying) {
                    autoplayPlugin.current.stop();
                    setIsPlaying(false);
                  } else {
                    autoplayPlugin.current.reset();
                    setIsPlaying(true);
                  }
                }}
                className="w-8 h-8 rounded-full bg-baseline-yellow/20 border border-baseline-yellow/50 text-baseline-yellow hover:bg-baseline-yellow hover:text-black transition-all duration-300 flex items-center justify-center mr-4"
              >
                {isPlaying ? (
                  <div className="w-2 h-2 bg-current"></div>
                ) : (
                  <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                )}
              </button>
              
              {filteredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className="relative group"
                >
                  <div className={`transition-all duration-300 rounded-full ${
                    currentSlide === index 
                      ? 'w-8 h-2 bg-baseline-yellow' 
                      : 'w-2 h-2 bg-gray-600 group-hover:bg-baseline-yellow/60'
                  }`}>
                    {currentSlide === index && (
                      <div className="absolute inset-0 bg-baseline-yellow rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              ))}
              
              <div className="ml-4 text-sm text-gray-400 font-medium">
                {currentSlide + 1} / {filteredImages.length}
              </div>
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
      
      {/* Enhanced Immersive Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md border border-baseline-yellow/50 text-baseline-yellow hover:bg-baseline-yellow hover:text-black rounded-full flex items-center justify-center transition-all duration-300 shadow-xl"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </button>
            
            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.findIndex(img => img.src === selectedImage);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                setSelectedImage(images[prevIndex].src);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-black/50 backdrop-blur-md border border-baseline-yellow/50 text-baseline-yellow hover:bg-baseline-yellow hover:text-black rounded-full flex items-center justify-center transition-all duration-300 shadow-xl"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.findIndex(img => img.src === selectedImage);
                const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                setSelectedImage(images[nextIndex].src);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-black/50 backdrop-blur-md border border-baseline-yellow/50 text-baseline-yellow hover:bg-baseline-yellow hover:text-black rounded-full flex items-center justify-center transition-all duration-300 shadow-xl"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Enhanced Image Container */}
            <div 
              className="relative max-w-6xl max-h-[85vh] w-full group cursor-zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="w-full h-full object-contain animate-scale-in group-hover:scale-105 transition-transform duration-700 ease-out shadow-2xl"
              />
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {(() => {
                  const imageData = images.find(img => img.src === selectedImage);
                  return imageData ? (
                    <div className="text-center">
                      <h3 className="text-white font-bold text-xl mb-2">{imageData.alt}</h3>
                      <span className="inline-block px-4 py-2 bg-baseline-yellow text-black text-sm rounded-full font-medium capitalize">
                        {imageData.category}
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
            
            {/* Loading Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 border-4 border-baseline-yellow/20 border-t-baseline-yellow rounded-full animate-spin opacity-0"></div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Gallery;
