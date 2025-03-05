
import { useState, useCallback, useEffect } from 'react';
import { enhanceImage, downloadImage } from '../utils/imageProcessing';

interface UseImageEnhancementReturn {
  originalImage: string | null;
  enhancedImage: string | null;
  isProcessing: boolean;
  error: string | null;
  processingProgress: number;
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
  const [processingProgress, setProcessingProgress] = useState(0);

  // Function to validate image
  const validateImage = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      setError(`Unsupported file type: ${file.type}. Please use JPG, PNG, WebP, or HEIC.`);
      return false;
    }
    
    // Check file size (max 15MB)
    const maxSize = 15 * 1024 * 1024; // 15MB in bytes
    if (file.size > maxSize) {
      setError('Image size is too large. Please use an image under 15MB.');
      return false;
    }
    
    return true;
  };

  // Function to process an uploaded image
  const processImage = useCallback(async (file: File) => {
    try {
      // Reset any previous errors and states
      setError(null);
      setEnhancedImage(null);
      setProcessingProgress(0);
      
      // Validate the image file
      if (!validateImage(file)) {
        return;
      }
      
      setIsProcessing(true);
      
      // Read the file and create a data URL
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          setOriginalImage(dataUrl);
          
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setProcessingProgress(prev => {
              const newProgress = prev + Math.random() * 5;
              return newProgress >= 90 ? 90 : newProgress;
            });
          }, 200);
          
          // Enhance the image
          try {
            const enhanced = await enhanceImage(dataUrl);
            clearInterval(progressInterval);
            setProcessingProgress(100);
            setEnhancedImage(enhanced);
          } catch (err) {
            clearInterval(progressInterval);
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
    setProcessingProgress(0);
  }, []);

  // Determine if we have a result to show
  const hasResult = !!enhancedImage && !!originalImage;

  return {
    originalImage,
    enhancedImage,
    isProcessing,
    error,
    processingProgress,
    processImage,
    downloadEnhancedImage,
    resetImages,
    hasResult,
  };
};
