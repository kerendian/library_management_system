import { Router } from 'express';
const router = Router();
import passport from '../../config/passport.js';
import { addBook, getAllBooks, getBook, searchBooks, loanBook, returnBook, updateBook, deleteBook } from '../controllers/booksController.js';
import { validateBookData } from '../../validations/validateBookData.js';

// POST request to add a new book (Protected)
router.post('/books', passport.authenticate('basic', { session: false }), validateBookData, addBook);

// GET request to retrieve all books (Open to all users)
router.get('/books', getAllBooks);

// GET request to retrieve a specific book by ID (Open to all users)
router.get('/books/:id', getBook);

// GET request to search a book
router.get('/books/search', passport.authenticate('basic', { session: false }), searchBooks);

// POST request to loan a specific book by ID (Protected)
router.put('/books/:id/loan', passport.authenticate('basic', { session: false }), loanBook);

// POST request to return a specific book by ID (Protected)
router.put('/books/:id/return', passport.authenticate('basic', { session: false }), returnBook);

// PUT request to update a specific book by ID (Protected)
router.put('/books/:id', passport.authenticate('basic', { session: false }), updateBook);

// DELETE request to delete a specific book by ID (Protected)
router.delete('/books/:id', passport.authenticate('basic', { session: false }), deleteBook);

export default router;