
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, FileImage } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
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
    setDragCounter(0);
    
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
          ? 'bg-indigo-50 border-2 border-dashed border-indigo-400 scale-[1.02] shadow-xl'
          : 'glass border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'
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
        <div className={`w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-all-300 ${
          isDragging 
            ? 'bg-indigo-100' 
            : 'bg-gray-50 group-hover:bg-indigo-50'
        }`}>
          {isDragging ? (
            <FileImage className="w-12 h-12 text-indigo-500" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          )}
        </div>
        
        <div>
          <p className={`text-xl font-medium mb-2 transition-colors ${
            isDragging 
              ? 'text-indigo-700' 
              : 'text-gray-700 group-hover:text-indigo-700'
          }`}>
            {isDragging ? 'Drop Your Image Here' : 'Upload a Low-Light Image'}
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {isDragging 
              ? 'Release to enhance your image' 
              : 'Drag & drop an image or click to browse your device'}
          </p>
        </div>
        
        {/* Supported formats */}
        <div className="mt-2 text-xs text-gray-400">
          Supported formats: JPG, PNG, WebP, HEIC
        </div>
        
        {/* Visual effect for drag area */}
        <div className={`absolute inset-4 border-2 border-dashed rounded-lg transition-all-300 ${
          isDragging 
            ? 'border-indigo-300 scale-100 opacity-100' 
            : 'border-transparent scale-95 opacity-0'
        }`}></div>
      </div>
    </div>
  );
};

export default ImageUploader;
