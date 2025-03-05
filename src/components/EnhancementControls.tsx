
import React from 'react';
import { Download, ArrowLeft, RefreshCw } from 'lucide-react';

interface EnhancementControlsProps {
  isProcessing: boolean;
  hasResult: boolean;
  onDownload: () => void;
  onReset: () => void;
}

const EnhancementControls: React.FC<EnhancementControlsProps> = ({
  isProcessing,
  hasResult,
  onDownload,
  onReset,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-fadeIn">
      {hasResult && (
        <>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-lg shadow-soft bg-white text-gray-800 hover:shadow-soft-lg transition-all-300 border border-gray-100"
            onClick={onReset}
            disabled={isProcessing}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Try Another Image</span>
          </button>

          <button
            className="flex items-center gap-2 px-5 py-3 rounded-lg shadow-soft bg-primary text-primary-foreground hover:bg-primary/90 transition-all-300"
            onClick={onDownload}
            disabled={isProcessing}
          >
            <Download className="w-4 h-4" />
            <span>Download Enhanced Image</span>
          </button>
        </>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 px-5 py-3 rounded-lg bg-muted text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Enhancing Image...</span>
        </div>
      )}
    </div>
  );
};

export default EnhancementControls;
