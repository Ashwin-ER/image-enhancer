
import { useState, useCallback, useEffect } from 'react';
import { enhanceImage, downloadImage } from '../utils/imageProcessing';
import { useToast } from './use-toast';

interface UseImageEnhancementReturn {
  originalImage: string | null;
  enhancedImage: string | null;
  isProcessing: boolean;
  error: string | null;
  processingProgress: number;
  processImage: (file: File) => void;
  downloadEnhancedImage: () => void;
  resetImages: () => void;
  reprocessImage: () => void;
  hasResult: boolean;
  processingStartTime: number | null;
  processingDuration: number | null;
}

export const useImageEnhancement = (): UseImageEnhancementReturn => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);
  const [processingDuration, setProcessingDuration] = useState<number | null>(null);
  const { toast } = useToast();

  // Function to validate image
  const validateImage = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      setError(`Unsupported file type: ${file.type}. Please use JPG, PNG, WebP, or HEIC.`);
      toast({
        title: "Unsupported format",
        description: `Please use JPG, PNG, WebP, or HEIC images.`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      setError('Image size is too large. Please use an image under 20MB.');
      toast({
        title: "File too large",
        description: "Please use an image under 20MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  // Function to enhance an image from data URL
  const enhanceImageFromDataUrl = useCallback(async (dataUrl: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStartTime(Date.now());
    setError(null);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 200);
      
      // Enhance the image
      const enhanced = await enhanceImage(dataUrl);
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setEnhancedImage(enhanced);
      setProcessingDuration(Date.now() - (processingStartTime || Date.now()));
      
      // Show success toast
      toast({
        title: "Enhancement completed",
        description: "Your image has been successfully enhanced!",
      });
    } catch (err) {
      console.error('Enhancement error:', err);
      setError('Error enhancing image. Please try another image.');
      toast({
        title: "Enhancement failed",
        description: "Error enhancing image. Please try another image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [processingStartTime, toast]);

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
      
      setOriginalFile(file);
      
      // Read the file and create a data URL
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          setOriginalImage(dataUrl);
          
          // Start the enhancement process
          await enhanceImageFromDataUrl(dataUrl);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading the image file. Please try again.');
        toast({
          title: "Reading error",
          description: "Error reading the image file. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
      console.error(err);
    }
  }, [validateImage, enhanceImageFromDataUrl, toast]);

  // Function to reprocess the current image with different parameters
  const reprocessImage = useCallback(() => {
    if (originalImage) {
      enhanceImageFromDataUrl(originalImage);
    }
  }, [originalImage, enhanceImageFromDataUrl]);

  // Function to download the enhanced image
  const downloadEnhancedImage = useCallback(() => {
    if (enhancedImage && originalFile) {
      // Use original filename but add 'enhanced' before the extension
      const origName = originalFile.name;
      const lastDot = origName.lastIndexOf('.');
      const filename = lastDot > 0 
        ? `${origName.substring(0, lastDot)}-enhanced${origName.substring(lastDot)}`
        : `${origName}-enhanced.jpg`;
        
      downloadImage(enhancedImage, filename);
      
      toast({
        title: "Download started",
        description: "Your enhanced image is downloading.",
      });
    }
  }, [enhancedImage, originalFile, toast]);

  // Function to reset the current images
  const resetImages = useCallback(() => {
    setOriginalImage(null);
    setOriginalFile(null);
    setEnhancedImage(null);
    setError(null);
    setProcessingProgress(0);
    setProcessingStartTime(null);
    setProcessingDuration(null);
  }, []);

  // Show error toasts when errors occur
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
    reprocessImage,
    hasResult,
    processingStartTime,
    processingDuration,
  };
};
