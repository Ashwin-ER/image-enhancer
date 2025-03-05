
import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, MoveHorizontal } from 'lucide-react';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
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

    // Handle escape key for exiting fullscreen
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDragging, isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const overlayImageStyle = {
    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
  };

  const placeholderStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/90" 
    : "relative overflow-hidden rounded-xl shadow-soft bg-white aspect-[4/3] w-full max-w-3xl mx-auto animate-fadeIn";

  return (
    <>
      {/* Fullscreen overlay background */}
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-black/80" onClick={toggleFullscreen}></div>
      )}
      
      <div 
        ref={containerRef} 
        className={containerClasses}
      >
        {isProcessing ? (
          <div style={placeholderStyle} className="absolute inset-0 loading-shimmer">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 bg-white/80 backdrop-blur rounded-md text-sm font-medium text-gray-600 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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
                className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
              />
            </div>
            
            {/* Original Image (Overlay with clip-path) */}
            <div className="absolute inset-0" style={overlayImageStyle}>
              <img 
                src={originalImage} 
                alt="Original" 
                className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
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
                  <MoveHorizontal className="w-4 h-4 text-gray-700" />
                </div>
              </div>
            </div>
            
            {/* Fullscreen Toggle Button */}
            <button 
              className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors z-20"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            
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
    </>
  );
};

export default ImageComparison;
