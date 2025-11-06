import React, { useState, useEffect, useRef } from 'react';

function SearchOverlay({ isOpen, onClose, notes, onSelectNote }) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  // Focus على Input لما يفتح
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // إغلاق لما يدوس ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // فلترة النوتات حسب البحث
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4 pointer-events-none">
        <div className="w-full max-w-2xl pointer-events-auto animate-slideDown">
          
          {/* Search Box */}
          <div className="bg-white dark:bg-background-dark rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* Input Section */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined text-2xl text-gray-500 dark:text-gray-400">
                search
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search notes by title, content, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl text-gray-500 dark:text-gray-400">
                    close
                  </span>
                </button>
              )}
            </div>

            {/* Results Section */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery === '' ? (
                // Empty State - قبل البحث
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                    search
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Start typing to search your notes
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
                    Search by title, content, or category
                  </p>
                </div>
              ) : filteredNotes.length === 0 ? (
                // No Results
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                    search_off
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    No notes found for "{searchQuery}"
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
                    Try a different search term
                  </p>
                </div>
              ) : (
                // Results List
                <div className="py-2">
                  {filteredNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => {
                        onSelectNote(note);
                        onClose();
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      {/* Icon */}
                      <span className="material-symbols-outlined text-2xl text-primary mt-1 flex-shrink-0">
                        description
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {note.title}
                        </h3>

                        {/* Content Preview */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {note.content}
                        </p>

                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20">
                            {note.category_name}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(note.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mt-1">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Keyboard Shortcuts */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">
                    ESC
                  </kbd>
                  to close
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        /* Custom Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #D6D3D1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #37666d;
        }

        :global(.dark) .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #44403C;
        }

        :global(.dark) .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #37666d;
        }
      `}</style>
    </>
  );
}

export default SearchOverlay;