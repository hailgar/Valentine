import { motion } from 'framer-motion';

export const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 1, 1, 0],
            rotate: Math.random() * 360 
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute text-pink-300/40"
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};