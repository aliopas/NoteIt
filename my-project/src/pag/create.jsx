import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams} from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SearchOverlay from '../components/Search Overlay.jsx';
import AddingCategory from "../components/AddingCategory.jsx";
import AddNote from "../components/AddNote.jsx";
import Toast from '../components/Toast.jsx';
import NoteDetails from "../components/NoteDetails.jsx";
import { updateNote, createCategory, createNote,deleteNote} from '../utils/noteApi.js';
import { useUserData } from '../hooks/useUserData.js';
import { useCurrentUser } from '../hooks/useAuth.js';

function Create() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddNotsOpen, setIsAddNotsOpen] = useState(false);
    const [categoryName, setCategoryName] = useState(''); 
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [showSearch, setShowSearch] = useState(false);
    const [notesend, setNotesend] = useState({
        title: '',
        content: '',
        category: ''
    });
    const [isNoteDetailsOpen, setIsNoteDetailsOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    // ✅ 2. كل الـ Hooks
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    
    const { isError: userError } = useCurrentUser();
    
    const {
        data: userData = { categories: [], notes: [] },
        isLoading,
        isError,
        refetch,
    } = useUserData();

    // ✅ 3. Variables
    const categoryget = userData.categories || [];
    const allNotes = userData.notes || [];
    const activeCategory = searchParams.get("category") || categoryget?.[0]?.name;

    // ✅ 4. كل الـ useEffect
    useEffect(() => {
        if (userError) {
            localStorage.clear();
            sessionStorage.clear();
            queryClient.clear();
            
            window.history.pushState(null, "", window.location.href);
            window.onpopstate = function () {
                window.history.pushState(null, "", window.location.href);
            };
            
            window.location.href = "/login";
        }
    }, [userError, queryClient]);

    useEffect(() => {
        if (categoryget.length > 0 && !notesend.category) {
            setNotesend(prev => ({
                ...prev,
                category: categoryget[0]?.name || ''
            }));
        }
    }, [categoryget, notesend.category]);

    // ✅ 5. useMemo
    const curntnotes = useMemo(() => {
        if (!activeCategory) return [];
        return allNotes.filter(
            (note) => note.category_name?.toLowerCase() === activeCategory?.toLowerCase()
        );
    }, [allNotes, activeCategory]);

    // ✅ 6. كل الـ Functions
    const handleUpdateNote = async (noteId, updatedData) => {
        try {
            await updateNote(noteId, updatedData);
            refetch();
            setToastMessage('Note updated successfully!');
            setToastType('success');
            setShowToast(true);
        } catch (err) {
            console.error('Error updating note:', err);
            setToastMessage('Failed to update note!');
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleCloseModal = () => {
        setIsNoteDetailsOpen(false);
        setSelectedNote(null);
    };

    const handleViewNote = (note) => {
        setSelectedNote(note);
        setIsNoteDetailsOpen(true);
    };

    const handleSaveCategory = async () => {
        if (categoryName.trim()) {
            try {
                await createCategory(categoryName);
                refetch();
                setCategoryName("");
                setIsModalOpen(false);
                
                setToastMessage('Category created successfully!');
                setToastType('success');
                setShowToast(true);
            } catch (err) {
                console.error("Error saving category:", err);
                setToastMessage('Failed to create category!');
                setToastType('error');
                setShowToast(true);
            }
        }
    };

    const handleCategoryClick = (category) => {
        setSearchParams({ category });
    };

    const handleSaveNote = async () => {
        if (notesend.title.trim() && notesend.content.trim()) {
            try {
                await createNote(notesend);
                refetch();
                
                setNotesend({ title: '', content: '', category: categoryget[0]?.name || '' });
                setIsAddNotsOpen(false);
                
                setToastMessage('Note created successfully!');
                setToastType('success');
                setShowToast(true);
            } catch (err) {
                console.error("Error saving note:", err);
                setToastMessage('Failed to create note!');
                setToastType('error');
                setShowToast(true);
            }
        }
    };

    const onDelete = async (noteId) => {
        try {
            await deleteNote(noteId);
            refetch();
            handleCloseModal();
            setToastMessage('Note deleted successfully!');
            setToastType('success');
            setShowToast(true);
        } catch (err) {
            console.error('Error deleting note:', err);
            setToastMessage('Failed to delete note!');
            setToastType('error');
            setShowToast(true);
        }
    };

    // ✅ 7. Conditional Returns
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                        Loading your notes and categories...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) return <p>Error loading data!</p>;

    // ✅ 8. Main Return
    return (
        <div className="flex flex-col min-h-screen">
            <Header onSearchClick={() => setShowSearch(true)} />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-40 py-10">
                <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                    My Notes
                </h1>
                
                <div className="relative mt-6">                     
                    <input 
                        readOnly
                        onClick={() => setIsAddNotsOpen(true)}
                        className="w-full h-12 pl-4 pr-32 rounded-lg bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer" 
                        placeholder="Create a new note..."
                    />                     
                    <button                         
                        onClick={() => setIsAddNotsOpen(true)}                         
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-white hover:bg-primary/90">                         
                        <span className="material-symbols-outlined text-xl"> add </span>                         
                        <span className="text-sm font-medium">Add Note</span>                     
                    </button>                 
                </div>
                
                <div className="mb-8 mt-8">
                    <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white mb-4">Categories</h2>
                    <div className="flex flex-wrap gap-4">
                        {categoryget.map((cat, index) => (
                            <button 
                                key={index}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 
                                    ${activeCategory === cat.name ? "bg-primary text-white" : "bg-primary/20 dark:bg-primary/30 text-primary hover:bg-primary/30 dark:hover:bg-primary/40"} 
                                    text-sm font-medium leading-normal`}
                            >
                                {cat.name}
                            </button>
                        ))}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/20 dark:bg-primary/30 text-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-sm font-medium leading-normal gap-2"
                        >
                            <span className="material-symbols-outlined text-xl"> add </span>
                            <span>New Category</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {curntnotes.map((note) => (
                        <div key={note.id} className="flex flex-col gap-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-4">
                            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA--RIk2K2VpdQMfgr1vMndPreWw1sA259YTeWi6MYPtAtcx2ypLbWnVKGEulRWMse5xtQ0CSOUyDq-mPKl66NTMIxVt6KiUV3zbVT7-zRh5QBSgUPeTB5aTQG22ZWiaTMFhM1Z4QRJ8Q_NWUq3DGmWW_Xrd4JhBMQC-NS1XVeo8cjYFuqJyyI1UyrWtzrd-f4nnGUalEDckEavAnjybIeav5cEWnDU-KlZMoT6Lqll-m-hGJUcGsioXmWFy4ePNcBjb73LIRftRg")'}}></div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center mt-auto">
                                    <p className="text-base font-bold leading-tight text-stone-900 dark:text-white">{note.title}</p>
                                    <button 
                                        onClick={() => handleViewNote(note)}
                                        className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/20 dark:bg-primary/30 text-sm font-medium leading-normal text-primary hover:bg-primary/30 dark:hover:bg-primary/40"
                                    >
                                        <span>View</span>
                                    </button>
                                </div>
                                <p className="text-sm font-normal leading-normal text-stone-600 dark:text-stone-400">
                                    {note.content.length > 30 
                                        ? note.content.substring(0, 30) + "..." 
                                        : note.content}
                                </p> 
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />

            {/* Modals */}
            {isModalOpen && (
                <AddingCategory
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    setIsModalOpen={setIsModalOpen}
                    handleSaveCategory={handleSaveCategory}
                />
            )}

            <NoteDetails
                note={selectedNote}
                isOpen={isNoteDetailsOpen}
                onClose={handleCloseModal}
                onDelete={onDelete}
                onUpdate={handleUpdateNote}
                categories={categoryget}
            />

            <SearchOverlay
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                notes={allNotes}
                onSelectNote={handleViewNote}
            />
            
            {isAddNotsOpen && (
                <AddNote
                    title={notesend.title}
                    setNotesend={setNotesend}
                    notesend={notesend}
                    setIsAddNotsOpen={setIsAddNotsOpen}
                    categoryget={categoryget}
                    handleSaveNote={handleSaveNote}
                />
            )}

            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}

export default Create;