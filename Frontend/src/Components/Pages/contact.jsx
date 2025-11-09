import React, { useState } from "react";
import "./contact.css";
import api from "../../lib/api";
import toast from "react-hot-toast";
import url from "../images/service-image.png";
import Header from "../Header";
import Footer from "../Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/contact", formData);
      toast.success(response.data.message);
      setFormData({ name: "", email: "", message: "", address: "", phone: "" });
    } catch (error) {
      toast.error("Failed to submit contact form");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
        </div>
        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              phone
              <input
                type="number"
                name="phone"
                placeholder="Enter your phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
          <div className="service-info">
            <img src={url} alt="24/7 Service" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
