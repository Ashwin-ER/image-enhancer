
/**
 * Advanced implementation of Zero-DCE and GAN-inspired models for low-light image enhancement.
 * This browser-based implementation simulates the core concepts of these models.
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

/**
 * Implements a Zero-DCE (Zero-reference Deep Curve Estimation) inspired algorithm
 * Zero-DCE learns to estimate pixel-wise and channel-wise curves for dynamic range adjustment
 */
const enhanceZeroDCE = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create a copy of the original data for reference
  const originalData = new Uint8ClampedArray(data);
  
  // DCE parameters (inspired by the actual Zero-DCE model)
  const alpha = 0.8;  // Controls the strength of enhancement
  const iterations = 3; // Multiple iterations for progressive enhancement
  
  // Iterate multiple times for progressive enhancement (similar to the iterative nature of Zero-DCE)
  for (let iteration = 0; iteration < iterations; iteration++) {
    // First pass: estimate a light enhancement curve using quadratic curve mapping
    for (let i = 0; i < data.length; i += 4) {
      // Current normalized pixel values (0-1)
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      
      // Apply enhanced curve mapping (quadratic mapping similar to Zero-DCE)
      // LE(x) = x + alpha * x * (1 - x)
      const enhancedR = r + (alpha * r * (1 - r));
      const enhancedG = g + (alpha * g * (1 - g));
      const enhancedB = b + (alpha * b * (1 - b));
      
      // Apply the enhanced values
      data[i] = Math.min(255, enhancedR * 255);
      data[i + 1] = Math.min(255, enhancedG * 255);
      data[i + 2] = Math.min(255, enhancedB * 255);
    }
    
    // Second pass: local contrast enhancement based on local information
    if (iteration === iterations - 1) { // Only in the last iteration
      const tempData = new Uint8ClampedArray(data);
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          
          // Simple local contrast enhancement
          for (let c = 0; c < 3; c++) {
            // Get average of surrounding pixels
            let sum = 0;
            let count = 0;
            
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  sum += tempData[(ny * width + nx) * 4 + c];
                  count++;
                }
              }
            }
            
            const avg = count > 0 ? sum / count : tempData[idx + c];
            const current = tempData[idx + c];
            
            // Enhance local contrast
            const contrastFactor = 0.2;
            data[idx + c] = Math.min(255, Math.max(0, current + contrastFactor * (current - avg)));
          }
        }
      }
    }
  }
  
  return imageData;
};

/**
 * Implements a GAN-inspired model for color restoration and detail enhancement
 * This simulates what a GAN would do to restore realistic colors and details
 */
const enhanceWithGAN = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create a copy for reference
  const tempData = new Uint8ClampedArray(data);
  
  // Step 1: Advanced color restoration (GANs are good at this)
  for (let i = 0; i < data.length; i += 4) {
    // Extract RGB
    const r = tempData[i];
    const g = tempData[i + 1];
    const b = tempData[i + 2];
    
    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Calculate color saturation
    const saturation = Math.sqrt((r - luminance) ** 2 + (g - luminance) ** 2 + (b - luminance) ** 2);
    
    // Adaptive saturation enhancement (more for low saturation, less for already saturated)
    const saturationFactor = Math.max(0.1, 0.3 * (1 - saturation / 100));
    
    // Apply saturation (more sophisticated than simple saturation adjustment)
    data[i] = Math.min(255, Math.max(0, r + (r - luminance) * saturationFactor));
    data[i + 1] = Math.min(255, Math.max(0, g + (g - luminance) * saturationFactor));
    data[i + 2] = Math.min(255, Math.max(0, b + (b - luminance) * saturationFactor));
  }
  
  // Step 2: Detail enhancement (simulate GAN's ability to recreate details)
  // Simple unsharp mask to enhance edges and details
  const kernel = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1]
  ];
  
  // Apply the kernel for detail enhancement
  const detailData = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const nx = x + kx - 1;
            const ny = y + ky - 1;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              sum += tempData[(ny * width + nx) * 4 + c] * kernel[ky][kx];
            }
          }
        }
        
        // Mix original and enhanced details (70% detail enhanced, 30% original)
        // This prevents over-sharpening which is a common issue with real GANs
        const detailFactor = 0.7;
        const originalFactor = 1 - detailFactor;
        
        data[idx + c] = Math.min(255, Math.max(0, 
          detailFactor * sum + originalFactor * tempData[idx + c]));
      }
    }
  }
  
  return imageData;
};

/**
 * Implements selective noise reduction while preserving edges
 * This simulates how GANs learn to distinguish between noise and actual details
 */
