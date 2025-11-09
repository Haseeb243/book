import React from "react";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import "./Login.css";

function Login({ onClose }) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/user/login", data);
      toast.success("Login Successful");

      // Set user in context
      setAuthUser(response.data.user);

      // Check if the user is an admin
      if (response.data.user.isAdmin) {
        navigate("/admin-dashboard"); // Redirect to the admin dashboard
      } else {
        navigate("/"); // Redirect to the home page for regular users
      }
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.message);
      }
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" {...register("email", { required: true })} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              {...register("password", { required: true })}
            />
          </div>
          <button type="submit">Login</button>
          <button
            type="button"
            onClick={handleSignupRedirect}
            className="signup-button"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
