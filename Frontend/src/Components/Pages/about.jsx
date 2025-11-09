import React from "react";
import "./about.css";

import book2 from "../images/book2.jpg";
import Header from '../Header';
import Footer from '../Footer';
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/contact");
  }

  return (
    <div>
      <Header/>
      <section className="about-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>Home &gt; About Us</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Bookstore Is Best Choice For Learners</h2>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form. It is a long established fact
                that a reader will be distracted by the readable content of a page when looking at its layout.
              </p>
              <ul>
                <li>Comics & Graphics</li>
                <li>Biography</li>
                <li>Literary Collections</li>
                <li>Children Fiction</li>
              </ul>
              <button onClick={handleClick}>Contact Us</button>
            </div>
            <div className="about-images">
                <img src={book2} alt="Bookshelf" className="img-right" />
              
              
              <div className="experience">
                <h3>50+</h3>
                <p>Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default AboutUs;