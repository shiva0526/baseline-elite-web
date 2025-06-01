
import { motion } from 'framer-motion';

const Basketball3D = () => {
  return (
    <motion.div 
      className="w-full h-96 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full shadow-2xl"
        animate={{ 
          rotateY: 360,
          rotateX: [0, 10, 0]
        }}
        transition={{ 
          rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
          boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
        }}
      >
        {/* Basketball lines */}
        <div className="w-full h-full relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/20 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-black/20 transform -translate-x-1/2"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-black/20 rounded-full"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Basketball3D;
