
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pag/login.jsx";
import Register from "./pag/Register.jsx";
import './index.css'
import Dashboard from './pag/Dashboard.jsx' 
import Create from './pag/create.jsx'
import ProtectedRoute from "./hooks/ProtectedRoute.jsx";

function App() {

  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={
          <ProtectedRoute>
          <Create/>
          </ProtectedRoute>
          } 
          />
        <Route path="/" element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
          } />
      </Routes>
    </div>
  );
}

export default App