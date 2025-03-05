
import React from 'react';
import { Download, ArrowLeft, RefreshCw, Share2, Repeat, ZoomIn } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface EnhancementControlsProps {
  isProcessing: boolean;
  hasResult: boolean;
  onDownload: () => void;
  onReset: () => void;
  onReprocess?: () => void;
}

const EnhancementControls: React.FC<EnhancementControlsProps> = ({
  isProcessing,
  hasResult,
  onDownload,
  onReset,
  onReprocess,
}) => {
  const { toast } = useToast();

  // Enhanced share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Enhanced Image by Image Enhancer',
          text: 'Check out this enhanced image from Image Enhancer!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Link copied to clipboard!",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 w-full animate-fadeIn">
      {hasResult && (
        <>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-lg shadow-soft bg-white text-gray-800 hover:bg-gray-50 hover:shadow-soft-lg transition-all-300 border border-gray-100"
            onClick={onReset}
            disabled={isProcessing}
            aria-label="Try another image"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Try Another Image</span>
          </button>

          <button
            className="flex items-center gap-2 px-5 py-3 rounded-lg shadow-soft bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md transition-all-300"
            onClick={onDownload}
            disabled={isProcessing}
            aria-label="Download enhanced image"
          >
            <Download className="w-4 h-4" />
            <span>Download Enhanced</span>
          </button>
          
          {onReprocess && (
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-lg shadow-soft bg-white text-gray-800 hover:bg-gray-50 hover:shadow-soft-lg transition-all-300 border border-gray-100"
              onClick={onReprocess}
              disabled={isProcessing}
              aria-label="Re-enhance with different parameters"
            >
              <Repeat className="w-4 h-4" />
              <span>Re-enhance</span>
            </button>
          )}
          
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-lg shadow-soft bg-white text-gray-800 hover:bg-gray-50 hover:shadow-soft-lg transition-all-300 border border-gray-100"
            onClick={handleShare}
            disabled={isProcessing}
            aria-label="Share enhanced image"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 px-5 py-3 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Enhancing Image...</span>
        </div>
      )}
    </div>
  );
};

export default EnhancementControls;
