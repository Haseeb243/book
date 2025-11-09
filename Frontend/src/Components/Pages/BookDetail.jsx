import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import "./BookDetail.css";
import Header from "../Header";
import Footer from "../Footer";
import { resolveImageUrl } from "../../lib/assets";
function BookDetail() {
  const { id } = useParams(); // Get the book ID from the URL
  const navigate = useNavigate(); // Use navigate for redirection
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await api.get(`/book/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to fetch book details. Please try again later.");
      }
    };

    fetchBookDetails();
  }, [id]);

  // Handle Buy Now button click
  const handleBuyNow = () => {
    navigate(`/checkout?bookId=${id}&price=${book.price}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="book-detail-container">
        <div className="book-image">
          <img src={resolveImageUrl(book.image)} alt={book.name} />
        </div>
        <div className="book-info">
          <h1>{book.name}</h1>
          <p>
            <strong>Author:</strong> {book.title}
          </p>
          <p>
            <strong>Price:</strong> ${book.price}
          </p>
          <p>
            <strong>Category:</strong> {book.category}
          </p>
          <p>
            <strong>Description:</strong> {book.description}
          </p>
          <button onClick={handleBuyNow} className="buy-now-button">
            Buy Now
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookDetail;
