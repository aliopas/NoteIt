import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import NoteList from "../components/NoteList.jsx";
import NoteDetails from "../components/NoteDetails.jsx";
import Toast from "../components/Toast.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth.js";
import { useUserData } from "../hooks/useUserData.js";
import { updateNote, deleteNote } from "../utils/noteApi.js";

function Dashboard() {
  const [isNoteDetailsOpen, setIsNoteDetailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const { isError: userError, isLoading: userLoading } = useCurrentUser();

  // 🔹 الحصول على النوتس الخاصة بالمستخدم
  const {
    data: userData = { categories: [], notes: [] },
    isLoading: notesLoading,
    isError: notesError,
    refetch,
  } = useUserData();

  // 🔹 استخراج النوتس من الـ userData
  const notes = userData.notes || [];

  const navigate = useNavigate();

  useEffect(() => {
    if (userError) {
      navigate("/login");
    }
  }, [userError, navigate]);

  // 🔹 فتح تفاصيل النوت
  const handleViewNote = (note) => {
    setSelectedNote(note);
    setIsNoteDetailsOpen(true);
  };

  // 🔹 غلق المودال
  const handleCloseModal = () => {
    setIsNoteDetailsOpen(false);
    setSelectedNote(null);
  };

  // 🔹 تحديث النوت
  const handleUpdateNote = async (noteId, updatedData) => {
    try {
      await updateNote(noteId, updatedData);

      // تحديث الـ cache
      refetch();

      setToastMessage("Note updated successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (err) {
      console.error("Error updating note:", err);
      setToastMessage("Failed to update note!");
      setToastType("error");
      setShowToast(true);
    }
  };

  // 🔹 حذف النوت
  const onDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      refetch();
      handleCloseModal();

      setToastMessage("Note deleted successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (err) {
      console.error("Error deleting note:", err);
      setToastMessage("Failed to delete note!");
      setToastType("error");
      setShowToast(true);
    }
  };
    if (userLoading || notesLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">Loading your workspace...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-40 py-10">
        <div className="mx-auto max-w-5xl">
          {/* 🧠 العنوان */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
              My Notes
            </h1>
          </div>
          
          <div
            className="relative mb-8 flex flex-col items-start justify-end rounded-xl bg-cover bg-center min-h-[240px] p-6 overflow-hidden"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0"></div>
            <div className="relative z-10 flex w-full items-end justify-between gap-4">
              <div className="flex max-w-md flex-1 flex-col gap-1">
                <p className="text-2xl font-bold leading-tight text-white">
                  Add a new note
                </p>
                <p className="text-base font-medium leading-normal text-white/80">
                  Capture your thoughts, ideas, and reminders effortlessly.
                </p>
              </div>
              <NavLink
                to="/create"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90"
              >
                Add Note
              </NavLink>
            </div>
          </div>

          <NoteDetails
            note={selectedNote}
            isOpen={isNoteDetailsOpen}
            onClose={handleCloseModal}
            onDelete={onDelete}
            onUpdate={handleUpdateNote}
            categories={userData.categories || []}
          />

          {/* 🗂️ قائمة النوتس */}
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Existing Notes
            </h2>
          </div>

          {notesError ? (
            <p className="text-red-500">Failed to load notes!</p>
          ) : notes.length > 0 ? (
            <NoteList onViewNote={handleViewNote} recentNotes={notes} />
          ) : (
            <p className="text-stone-600 dark:text-stone-400">
              No notes available. Create your first note!
            </p>
          )}
        </div>
      </main>

      <Footer />

      {/* 🔔 Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Dashboard;