import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import api from "../../lib/api";
import Header from "../Header";
import Footer from "../Footer";
import "./admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [authUser] = useAuth();
  const [bookData, setBookData] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("manage");
  const [users, setUsers] = useState([]);
  const [editBookId, setEditBookId] = useState(null);
  const [editBookData, setEditBookData] = useState({});

  useEffect(() => {
    if (!authUser || !authUser.isAdmin) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/book");
      setBooks(res.data);
    } catch (err) {
      setError("Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all users for admin
  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setBookData({ ...bookData, [name]: files[0] });
    } else {
      setBookData({ ...bookData, [name]: value });
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", bookData.name);
      formData.append("price", bookData.price);
      formData.append("category", bookData.category);
      formData.append("title", bookData.title);
      formData.append("description", bookData.description);
      if (bookData.image) {
        formData.append("image", bookData.image);
      }
      const response = await api.post("/book", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        alert("Book added successfully!");
        setBookData({
          name: "",
          price: "",
          category: "",
          image: null,
          title: "",
          description: "",
        });
        setError("");
        fetchBooks();
      }
    } catch (error) {
      setError(
        "Failed to add book: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Edit Book
  const startEditBook = (book) => {
    setEditBookId(book._id || book.id);
    setEditBookData({ ...book });
    setActiveTab("edit");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBookData({ ...editBookData, [name]: value });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/book/${editBookId}`, editBookData);
      if (response.status === 200) {
        alert("Book updated successfully!");
        setEditBookId(null);
        setEditBookData({});
        setActiveTab("manage");
        fetchBooks();
      }
    } catch (error) {
      setError(
        "Failed to update book: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Delete Book
  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const response = await api.delete(`/book/${id}`);
      if (response.status === 200) {
        alert("Book deleted successfully!");
        fetchBooks();
      }
    } catch (error) {
      setError(
        "Failed to delete book: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <>
      <Header />
      <div className="admin-dashboard-wrapper">
        <aside className="admin-sidebar">
          <button
            className={activeTab === "manage" ? "active" : ""}
            onClick={() => setActiveTab("manage")}
          >
            Manage Books
          </button>
          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => {
              setActiveTab("add");
              setEditBookId(null);
            }}
          >
            Add Book
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => {
              setActiveTab("users");
              fetchUsers();
            }}
          >
            User Management
          </button>
        </aside>
        <main className="admin-main">
          <h1>Admin Dashboard</h1>
          {error && <p className="error-message">{error}</p>}

          {activeTab === "add" && (
            <form onSubmit={handleAddBook} className="admin-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={bookData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={bookData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={bookData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Book Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={bookData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={bookData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Add Book
              </button>
            </form>
          )}

          {activeTab === "users" && (
            <>
              <h2>User Management</h2>
              <ul className="user-list">
                {users.map((user) => (
                  <li key={user._id} className="user-list-item">
                    <strong>{user.fullname}</strong> — {user.email}
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "manage" && (
            <>
              <h2>Book List</h2>
              <ul className="book-list">
                {books.map((book) => (
                  <li key={book._id || book.id} className="book-list-item">
                    <strong>{book.name}</strong> — {book.category} — $
                    {book.price}
                    <button
                      onClick={() => startEditBook(book)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book._id || book.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "edit" && (
            <form onSubmit={handleUpdateBook} className="admin-form">
              <h2>Edit Book</h2>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editBookData.name || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={editBookData.price || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={editBookData.category || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL or Filename:</label>
                <input
                  type="text"
                  name="image"
                  value={editBookData.image || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={editBookData.title || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editBookData.description || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Update Book
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setActiveTab("manage");
                  setEditBookId(null);
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
