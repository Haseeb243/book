import React from "react";
import Home from "./Components/Pages/home";
import Courses from "./Components/Pages/Courses";
import Signup from "./Components/Signup";
import ContactUs from "./Components/Pages/contact";
import About from "./Components/Pages/about"; //
import AdminDashboard from "./Components/Pages/AdminDashboard";
import BookDetail from "./Components/Pages/BookDetail";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./Context/AuthProvider";
import Checkout from "./Components/checkout";
const App = () => {
  const [authUser, setauthUser] = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </>
  );
};
export default App;
