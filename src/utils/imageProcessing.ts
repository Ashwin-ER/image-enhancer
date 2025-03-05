
/**
 * This is an enhanced version of image processing.
 * In a real-world application, this would involve more complex algorithms 
 * or API calls to a backend service that implements Zero-DCE and GAN models.
 */

// Helper function to create a canvas element with the given image
const createCanvasWithImage = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(image, 0, 0);
  }
  return canvas;
};

// Advanced Zero-DCE enhancement (improved algorithm for demo)
const enhanceZeroDCE = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  
  // Enhanced brightness and contrast adjustment using curve mapping
  for (let i = 0; i < data.length; i += 4) {
    // Apply a more sophisticated curve adjustment for better shadow details
    data[i] = Math.min(255, Math.pow(data[i] / 255, 0.5) * 255 * 1.2); // Red
    data[i + 1] = Math.min(255, Math.pow((data[i + 1] / 255), 0.5) * 255 * 1.2); // Green
    data[i + 2] = Math.min(255, Math.pow((data[i + 2] / 255), 0.5) * 255 * 1.2); // Blue
    
    // Apply additional contrast enhancement
    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128));
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128));
  }
  
  return imageData;
};

// Enhanced GAN simulation for better details and color enhancement
const enhanceWithGAN = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Enhanced color processing
  for (let i = 0; i < data.length; i += 4) {
    // Improved saturation algorithm
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const saturationFactor = 0.25; // Slightly higher for better color pop
    
    data[i] = Math.min(255, data[i] + (data[i] - avg) * saturationFactor);
    data[i + 1] = Math.min(255, data[i + 1] + (data[i + 1] - avg) * saturationFactor);
    data[i + 2] = Math.min(255, data[i + 2] + (data[i + 2] - avg) * saturationFactor);
    
    // Advanced local contrast enhancement
    const contrastFactor = 1.15;
    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrastFactor + 128));
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrastFactor + 128));
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrastFactor + 128));
  }
  
  // Simulate sharpening effect (like what GANs often do)
  const tempData = new Uint8ClampedArray(data.length);
  tempData.set(data);
  
  // Simple unsharp mask
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const centerIdx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) { // Only process RGB channels
        // Apply a simple sharpening kernel
        const sum = 
          -0.1 * tempData[((y-1) * width + x-1) * 4 + c] +
          -0.1 * tempData[((y-1) * width + x) * 4 + c] +
          -0.1 * tempData[((y-1) * width + x+1) * 4 + c] +
          -0.1 * tempData[(y * width + x-1) * 4 + c] +
          1.8 * tempData[centerIdx + c] +
          -0.1 * tempData[(y * width + x+1) * 4 + c] +
          -0.1 * tempData[((y+1) * width + x-1) * 4 + c] +
          -0.1 * tempData[((y+1) * width + x) * 4 + c] +
          -0.1 * tempData[((y+1) * width + x+1) * 4 + c];
        
        data[centerIdx + c] = Math.min(255, Math.max(0, sum));
      }
    }
  }
  
  return imageData;
};

// Enhanced noise reduction function to simulate GAN denoising
const reduceNoise = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Simple noise reduction with a 3x3 box blur
  const tempData = new Uint8ClampedArray(data.length);
  tempData.set(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) { // Only process RGB channels
        let sum = 0;
        
        // Calculate average of surrounding pixels
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += tempData[((y + dy) * width + (x + dx)) * 4 + c];
          }
        }
        
        // Apply weighted blend between original and blurred (70% original, 30% blur)
        const blurred = sum / 9;
        data[idx + c] = Math.round(0.7 * tempData[idx + c] + 0.3 * blurred);
      }
    }
  }
  
  return imageData;
};

// Simulate the complete enhancement process with improved algorithms
export const enhanceImage = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Step 1: Create canvas with the original image
      const canvas = createCanvasWithImage(img);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Step 2: Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Step 3: Apply Zero-DCE enhancement with improved algorithm
      const zeroDceResult = enhanceZeroDCE(imageData);
      
      // Step 4: Apply noise reduction (simulating GAN denoising)
      const denoisedResult = reduceNoise(zeroDceResult);
      
      // Step 5: Apply GAN refinement with improved details and colors
      const ganResult = enhanceWithGAN(denoisedResult);
      
      // Step 6: Put the enhanced image data back to canvas
      ctx.putImageData(ganResult, 0, 0);
      
      // Step 7: Return the enhanced image as data URL
      resolve(canvas.toDataURL('image/jpeg', 0.95)); // Higher quality output
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

// Function to download an image
export const downloadImage = (dataUrl: string, filename: string = 'enhanced-image.jpg'): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
