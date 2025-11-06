import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../utils/noteApi.js";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "../components/Toast.jsx";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [userdata, setUserdata] = useState({
    email: "",
    password: "",
  });

  const handleGuestMode = () => {
    alert("uderdevelopment in progress");
  };

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'email or user is required';
    }}

  const validatePassword = (password) => {
    if (!password) {
      return ' Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prevData) => ({ ...prevData, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';
    
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    const emailError = validateEmail(userdata.email);
    const passwordError = validatePassword(userdata.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    return !emailError && !passwordError;
  };

  const sub = async (e) => {
    e.preventDefault(); // منع الـ default behavior
    e.stopPropagation(); // منع الـ event bubbling
    
    // Validate before submit
    if (!validateForm()) {
      setToastMessage('Please fix the validation errors before submitting.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser(userdata);
      console.log("Login successful:", response);
      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      
      // Show success toast briefly before navigation
      setToastMessage('Login successful!');
      setToastType('success');
      setShowToast(true);
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
      
    } catch (err) {
      console.error("Login error:", err);
      
      // Extract error message
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 'Unknown error occurred';
      
      setToastMessage(`Login failed: ${errorMessage}`);
      setToastType('error');
      setShowToast(true);
      
      // Don't navigate on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
      {/* Guest Mode Button */}
      <button
        onClick={handleGuestMode}
        disabled={isLoading}
        className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg transition-all hover:scale-105 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="17" y1="11" x2="23" y2="11" />
        </svg>
        <span className="text-sm font-medium">Login as Guest</span>
      </button>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <svg
                className="w-8 h-8 text-stone-900 dark:text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <g fillRule="evenodd">
                  <path d="M5 19h14V5H5v14zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  <path d="M6.287 8.62H17.11V6.437H6.288v2.18zm0 4.36H17.11V10.8H6.288v2.18zm0 4.363h6.494v-2.18H6.288v2.18z" />
                </g>
              </svg>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                NoteIt
              </h1>
            </div>
          </div>

          <div className="bg-white dark:bg-background-dark p-8 rounded-xl shadow-2xl transition-colors duration-300">
            <h2 className="text-2xl font-bold text-center mb-1 text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
              Login to your account
            </p>

            <form onSubmit={sub} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  htmlFor="email"
                >
                  Username or Email
                </label>
                <input
                  className={`block w-full px-4 py-2.5 rounded-lg border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  id="email"
                  name="email"
                  value={userdata.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  type="text"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={userdata.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={`block w-full px-4 py-2.5 rounded-lg border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.password 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  {userdata.password && (showPassword ? "🙈" : "👁️")} 
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <button
                  className="w-full inline-flex justify-center rounded-lg border border-transparent bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Logging in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <NavLink
              to="/register"
              className="font-medium text-primary hover:underline ml-1"
            >
              Register here
            </NavLink>
          </p>
        </div>
      </div>
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Login;