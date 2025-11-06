import React, { useState, useEffect } from 'react';
import DeleteConfirmation from './DeleteConfirmation.jsx';

function NoteDetails({ note, isOpen, onClose, onDelete, onUpdate, categories = [] }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: '',
    content: '',
    category_id: null,
    category: ''
  });

  useEffect(() => {
    if (note) {
      setEditedNote({
        title: note.title || '',
        content: note.content || '',
        category_id: note.category_id,
        category: note.category_name || note.category || ''
      });
      setIsEditMode(false); 
    }
  }, [note, isOpen]);

  if (!isOpen || !note) return null;

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditedNote({
      title: note.title,
      content: note.content,
      category: note.category_name || note.category
    });
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    // التحقق من البيانات
    if (!editedNote.title.trim() || !editedNote.content.trim()) {
      alert('Title and Content are required!');
      return;
    }

    // استدعاء الـ parent function
     onUpdate(note.id, {
    title: editedNote.title,
    content: editedNote.content,
    category_id: editedNote.category_id
    });
    setIsEditMode(false);
  };

  const handleConfirmDelete = () => {
    onDelete(note.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div className="bg-white dark:bg-background-dark rounded-xl shadow-lg dark:shadow-2xl max-w-[700px] w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto animate-scaleIn">
          
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Note' : 'Note Details'}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-150"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600 dark:text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
            
            {/* Image */}
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80")'
              }}
            ></div>

            {isEditMode ? (
              // Edit Mode - Form Fields
              <>
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedNote.title}
                    onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3"
                    placeholder="Note title"
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={editedNote.category_id}
                    onChange={(e) => setEditedNote({ ...editedNote, category_id: parseInt(e.target.value) })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white p-3"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editedNote.content}
                    onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                    rows="8"
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3"
                    placeholder="Write your note content..."
                  />
                </div>
              </>
            ) : (
              // View Mode - Display Only
              <>
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                    {note.title}
                  </h3>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-semibold text-sm border border-primary/20">
                    {note.category_name || note.category}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <p className="text-base text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                </div>

                {/* Date */}
                {note.created_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Created At
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-4 z-10">
            {isEditMode ? (
              // Edit Mode Buttons
              <>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-all duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </>
            ) : (
              // View Mode Buttons
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-all duration-150"
                >
                  Close
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg shadow-sm hover:bg-red-100 dark:hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-background-dark transition-all duration-150 inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>

                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-all duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        noteTitle={note.title}
      />
    </>
  );
}

export default NoteDetails;
