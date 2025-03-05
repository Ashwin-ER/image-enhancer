
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-white to-gray-50 opacity-90"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100 opacity-30 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-2/3 left-1/3 w-96 h-96 rounded-full bg-indigo-100 opacity-30 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-100 opacity-30 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Subtle Grid */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.025) 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}></div>
    </div>
  );
};

export default AnimatedBackground;
