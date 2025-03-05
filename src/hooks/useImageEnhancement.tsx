
import { useState, useCallback } from 'react';
import { enhanceImage, downloadImage } from '../utils/imageProcessing';

interface UseImageEnhancementReturn {
  originalImage: string | null;
  enhancedImage: string | null;
  isProcessing: boolean;
  error: string | null;
  processImage: (file: File) => void;
  downloadEnhancedImage: () => void;
  resetImages: () => void;
  hasResult: boolean;
}

export const useImageEnhancement = (): UseImageEnhancementReturn => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to process an uploaded image
  const processImage = useCallback(async (file: File) => {
    try {
      setError(null);
      setIsProcessing(true);
      
      // Read the file and create a data URL
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          setOriginalImage(dataUrl);
          
          // Simulate a delay to make the processing seem more realistic
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Enhance the image
          try {
            const enhanced = await enhanceImage(dataUrl);
            setEnhancedImage(enhanced);
          } catch (err) {
            setError('Error enhancing image. Please try another image.');
            console.error(err);
          } finally {
            setIsProcessing(false);
          }
        }
      };
      
      reader.onerror = () => {
        setError('Error reading the image file. Please try again.');
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
      console.error(err);
    }
  }, []);

  // Function to download the enhanced image
  const downloadEnhancedImage = useCallback(() => {
    if (enhancedImage) {
      const filename = 'enhanced-image.jpg';
      downloadImage(enhancedImage, filename);
    }
  }, [enhancedImage]);

  // Function to reset the current images
  const resetImages = useCallback(() => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
  }, []);

  // Determine if we have a result to show
  const hasResult = !!enhancedImage && !!originalImage;

  return {
    originalImage,
    enhancedImage,
    isProcessing,
    error,
    processImage,
    downloadEnhancedImage,
    resetImages,
    hasResult,
  };
};
