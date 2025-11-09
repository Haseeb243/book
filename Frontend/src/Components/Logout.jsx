import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import toast from "react-hot-toast";

function Logout() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      setAuthUser(null); // Reset authUser to null
      localStorage.removeItem("Users"); // Clear the user from localStorage
      toast.success("Logout Successfully");
      navigate("/signup"); // Redirect to the signup page
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}

export default Logout;
