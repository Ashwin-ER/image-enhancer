
import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import ImageUploader from '../components/ImageUploader';
import ImageComparison from '../components/ImageComparison';
import EnhancementControls from '../components/EnhancementControls';
import { useImageEnhancement } from '../hooks/useImageEnhancement';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const { 
    originalImage, 
    enhancedImage, 
    isProcessing, 
    error, 
    processImage, 
    downloadEnhancedImage,
    resetImages,
    hasResult
  } = useImageEnhancement();
  
  const { toast } = useToast();

  // Show error toasts when errors occur
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AnimatedBackground />
      
      <header className="relative z-10 px-6 pt-8 pb-6 flex flex-col items-center">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 animate-slideUp">Lightwave Enhancer</h1>
          <p className="text-gray-600 max-w-lg mx-auto animate-slideUp" style={{ animationDelay: '100ms' }}>
            Transform dark and low-light images into stunning, vibrant photos with our AI-powered enhancement technology.
          </p>
        </div>
      </header>
      
      <main className="relative z-10 flex-grow flex flex-col items-center px-6 pb-12">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Content depends on app state */}
          {!originalImage ? (
            <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
              <ImageUploader onImageUpload={processImage} />
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>We use advanced Zero-DCE and GAN technology to enhance your images.</p>
                <p className="mt-1">Your photos are processed entirely in your browser and are never uploaded to any server.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
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
              />
            </div>
          )}
        </div>
      </main>
      
      <footer className="relative z-10 py-6 w-full border-t border-gray-100">
        <div className="container">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Lightwave Enhancer. Enhance your low-light images with state-of-the-art AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
