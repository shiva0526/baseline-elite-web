
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Basketball3D from '@/components/effects/Basketball3D';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative h-screen overflow-hidden bg-black flex items-center">
      {/* Background Video */}
      <div className="absolute inset-0 opacity-30">
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
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      
      {/* Content */}
      <div className="relative container mx-auto h-full flex items-center px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Main Heading */}
            <motion.h1 
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
            >
              <span className="block text-white">Train Different.</span>
              <span className="block text-white">Train Elite.</span>
              <span className="block gradient-text font-black">Train BaseLine.</span>
            </motion.h1>
            
            {/* Subheading */}
            <motion.p 
              variants={textVariants}
              className="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-xl leading-relaxed"
            >
              Unlock your full potential with elite basketball training backed by science and experience.
            </motion.p>
            
            {/* CTAs */}
            <motion.div 
              variants={containerVariants}
              className="flex flex-wrap gap-6"
            >
              <motion.div variants={buttonVariants}>
                <Link to="/programs" className="group">
                  <motion.button
                    whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-baseline-yellow text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-baseline-yellow/40 text-lg"
                  >
                    Explore Programs
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
              
              <motion.div variants={buttonVariants}>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, borderColor: "#F7D046" }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-baseline-yellow/60 text-baseline-yellow font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-baseline-yellow/10 hover:border-baseline-yellow text-lg backdrop-blur-sm"
                  >
                    Join Now
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* 3D Basketball */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className="hidden lg:flex justify-center items-center"
          >
            <Basketball3D />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-baseline-yellow text-sm font-medium mb-4 rotate-90 origin-center">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-0.5 h-20 bg-gradient-to-b from-baseline-yellow via-baseline-yellow/60 to-transparent shadow-lg shadow-baseline-yellow/50"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <ChevronDown className="text-baseline-yellow mt-2" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
