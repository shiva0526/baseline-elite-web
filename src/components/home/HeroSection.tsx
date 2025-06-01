
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Basketball3D from '@/components/effects/Basketball3D';
import ParticleBackground from '@/components/effects/ParticleBackground';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const slideUpVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Background */}
      <ParticleBackground />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-baseline-yellow/5"
        animate={{
          background: isHovered 
            ? "linear-gradient(135deg, #000000 0%, rgba(0,0,0,0.85) 50%, rgba(247,208,70,0.1) 100%)"
            : "linear-gradient(135deg, #000000 0%, rgba(0,0,0,0.9) 50%, rgba(247,208,70,0.05) 100%)"
        }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Parallax Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative container mx-auto h-full flex items-center px-4 z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl space-y-8"
          >
            {/* Main Headline */}
            <motion.div
              variants={titleVariants}
              className="space-y-4"
            >
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-display font-black leading-none"
                animate={floatingAnimation}
              >
                <span className="block text-white drop-shadow-2xl">
                  Level Up
                </span>
                <motion.span 
                  className="block bg-gradient-to-r from-baseline-yellow via-yellow-400 to-baseline-yellow bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Your Game
                </motion.span>
              </motion.h1>
            </motion.div>
            
            {/* Subheading */}
            <motion.div 
              variants={slideUpVariants}
              className="relative"
            >
              <motion.p
                className="text-xl md:text-2xl text-gray-200 leading-relaxed font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                Join the elite basketball academy where champions are made. 
                <span className="text-baseline-yellow font-semibold"> Professional coaching</span>, 
                <span className="text-baseline-yellow font-semibold"> modern facilities</span>, 
                <span className="text-baseline-yellow font-semibold"> proven results</span>.
              </motion.p>
            </motion.div>
            
            {/* Enhanced CTAs */}
            <motion.div 
              variants={slideUpVariants}
              className="flex flex-col sm:flex-row gap-6 pt-4"
            >
              <Link to="/programs" className="group">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(247, 208, 70, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative bg-baseline-yellow text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden min-w-[180px]"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-baseline-yellow"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    Join Now
                    <ArrowRight 
                      size={20} 
                      className="group-hover:translate-x-1 transition-transform duration-300" 
                    />
                  </span>
                </motion.button>
              </Link>
              
              <Link to="/about">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: "#F7D046",
                    backgroundColor: "rgba(247, 208, 70, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group border-2 border-baseline-yellow/60 text-baseline-yellow font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-baseline-yellow/20 min-w-[180px] flex items-center justify-center gap-3"
                >
                  <Play size={18} className="group-hover:scale-110 transition-transform" />
                  Learn More
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats or Social Proof */}
            <motion.div
              variants={slideUpVariants}
              className="flex flex-wrap gap-8 pt-8 border-t border-baseline-yellow/20"
            >
              {[
                { number: "500+", label: "Athletes Trained" },
                { number: "15+", label: "Years Experience" },
                { number: "98%", label: "Success Rate" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-2xl font-bold text-baseline-yellow">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right Side - 3D Basketball */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: -30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            className="hidden lg:flex justify-center items-center relative"
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-baseline-yellow/30 via-baseline-yellow/10 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <Basketball3D />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Enhanced Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
      >
        <motion.div
          animate={{ 
            y: [0, 12, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-1 h-16 bg-gradient-to-b from-baseline-yellow via-baseline-yellow/60 to-transparent rounded-full"
        />
        <motion.p 
          className="text-xs text-baseline-yellow/80 mt-2 font-medium tracking-wider"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SCROLL
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
