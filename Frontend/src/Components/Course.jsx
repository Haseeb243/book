import React, { useEffect, useState } from "react";
import "../style.css";
import Cards from "./Cards";
import api from "../lib/api";

function Course() {
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

  return (
    <>
      <div className="Courses-top">
        <h1>
          We are Delighted to have you <span>Here! :)</span>{" "}
        </h1>
        <p>
          Discover our all-in-one learning hub where courses and books come
          together to inspire and educate. Explore a diverse range of expertly
          curated courses tailored to enhance your skills and knowledge across
          various fields. Dive into a vast collection of books, offering titles
          that entertain, inform, and ignite your curiosity. Whether you're a
          lifelong learner, an avid reader, or both, this section is your
          gateway to growth and discovery.
        </p>
      </div>
      <div className="courses-grid small-cards">
        {book.map((item) => (
          <Cards key={item._id || item.id} item={item} />
        ))}
      </div>
    </>
  );
}

export default Course;
