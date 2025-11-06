import React, { useEffect } from 'react';

function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // يختفي بعد 3 ثواني

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slideIn">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
        ${type === 'success' 
          ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
          : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
        }
        min-w-[300px] max-w-md
      `}>
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${type === 'success' 
            ? 'bg-green-100 dark:bg-green-800/50' 
            : 'bg-red-100 dark:bg-red-800/50'
          }
        `}>
          {type === 'success' ? (
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Message */}
        <p className={`
          text-sm font-medium flex-1
          ${type === 'success' 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
          }
        `}>
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`
            flex-shrink-0 p-1 rounded-lg transition-colors
            ${type === 'success'
              ? 'hover:bg-green-100 dark:hover:bg-green-800/50 text-green-600 dark:text-green-400'
              : 'hover:bg-red-100 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400'
            }
          `}
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Animation in CSS file or index.css */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Toast;