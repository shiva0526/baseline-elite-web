
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Note: This is a simplified version without actual GSAP implementation
// In a real implementation, we would import GSAP and use it for animations

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, we would initialize GSAP animations here
    // For now, we'll use CSS animations defined in our tailwind.config
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 opacity-60">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/basketball-training.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black"></div>
      
      {/* Content */}
      <div className="relative container mx-auto h-full flex flex-col justify-center px-4">
        <div className="max-w-3xl">
          <h1 
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 animate-fade-in"
          >
            <span className="block">Train Different.</span>
            <span className="block">Train Elite.</span>
            <span className="gradient-text">Train BaseLine.</span>
          </h1>
          
          <div 
            ref={subHeadingRef}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-xl animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            Unlock your full potential with elite basketball training backed by science and experience.
          </div>
          
          <div 
            ref={ctaRef}
            className="flex flex-wrap gap-4 animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            <Link to="/programs" className="button-primary flex items-center gap-2">
              Explore Programs <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="button-outline">
              Join Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-white text-sm mb-2">Scroll Down</span>
        <div className="w-0.5 h-16 bg-gradient-to-b from-baseline-yellow to-transparent animate-bounce-subtle"></div>
      </div>
    </section>
  );
};

export default HeroSection;
