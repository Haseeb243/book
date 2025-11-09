import React from "react";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../lib/assets";

const Cards = ({ item }) => {
  const navigate = useNavigate();

  // Handle Buy Now button click
  const handleBuyNow = (e) => {
    e.stopPropagation(); // Prevent event propagation to the parent card
    navigate(`/checkout?bookId=${item._id}&price=${item.price}`);
  };

  // Handle card click to navigate to book detail page
  const handleCardClick = () => {
    navigate(`/book/${item._id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <img
        src={resolveImageUrl(item.image)}
        alt={item.title}
        className="product-image"
      />
      <div className="product-info">
        <h4>
          {item.name}{" "}
          <span>
            <button>{item.category}</button>
          </span>
        </h4>
        <p>{item.title}</p>
        <div className="product-footer">
          <h3>${item.price}</h3>
          <button onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
