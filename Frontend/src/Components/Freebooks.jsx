import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "./Cards";
import api from "../lib/api";

function Freebooks() {
  const [book, setbook] = useState([]);
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await api.get("/book");
        console.log(res.data);
        setbook(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBook();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="Catalog">
        <h1>Top Selling Books</h1>
        <p>
          Discover a diverse collection of books that inspire, educate, and
          entertain, catering to readers of all interests and passions.
        </p>
      </div>
      <div>
        <Slider {...settings}>
          {book.map((item) => (
            <Cards key={item._id || item.id} item={item} />
          ))}
        </Slider>
      </div>
    </>
  );
}

export default Freebooks;
