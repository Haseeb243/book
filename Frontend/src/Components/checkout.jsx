// Import necessary libraries
import React, { useState, useEffect } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import "./Checkout.css"; // Ensure you have a CSS file for styling

function Checkout(props) {
  const [formData, setFormData] = useState({
    bookId: "",
    price: "",
    quantity: 1,
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Retrieve book ID and price from URL parameters
  useEffect(() => {
    console.log(props.bookId);
    console.log(props.price);
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("bookId");
    const price = params.get("price");
    if (bookId) {
      setFormData((prevFormData) => ({ ...prevFormData, bookId }));
    }
    if (price) {
      setFormData((prevFormData) => ({ ...prevFormData, price }));
    }
  }, []);

  // Handle input changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      // Calculate total price
      const totalPrice = formData.price * formData.quantity;

      // Send POST request to the backend API
      // Send only non-sensitive fields to backend (do not send raw card data)
      const { cardNumber, expiryDate, cvv, ...safePayload } = formData;
      const response = await api.post("/checkout", {
        ...safePayload,
        totalPrice,
      });
      toast.success("Checkout completed successfully!");
      console.log("Response:", response.data);

      // Optionally reset the form
      setFormData({
        bookId: "",
        price: "",
        quantity: 1,
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
    } catch (error) {
      toast.error(
        `Error during checkout: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleCheckout} className="checkout-form">
        <h3>Order Details</h3>
        <div className="form-group">
          <label htmlFor="bookId">Book ID:</label>
          <input
            type="text"
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleInputChange}
            placeholder="Enter the Book ID"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            placeholder="Enter quantity"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalPrice">Total Price:</label>
          <input
            type="text"
            id="totalPrice"
            name="totalPrice"
            value={formData.price * formData.quantity}
            readOnly
          />
        </div>

        <h3>Customer Information</h3>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter your state"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zip">Zip Code:</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              placeholder="Enter your zip code"
              required
            />
          </div>
        </div>

        <h3>Payment Information</h3>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="Enter your card number"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV:</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="Enter your CVV"
              required
            />
          </div>
        </div>

        <button type="submit" className="checkout-button">
          Complete Checkout
        </button>
      </form>
    </div>
  );
}

export default Checkout;
