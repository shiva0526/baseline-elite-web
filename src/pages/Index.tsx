
import { useEffect, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProgramsPreview from '@/components/home/ProgramsPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CallToAction from '@/components/home/CallToAction';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { X } from 'lucide-react';

const Index = () => {
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    // Check for announcements
    const storedAnnouncement = localStorage.getItem('announcement');
    if (storedAnnouncement) {
      setAnnouncement(storedAnnouncement);
      setShowAnnouncement(true);
    }
  }, []);

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Announcement Banner */}
      {showAnnouncement && announcement && (
        <div className="fixed top-20 inset-x-0 z-40 animate-fade-in">
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
        </div>
      )}
      
      <HeroSection />
      <FeaturesSection />
      <ProgramsPreview />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
