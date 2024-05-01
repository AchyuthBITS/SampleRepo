import React, { useState, useEffect } from 'react';
import './Home.css'; // Import CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import BookListingForm from './BookListingForm';
import booksDataCsv from './books.csv'; // Import CSV file
import * as Papa from 'papaparse'; // Import PapaParse library for CSV parsing

export const Home = ({ onViewProfile, onSignOut }) => {
  const [booksData, setBooksData] = useState([]);
  const [showBookListingForm, setShowBookListingForm] = useState(false); // New state for showing book listing form

  function BookExchangePlatform() {
    // Initialize state variables for book list and form inputs
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [condition, setCondition] = useState('');
    const [availability, setAvailability] = useState('');

     // Load book list from CSV file when the component mounts
  useEffect(() => {
    fetch('/book_list.csv') // Change the path as needed
      .then(response => response.text())
      .then(text => {
        const result = Papa.parse(text, { header: true });
        setBooks(result.data);
      })
      .catch(error => console.error('Error reading CSV file:', error));
  }, []);

  // Write updated book list to CSV file whenever it changes
  useEffect(() => {
    const csv = Papa.unparse(books, { header: true });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Download the CSV file (optional)
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'book_list.csv');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // Alternatively, you can send the updated book list to the server for server-side file handling
    // Example:
    // fetch('/save-book-list', {
    //   method: 'POST',
    //   body: csv,
    //   headers: {
    //     'Content-Type': 'text/csv'
    //   }
    // })
    // .then(response => {
    //   if (!response.ok) {
    //     throw new Error('Failed to save book list');
    //   }
    // })
    // .catch(error => console.error('Error saving book list:', error));

    // Clean up by revoking the URL
    return () => URL.revokeObjectURL(url);
  }, [books]);

  return (
    <div>
      <h1>Book Exchange Platform</h1>
      <div>
        <h2>Book List</h2>
        <ul>
          {books.map((book, index) => (
            <li key={index}>
              <strong>Title:</strong> {book.title}, <strong>Author:</strong> {book.author}, <strong>Genre:</strong> {book.genre}, <strong>Condition:</strong> {book.condition}, <strong>Availability:</strong> {book.availability}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookExchangePlatform;


  const toggleBookListingForm = () => {
    setShowBookListingForm(!showBookListingForm);
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <h1 className="title">Home</h1>
        <div className="user-profile">
          <FontAwesomeIcon icon={faUser} size="lg" />
          <button onClick={onViewProfile} className="view-profile-button">View Profile</button>
          <button onClick={onSignOut} className="sign-out-button">Sign Out</button>
        </div>
      </div>
      <div className="search-container">
        <input type="search" className="search-input" placeholder="Type your search query" />
        <button className="search-button">Search</button>
      </div>
      <button onClick={toggleBookListingForm} className="list-book-button">List a Book</button> {/* Button to toggle the book listing form */}
      {showBookListingForm && <BookListingForm />} {/* Conditionally render the book listing form */}
  );
}

export default Home;
