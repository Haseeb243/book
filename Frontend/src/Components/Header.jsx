import React, { useState } from "react";
import logo from "./images/hogwartsCrest.png";
import Login from "./Login";
import Logout from "./Logout";
import "../style.css";
import { useAuth } from "../Context/AuthProvider";

function Header() {
  const [authUser] = useAuth(); // Read only
  const [showLogin, setShowLogin] = useState(false);

  const toggleLogin = () => setShowLogin((prev) => !prev);

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/course">Books</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>

          <li>
            {authUser ? (
              <Logout /> // Logout button if user is logged in
            ) : (
              <button onClick={toggleLogin} className="login-button">
                Login
              </button> // Login button if no user is logged in
            )}
          </li>
        </ul>
      </nav>
      {showLogin && <Login onClose={toggleLogin} />}{" "}
      {/* Render Login modal if showLogin is true */}
    </header>
  );
}

export default Header;
