import React from 'react';
import { motion } from 'motion/react';
import { WeatherCondition } from '../types';

interface Props {
  condition: WeatherCondition;
}

export const Character: React.FC<Props> = ({ condition }) => {
  // Simple SVG character that changes based on weather
  const renderOutfit = () => {
    switch (condition) {
      case 'Rain':
        return (
          <g>
            {/* Raincoat */}
            <path d="M40,100 L160,100 L180,250 L20,250 Z" fill="#CC0000" />
            {/* Umbrella */}
            <motion.g
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: '100px 150px' }}
            >
               <path d="M20,60 Q100,0 180,60" fill="none" stroke="#CC0000" strokeWidth="8" />
               <line x1="100" y1="60" x2="100" y2="150" stroke="#CC0000" strokeWidth="4" />
            </motion.g>
          </g>
        );
      case 'Snow':
        return (
          <motion.g
            animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
          >
            {/* Puffer Jacket */}
            <path d="M40,100 L160,100 L170,250 L30,250 Z" fill="#1A1A2E" />
            {/* Scarf */}
            <path d="M70,100 Q100,120 130,100 L130,140 Q100,160 70,140 Z" fill="#CC0000" />
            {/* Rosy cheeks */}
            <circle cx="85" cy="75" r="4" fill="rgba(255, 182, 193, 0.6)" />
            <circle cx="115" cy="75" r="4" fill="rgba(255, 182, 193, 0.6)" />
          </motion.g>
        );
      case 'Storm':
        return (
          <motion.g
            animate={{ rotate: [0, 4, 0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: '100px 250px' }}
          >
            {/* Raincoat leaning */}
            <path d="M40,100 L160,100 L180,250 L20,250 Z" fill="#CC0000" transform="skewX(-5)" />
            {/* Inside-out Umbrella */}
            <g transform="translate(120, 100) rotate(90)">
               <path d="M20,60 Q100,120 180,60" fill="none" stroke="#CC0000" strokeWidth="8" />
               <line x1="100" y1="60" x2="100" y2="150" stroke="#CC0000" strokeWidth="4" />
            </g>
            {/* Expression */}
            <circle cx="90" cy="70" r="3" fill="black" />
            <circle cx="110" cy="70" r="3" fill="black" />
            <ellipse cx="100" cy="85" rx="5" ry="3" fill="black" />
          </motion.g>
        );
      case 'Clear':
        return (
          <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            {/* T-shirt */}
            <path d="M50,120 L150,120 L160,250 L40,250 Z" fill="#CC0000" />
            {/* Sunglasses */}
            <rect x="75" y="65" width="20" height="10" rx="2" fill="black" />
            <rect x="105" y="65" width="20" height="10" rx="2" fill="black" />
            <line x1="95" y1="70" x2="105" y2="70" stroke="black" strokeWidth="2" />
            {/* Smile */}
            <path d="M85,85 Q100,100 115,85" fill="none" stroke="black" strokeWidth="2" />
          </motion.g>
        );
      case 'Fog':
        return (
          <motion.g
            animate={{ x: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            {/* Hoodie */}
            <path d="M45,110 L155,110 L165,250 L35,250 Z" fill="#220000" />
            <circle cx="100" cy="80" r="35" fill="#220000" />
          </motion.g>
        );
      case 'Cloudy':
      default:
        return (
          <motion.g
            animate={{ scaleY: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ transformOrigin: 'bottom' }}
          >
            {/* Light jacket */}
            <path d="M45,110 L155,110 L165,250 L35,250 Z" fill="#3A3A3A" />
          </motion.g>
    );
    }
  };

  return (
    <div className="fixed bottom-10 right-10 w-56 h-[220px] z-10 pointer-events-none">
      <svg viewBox="0 0 200 300" className="w-full h-full">
        {/* Head */}
        <circle cx="100" cy="70" r="30" fill="#c68642" />
        {/* Body/Outfit */}
        {renderOutfit()}
        {/* Legs */}
        <rect x="70" y="250" width="20" height="50" fill="#111" />
        <rect x="110" y="250" width="20" height="50" fill="#111" />
      </svg>
    </div>
  );
};
