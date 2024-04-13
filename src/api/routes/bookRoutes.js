import { Router } from 'express';
const router = Router();
import passport from '../../config/passport.js';
import { addBook, getAllBooks, getBook, searchBooks, loanBook, returnBook, updateBook, deleteBook } from '../controllers/booksController.js';
import { validateBookData } from '../../validations/validateBookData.js';

// POST request to add a new book (Protected)
router.post('/v1/books', passport.authenticate('basic', { session: false }), validateBookData, addBook);

// GET request to retrieve all books (Open to all users)
router.get('/v1/books', getAllBooks);

// GET request to retrieve a specific book by ID (Open to all users)
router.get('/v1/books/:id', getBook);

// GET request to search a book
router.get('/v1/books/search', passport.authenticate('basic', { session: false }), searchBooks);

// PUT request to loan a specific book by ID (Protected)
router.put('/v1/books/:id/loan', passport.authenticate('basic', { session: false }), loanBook);

// PUT request to return a specific book by ID (Protected)
router.put('/v1/books/:id/return', passport.authenticate('basic', { session: false }), returnBook);

// PUT request to update a specific book by ID (Protected)
router.put('/v1/books/:id', passport.authenticate('basic', { session: false }), updateBook);

// DELETE request to delete a specific book by ID (Protected)
router.delete('/v1/books/:id', passport.authenticate('basic', { session: false }), deleteBook);

export default router;
