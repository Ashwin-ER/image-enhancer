
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      console.error('File is not an image');
      return;
    }
    
    // Upload the file
    onImageUpload(file);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`relative transition-all-300 rounded-xl p-10 text-center ${
        isDragging 
          ? 'bg-blue-50 border-2 border-dashed border-blue-400 scale-[1.02]' 
          : 'glass border border-gray-200 hover:border-gray-300'
      } shadow-soft cursor-pointer group animate-fadeIn`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform-300">
          <Upload
            className={`w-10 h-10 transition-colors ${
              isDragging ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'
            }`}
          />
        </div>
        <div>
          <p className="text-lg font-medium mb-1 text-gray-700 group-hover:text-gray-900 transition-colors">
            {isDragging ? 'Drop Your Image Here' : 'Upload a Low-Light Image'}
          </p>
          <p className="text-sm text-gray-500">
            Drag & drop or click to browse your device
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
