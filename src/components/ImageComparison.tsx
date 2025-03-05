
import React, { useState, useRef, useEffect } from 'react';

interface ImageComparisonProps {
  originalImage: string;
  enhancedImage: string;
  isProcessing?: boolean;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({ 
  originalImage, 
  enhancedImage,
  isProcessing = false
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const offsetX = e.clientX - containerRect.left;
        
        // Calculate position as percentage
        const newPosition = Math.min(100, Math.max(0, (offsetX / containerWidth) * 100));
        setSliderPosition(newPosition);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && containerRef.current && e.touches[0]) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const offsetX = e.touches[0].clientX - containerRect.left;
        
        // Calculate position as percentage
        const newPosition = Math.min(100, Math.max(0, (offsetX / containerWidth) * 100));
        setSliderPosition(newPosition);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  const overlayImageStyle = {
    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
  };

  const placeholderStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden rounded-xl shadow-soft bg-white aspect-[4/3] w-full max-w-3xl mx-auto animate-fadeIn"
    >
      {isProcessing ? (
        <div style={placeholderStyle} className="absolute inset-0 loading-shimmer">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 py-2 bg-white/80 backdrop-blur rounded-md text-sm font-medium text-gray-600">
              Enhancing image...
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Enhanced Image (Behind) */}
          <div className="absolute inset-0">
            <img 
              src={enhancedImage} 
              alt="Enhanced" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Original Image (Overlay with clip-path) */}
          <div className="absolute inset-0" style={overlayImageStyle}>
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-md z-10 cursor-ew-resize"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 7H14M7 0V14" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Labels */}
          <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white font-medium">
            Original
          </div>
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white font-medium">
            Enhanced
          </div>
        </>
      )}
    </div>
  );
};

export default ImageComparison;
