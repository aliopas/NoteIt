import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "./useAuth";

export default function ProtectedRoute({ children }) {
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (!user || isError)) {
      // مسح كل حاجة
      localStorage.clear();
      sessionStorage.clear();
      const preventBack = () => {
        window.history.pushState(null, "", window.location.href);
      };
      
      preventBack();
      window.addEventListener('popstate', preventBack);
      
      return () => window.removeEventListener('popstate', preventBack);
    }
  }, [user, isLoading, isError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user || isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
}