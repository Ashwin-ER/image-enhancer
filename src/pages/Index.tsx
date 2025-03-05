
import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import ImageUploader from '../components/ImageUploader';
import ImageComparison from '../components/ImageComparison';
import EnhancementControls from '../components/EnhancementControls';
import { useImageEnhancement } from '../hooks/useImageEnhancement';
import { GraduationCap, Zap, Shield, Moon, Sun, Clock, LineChart } from 'lucide-react';

const Index = () => {
  const { 
    originalImage, 
    enhancedImage, 
    isProcessing, 
    error, 
    processImage, 
    downloadEnhancedImage,
    resetImages,
    reprocessImage,
    hasResult,
    processingDuration
  } = useImageEnhancement();
  
  // Format processing time nicely
  const formatProcessingTime = () => {
    if (!processingDuration) return null;
    return `${(processingDuration / 1000).toFixed(1)} seconds`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AnimatedBackground />
      
      <header className="relative z-10 px-6 pt-12 pb-8 flex flex-col items-center">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <div className="relative">
                <Moon className="w-8 h-8 text-indigo-900 absolute opacity-70" />
                <Sun className="w-8 h-8 text-yellow-500 absolute ml-4 mt-2" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900 animate-slideUp bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-800">
            Image Enhancer
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg animate-slideUp" style={{ animationDelay: '100ms' }}>
            Transform dark and low-light images into stunning, vibrant photos with our
            AI-powered enhancement technology.
          </p>
        </div>
      </header>
      
      <main className="relative z-10 flex-grow flex flex-col items-center px-6 pb-12">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Content depends on app state */}
          {!originalImage ? (
            <>
              <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
                <ImageUploader onImageUpload={processImage} />
                
                <div className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
                  <p>We use advanced Zero-DCE and GAN technology to enhance your images while preserving natural colors and details.</p>
                  <p className="mt-1">Your photos are processed entirely in your browser and are never uploaded to any server.</p>
                </div>
              </div>
              
              {/* Features section */}
              <div className="mt-24 animate-slideUp" style={{ animationDelay: '300ms' }}>
                <h2 className="text-2xl font-semibold text-center mb-10 text-gray-800">Why Choose Image Enhancer?</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-800">Advanced Processing</h3>
                    <p className="text-gray-600">Our AI-powered algorithms enhance low-light images while preserving natural details.</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-800">Privacy First</h3>
                    <p className="text-gray-600">All processing happens in your browser. Your images never leave your device.</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <GraduationCap className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-800">Intelligent Enhancement</h3>
                    <p className="text-gray-600">Our system analyzes each image uniquely to apply the perfect enhancement parameters.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              {/* Processing time display when available */}
              {processingDuration && hasResult && !isProcessing && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Enhanced in {formatProcessingTime()}</span>
                  </div>
                </div>
              )}
              
              {/* Image comparison component */}
              <ImageComparison
                originalImage={originalImage}
                enhancedImage={enhancedImage || originalImage}
                isProcessing={isProcessing}
              />
              
              {/* Enhancement controls */}
              <EnhancementControls
                isProcessing={isProcessing}
                hasResult={hasResult}
                onDownload={downloadEnhancedImage}
                onReset={resetImages}
                onReprocess={reprocessImage}
              />
              
              {/* Explanation of what happened */}
              {hasResult && !isProcessing && (
                <div className="bg-white rounded-lg p-6 shadow-soft max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-indigo-600" />
                    How We Enhanced Your Image
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We applied our AI-powered Zero-DCE algorithm to properly expose the dark regions while 
                    maintaining natural colors, followed by a GAN-based enhancement to improve details and reduce noise.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>The enhancement process included:</p>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Advanced curve mapping for shadow recovery</li>
                      <li>Intelligent local contrast enhancement</li> 
                      <li>Detail enhancement with edge preservation</li>
                      <li>Smart noise reduction with bilateral filtering</li>
                      <li>Adaptive tone mapping to prevent over-exposure</li>
                      <li>Subtle color enhancement for natural results</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="relative z-10 py-8 w-full border-t border-gray-100">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left text-sm text-gray-500">
              © {new Date().getFullYear()} Image Enhancer. Transforming low-light images with AI.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#terms" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
              <a href="#about" className="text-sm text-gray-500 hover:text-gray-700">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
