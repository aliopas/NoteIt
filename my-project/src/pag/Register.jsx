import { NavLink } from "react-router-dom";
import { useState } from "react";
import { registerUser } from '../utils/noteApi.js';
import Toast from '../components/Toast.jsx';

function Register() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(false); // ✅ حالة التحميل

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmituser = async () => {
    setIsLoading(true); // ✅ بدء التحميل
    try {
      await registerUser({
        name: inputs.username,
        email: inputs.email,
        password: inputs.password,
      });
      setToastMessage('Registration successful! Please login now.');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      console.error('Registration error:', + (err.response?.data?.message || ''));
      setToastMessage('Failed to register user! ');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false); // ✅ انتهاء التحميل
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });

    if (name === "username") {
      setErrors({
        ...errors,
        username: value.trim() === "" ? "Username is required" : "",
      });
    }

    if (name === "email") {
      setErrors({
        ...errors,
        email: !emailRegex.test(value) ? "Please enter a valid email" : "",
      });
    }

    if (name === "password") {
      setErrors({
        ...errors,
        password: !passwordRegex.test(value)
          ? "Password must be at least 8 characters and include a number and a special symbol"
          : "",
        confirmPassword:
          inputs.confirmPassword && inputs.confirmPassword !== value
            ? "Passwords do not match"
            : "",
      });
    }

    if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword:
          value !== inputs.password ? "Passwords do not match" : "",
      });
    }
  };

  const handleSubmit = () => {
    let newErrors = {};
    if (!inputs.username.trim()) newErrors.username = "Username is required";
    if (!emailRegex.test(inputs.email)) newErrors.email = "Invalid email";
    if (!passwordRegex.test(inputs.password))
      newErrors.password =
        "Password must be at least 8 characters and include a number and a special symbol";
    if (inputs.confirmPassword !== inputs.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmituser();
    }
  };

  const handleGuestMode = () => {
    alert("Login as guest");
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
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

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center gap-2 mb-8">
            <svg className="w-8 h-8 text-stone-900 dark:text-primary" viewBox="0 0 24 24" fill="currentColor">
              <g fillRule="evenodd">
                <path d="M5 19h14V5H5v14zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <path d="M6.287 8.62H17.11V6.437H6.288v2.18zm0 4.36H17.11V10.8H6.288v2.18zm0 4.363h6.494v-2.18H6.288v2.18z" />
              </g>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              NoteIt
            </h1>
          </div>
          <div className="bg-white dark:bg-background-dark p-8 rounded-xl shadow-2xl transition-colors duration-300">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Create an account
            </h2>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={inputs.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full px-4 py-2.5 rounded-lg border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={inputs.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full px-4 py-2.5 rounded-lg border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={inputs.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full px-4 py-2.5 rounded-lg border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  {inputs.password && (showPassword ? "🙈" : "👁️")}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={inputs.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full px-4 py-2.5 rounded-lg border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={isLoading}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  {inputs.confirmPassword && (showConfirm ? "🙈" : "👁️")}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 justify-center">
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
                    Registering...
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <NavLink
              to="/login"
              className="font-medium text-primary hover:underline ml-1"
            >
              Log in
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

export default Register;
