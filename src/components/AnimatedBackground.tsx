
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-white to-gray-50 opacity-90"></div>
      
      {/* Enhanced Animated Orbs with more variety */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100 opacity-30 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '0s', animationDuration: '12s' }}></div>
      <div className="absolute top-2/3 left-1/3 w-96 h-96 rounded-full bg-indigo-100 opacity-30 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '15s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-100 opacity-30 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '18s' }}></div>
      
      {/* Additional orbs for more dynamic background */}
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-blue-50 opacity-20 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '3s', animationDuration: '20s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-purple-50 opacity-25 mix-blend-multiply blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '16s' }}></div>
      
      {/* Improved Subtle Grid with gradient */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(240,240,250,0.5)), linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)'
      }}></div>
      
      {/* Decorative elements */}
      <div className="absolute top-[15%] left-[85%] w-32 h-32 opacity-10 rotate-45">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="url(#gradient)" strokeWidth="2" />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="absolute top-[75%] left-[10%] w-24 h-24 opacity-10 -rotate-12">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="60" height="60" stroke="url(#gradient2)" strokeWidth="2" />
          <defs>
            <linearGradient id="gradient2" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EC4899" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default AnimatedBackground;
