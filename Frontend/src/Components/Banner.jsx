import React, { useState } from "react";
import mail from "./images/mail.png";
import api from "../lib/api";

import banner2 from "./images/hogwarts-castle.jpg";

function Banner() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/newsletter", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to add email to newsletter");
    }
  };

  return (
    <div className="bannerSection">
      <div className="leftsection">
        <h1>Welcome to Hogwarts Bookstore</h1>
        <p>
          Discover magical books and courses to enhance your wizarding skills.
        </p>
        <div className="inputWrapper">
          <img src={mail} alt="Mail Icon" />
          <input
            type="email"
            placeholder="Enter Your Owl Post Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubmit}>Subscribe</button>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Banner;