const intelligentDenoising = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create a copy for reference
  const tempData = new Uint8ClampedArray(data);
  
  // Edge detection to identify areas that should be preserved
  const edgeMap = new Float32Array(width * height);
  
  // Calculate edge map using simple Sobel filter
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      
      // Simple edge detection using luminance
      let sumX = 0, sumY = 0;
      
      for (let c = 0; c < 3; c++) {
        // Horizontal Sobel
        sumX += (
          tempData[((y-1) * width + (x-1)) * 4 + c] * -1 +
          tempData[((y-1) * width + (x+1)) * 4 + c] * 1 +
          tempData[((y) * width + (x-1)) * 4 + c] * -2 +
          tempData[((y) * width + (x+1)) * 4 + c] * 2 +
          tempData[((y+1) * width + (x-1)) * 4 + c] * -1 +
          tempData[((y+1) * width + (x+1)) * 4 + c] * 1
        );
        
        // Vertical Sobel
        sumY += (
          tempData[((y-1) * width + (x-1)) * 4 + c] * -1 +
          tempData[((y-1) * width + (x)) * 4 + c] * -2 +
          tempData[((y-1) * width + (x+1)) * 4 + c] * -1 +
          tempData[((y+1) * width + (x-1)) * 4 + c] * 1 +
          tempData[((y+1) * width + (x)) * 4 + c] * 2 +
          tempData[((y+1) * width + (x+1)) * 4 + c] * 1
        );
      }
      
      // Calculate edge magnitude and normalize to 0-1
      edgeMap[idx] = Math.min(1, Math.sqrt(sumX * sumX + sumY * sumY) / 1200);
    }
  }
  
  // Apply adaptive denoising based on edge map
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const edgeValue = edgeMap[y * width + x];
      
      // Skip strong edges (preserve them)
      if (edgeValue > 0.3) continue;
      
      // For non-edge areas, apply denoising
      for (let c = 0; c < 3; c++) {
        // Adaptive kernel size based on edge strength
        // Less filtering near edges, more in flat areas
        const kernelRadius = Math.max(1, Math.floor(2 * (1 - edgeValue)));
        
        let sum = 0;
        let weight = 0;
        
        // Apply weighted average
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
          for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
            const nx = x + kx;
            const ny = y + ky;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              // Calculate spatial weight (closer pixels matter more)
              const spatialWeight = 1 / (1 + Math.sqrt(kx*kx + ky*ky));
              
              // Calculate intensity weight (similar pixels matter more)
              const pixelDiff = Math.abs(tempData[(ny * width + nx) * 4 + c] - tempData[idx + c]);
              const intensityWeight = Math.exp(-pixelDiff / 30);
              
              // Combined weight
              const totalWeight = spatialWeight * intensityWeight;
              
              sum += tempData[(ny * width + nx) * 4 + c] * totalWeight;
              weight += totalWeight;
            }
          }
        }
        
        // Normalize and blend with original (edge-aware blending)
        const filteredValue = weight > 0 ? sum / weight : tempData[idx + c];
        const blendFactor = Math.max(0.3, 1 - edgeValue * 2); // Less blending near edges
        
        data[idx + c] = Math.round(filteredValue * blendFactor + tempData[idx + c] * (1 - blendFactor));
      }
    }
  }
  
  return imageData;
};

/**
 * Implements tone mapping to handle extreme brightness after enhancement
 * Prevents over-exposure while maintaining global contrast
 */
const toneMapping = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  
  // Find the maximum and average brightness
  let maxBrightness = 0;
  let totalBrightness = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const brightness = (r + g + b) / 3;
    maxBrightness = Math.max(maxBrightness, brightness);
    totalBrightness += brightness;
  }
  
  const avgBrightness = totalBrightness / (data.length / 4);
  
  // Only apply tone mapping if the image is bright enough
  if (avgBrightness > 100 || maxBrightness > 240) {
    // Parameters for the tone mapping curve
    const exposure = 1.0;
    const gamma = 1.0;
    
    // Apply Reinhard tone mapping operator
    for (let i = 0; i < data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        // Normalize to 0-1 range
        const normalizedValue = data[i + c] / 255;
        
        // Apply exposure adjustment
        const exposureAdjusted = normalizedValue * exposure;
        
        // Apply Reinhard operator: x / (1 + x)
        const toneMapped = exposureAdjusted / (1 + exposureAdjusted);
        
        // Apply gamma correction
        const gammaCorrected = Math.pow(toneMapped, 1 / gamma);
        
        // Convert back to 0-255 range
        data[i + c] = Math.min(255, Math.max(0, Math.round(gammaCorrected * 255)));
      }
    }
  }
  
  return imageData;
};

/**
 * Comprehensive image enhancement pipeline combining Zero-DCE and GAN-inspired models
 */
export const enhanceImage = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        console.log("Starting image enhancement process...");
        
        // Step 1: Create canvas with the original image
        const canvas = createCanvasWithImage(img);
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Step 2: Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(`Processing image: ${canvas.width}x${canvas.height}`);
        
        // Step 3: Apply Zero-DCE for initial curve-based enhancement
        console.log("Applying Zero-DCE enhancement...");
        const zeroDceResult = enhanceZeroDCE(imageData);
        
        // Step 4: Apply GAN-inspired detail and color enhancement
        console.log("Applying GAN-inspired enhancement...");
        const ganResult = enhanceWithGAN(zeroDceResult);
        
        // Step 5: Apply intelligent denoising
        console.log("Applying intelligent denoising...");
        const denoisedResult = intelligentDenoising(ganResult);
        
        // Step 6: Apply tone mapping to handle extreme brightness
        console.log("Applying tone mapping...");
        const toneMappedResult = toneMapping(denoisedResult);
        
        // Step 7: Put the enhanced image data back to canvas
        ctx.putImageData(toneMappedResult, 0, 0);
        
        // Step 8: Return the enhanced image as data URL
        console.log("Enhancement complete!");
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (error) {
        console.error("Error during image enhancement:", error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error("Error loading image:", error);
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
