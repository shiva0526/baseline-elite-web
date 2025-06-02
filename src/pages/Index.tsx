
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import WhyUsSection from '@/components/home/WhyUsSection';
import PricingSection from '@/components/home/PricingSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import VideoSection from '@/components/home/VideoSection';
import ParticleBackground from '@/components/effects/ParticleBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { X } from 'lucide-react';

const Index = () => {
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    // Check for announcements
    const fetchAnnouncement = () => {
      const storedAnnouncement = localStorage.getItem('announcement');
      if (storedAnnouncement) {
        setAnnouncement(storedAnnouncement);
        setShowAnnouncement(true);
      }
    };
    
    // Initial check
    fetchAnnouncement();
    
    // Listen for storage events to update in real time
    const handleStorageChange = () => {
      fetchAnnouncement();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      {/* Announcement Banner */}
      {showAnnouncement && announcement && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 inset-x-0 z-40"
        >
          <div className="container mx-auto px-4">
            <div className="bg-baseline-yellow/90 text-black font-medium p-4 rounded-lg shadow-lg flex justify-between items-center">
              <p>{announcement}</p>
              <button 
                onClick={closeAnnouncement}
                className="ml-4 p-1 hover:bg-black/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      <HeroSection />
      <WhyUsSection />
      <PricingSection />
      <TestimonialsSection />
      <VideoSection />
      <Footer />
    </div>
  );
};

export default Index;
