
/**
 * Advanced image processing using Zero-DCE and GAN models.
 * In a real-world application, this would involve more complex algorithms 
 * or API calls to a backend service that implements these models.
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

// Zero-DCE enhancement (Light Curve Estimation)
const enhanceZeroDCE = (imageData: ImageData): ImageData => {
  console.info('Applying Zero-DCE enhancement...');
  const data = imageData.data;
  
  // Advanced curve mapping for better exposure in low-light regions
  for (let i = 0; i < data.length; i += 4) {
    // Apply advanced curve adjustment for better shadow and highlight details
    // Using a more sophisticated curve with different parameters for RGB channels
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    // Apply curve mapping for each channel with different parameters
    // This simulates the Zero-DCE network's learned curves
    data[i] = Math.min(255, (Math.pow(r, 0.6) * 1.3) * 255); // Red channel
    data[i + 1] = Math.min(255, (Math.pow(g, 0.55) * 1.35) * 255); // Green channel (slightly higher for natural look)
    data[i + 2] = Math.min(255, (Math.pow(b, 0.5) * 1.25) * 255); // Blue channel
    
    // Apply additional local contrast enhancement
    const localContrast = 1.15;
    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * localContrast + 128));
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * localContrast + 128));
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * localContrast + 128));
  }
  
  return imageData;
};

// Enhanced GAN simulation for better details and color enhancement
const enhanceWithGAN = (imageData: ImageData): ImageData => {
  console.info('Applying GAN-inspired enhancement...');
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create a copy of the image data for reference
  const tempData = new Uint8ClampedArray(data.length);
  tempData.set(data);
  
  // Enhanced color processing with better saturation algorithm
  for (let i = 0; i < data.length; i += 4) {
    // Improved saturation algorithm based on luminance
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const saturationFactor = 0.2 + (0.1 * (1 - luminance / 255)); // More saturation for darker areas
    
    data[i] = Math.min(255, Math.max(0, data[i] + (data[i] - luminance) * saturationFactor));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (data[i + 1] - luminance) * saturationFactor));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (data[i + 2] - luminance) * saturationFactor));
  }
  
  // Simulate GAN-based detail enhancement with adaptive sharpening
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const centerIdx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) { // Only process RGB channels
        // Calculate local variance for adaptive sharpening
        let sum = 0;
        let sumSq = 0;
        let count = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4 + c;
            const val = tempData[idx];
            sum += val;
            sumSq += val * val;
            count++;
          }
        }
        
        const mean = sum / count;
        const variance = sumSq / count - mean * mean;
        
        // Apply adaptive sharpening based on local variance
        // Less sharpening for high-variance areas (already detailed)
        // More sharpening for low-variance areas (needs more detail)
        const sharpnessScale = Math.max(0.5, Math.min(2.0, 1.5 - variance / 1000));
        
        // Apply unsharp mask with adaptive strength
        const kernel = [
          [-0.1 * sharpnessScale, -0.15 * sharpnessScale, -0.1 * sharpnessScale],
          [-0.15 * sharpnessScale, 1 + 1.0 * sharpnessScale, -0.15 * sharpnessScale],
          [-0.1 * sharpnessScale, -0.15 * sharpnessScale, -0.1 * sharpnessScale]
        ];
        
        let newVal = 0;
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const sampleY = y + ky - 1;
            const sampleX = x + kx - 1;
            if (sampleY >= 0 && sampleY < height && sampleX >= 0 && sampleX < width) {
              newVal += tempData[(sampleY * width + sampleX) * 4 + c] * kernel[ky][kx];
            }
          }
        }
        
        data[centerIdx + c] = Math.min(255, Math.max(0, newVal));
      }
    }
  }
  
  return imageData;
};

// Enhanced intelligent noise reduction
const reduceNoise = (imageData: ImageData): ImageData => {
  console.info('Applying intelligent denoising...');
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Copy original data
  const tempData = new Uint8ClampedArray(data.length);
  tempData.set(data);
  
  // Advanced edge-preserving noise reduction (bilateral filter simulation)
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const centerIdx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) { // Only process RGB channels
        const centerValue = tempData[centerIdx + c];
        
        let totalWeight = 0;
        let weightedSum = 0;
        
        // 5x5 sampling window
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const sampleY = y + dy;
            const sampleX = x + dx;
            
            if (sampleY >= 0 && sampleY < height && sampleX >= 0 && sampleX < width) {
              const sampleIdx = (sampleY * width + sampleX) * 4 + c;
              const sampleValue = tempData[sampleIdx];
              
              // Spatial weight (based on distance)
              const spatialDist = dx * dx + dy * dy;
              const spatialWeight = Math.exp(-spatialDist / 4.5);
              
              // Range weight (based on color difference)
              const colorDiff = centerValue - sampleValue;
              const colorDist = colorDiff * colorDiff;
              const rangeWeight = Math.exp(-colorDist / 800);
              
              // Combined weight (bilateral filter)
              const weight = spatialWeight * rangeWeight;
              
              weightedSum += sampleValue * weight;
              totalWeight += weight;
            }
          }
        }
        
        // Apply weighted average while preserving edges
        if (totalWeight > 0) {
          // Apply noise reduction more in flat areas, less in detailed areas
          const denoiseAmount = 0.6; // Balance between denoising and detail preservation
          data[centerIdx + c] = Math.round((1 - denoiseAmount) * centerValue + denoiseAmount * (weightedSum / totalWeight));
        }
      }
    }
  }
  
  return imageData;
};

// Tone mapping function to prevent over-exposure
const applyToneMapping = (imageData: ImageData): ImageData => {
  console.info('Applying tone mapping...');
  const data = imageData.data;
  
  // Find average luminance
  let totalLuminance = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += luminance;
  }
  
  const avgLuminance = totalLuminance / (data.length / 4);
  const targetLuminance = 118; // Target mid-gray luminance
  
  // Adaptive tone mapping factor
  const adaptationFactor = Math.min(1.2, Math.max(0.8, targetLuminance / (avgLuminance + 1)));
  
  // Apply tone mapping
  for (let i = 0; i < data.length; i += 4) {
    // Reinhard-inspired tone mapping with adaptative factor
    data[i] = Math.min(255, data[i] * adaptationFactor);
    data[i + 1] = Math.min(255, data[i + 1] * adaptationFactor);
    data[i + 2] = Math.min(255, data[i + 2] * adaptationFactor);
  }
  
  return imageData;
}

// Complete enhanced image processing pipeline
export const enhanceImage = (imageUrl: string): Promise<string> => {
  console.info('Starting image enhancement process...');
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.info(`Processing image: ${img.width}x${img.height}`);
      // Step 1: Create canvas with the original image
      const canvas = createCanvasWithImage(img);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Step 2: Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Step 3: Apply Zero-DCE enhancement
      const zeroDCEResult = enhanceZeroDCE(imageData);
      
      // Step 4: Apply noise reduction
      const denoisedResult = reduceNoise(zeroDCEResult);
      
      // Step 5: Apply GAN-based enhancement
      const ganResult = enhanceWithGAN(denoisedResult);
      
      // Step 6: Apply tone mapping to prevent over-exposure
      const toneMappedResult = applyToneMapping(ganResult);
      
      // Step 7: Put the enhanced image data back to canvas
      ctx.putImageData(toneMappedResult, 0, 0);
      
      // Step 8: Return the enhanced image as data URL
      console.info('Enhancement complete!');
      resolve(canvas.toDataURL('image/jpeg', 0.95));
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
