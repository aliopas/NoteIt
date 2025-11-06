import React, { useState } from 'react';

function AddNote(props) {
    const [errors, setErrors] = useState({ title: '', content: '', category: '' });

    const validate = () => {
        const newErrors = { title: '', content: '', category: '' };
        let isValid = true;

        if (!props.notesend.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }
        if (!props.notesend.content.trim()) {
            newErrors.content = 'Content is required';
            isValid = false;
        }
        if (!props.notesend.category.trim()) {
            newErrors.category = 'Category is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (validate()) {
            props.handleSaveNote();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white dark:bg-background-dark rounded-xl shadow-lg dark:shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Create New Note
                        </h1>

                        <form className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="note-title">
                                    Title
                                </label>
                                <input
                                    className={`block w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white p-2`}
                                    id="note-title"
                                    type="text"
                                    value={props.notesend.title}
                                    onChange={(e) => props.setNotesend({ ...props.notesend, title: e.target.value })}
                                    placeholder="Give your note a title"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="note-content">
                                    Content
                                </label>
                                <textarea
                                    className={`block w-full rounded-lg border ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white p-2`}
                                    id="note-content"
                                    rows="8"
                                    value={props.notesend.content}
                                    onChange={(e) => props.setNotesend({ ...props.notesend, content: e.target.value })}
                                    placeholder="Start writing your note..."
                                ></textarea>
                                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="note-category">
                                    Category
                                </label>
                                <select
                                    className={`block w-full rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white p-2`}
                                    id="note-category"
                                    value={props.notesend.category}
                                    onChange={(e) => props.setNotesend({ ...props.notesend, category: e.target.value })}
                                >
                                    <option value="">Select category</option>
                                    {props.categoryget.map((cat) => (
                                        <option key={cat.id || cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>
                        </form>
                    </div>

                    {/* Buttons */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end items-center gap-4">
                        <button
                            onClick={() => props.setIsAddNotsOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            type="button"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            type="button"
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNote;
