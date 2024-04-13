import Book from '../models/Book.js';
import { ValidationError, DatabaseError } from '../../utils/customErrors.js';
import { Error } from 'mongoose';
import logger from '../../utils/logger.js';

// Add a New Book with Validation
export async function addBook(req, res, next) {
    try {
        // Create a new book with required and optional fields
        const newBook = new Book({
            title: req.body.title,
            author: req.authorId,  // Use the validated author's ID from request
            topic: req.body.topic,  // Optional
            year: req.body.year,    // Optional
            availability: req.body.availability !== undefined ? req.body.availability : true  // Optional, defaults to true
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        if (error instanceof Error.ValidationError) {
            next(new ValidationError(error.message));
        } else if (error.name === 'MongoError' && error.code === 11000) {
            next(new DatabaseError("Duplicate key error: A book with the same title already exists."));
        } else {
            next(error);
        }
    }
}

// Retrieve All Books
export async function getAllBooks(req, res, next) {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next(new DatabaseError("Failed to retrieve books."));
    }
}

// Retrieve a Specific Book
export async function getBook(req, res, next) {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            throw new ValidationError("Book not found with provided ID.");
        }
        res.json(book);
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next(new ValidationError("Error retrieving the book: " + error.message));
    }
}

// Search a Book
export async function searchBooks(req, res, next) {
    try {
        let query = {};
        for (const key in req.query) {
            if (Book.schema.paths[key]) {
                query[key] = req.query[key];
            }
        }
        const books = await Book.find(query);
        if (!books.length) {
            res.status(404).json({ message: 'No books found matching the criteria.' });
        } else {
            res.json(books);
        }
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next(new DatabaseError('Error searching for books: ' + error.message));
    }
}

// Loan a Book
export async function loanBook(req, res, next) {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { availability: false }, { new: true });
        if (!book) {
            throw new ValidationError('Book not available for loan');
        }
        res.json(book);
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next(new ValidationError("Error loaning the book: " + error.message));
    }
}

// Return a Book
export async function returnBook(req, res, next) {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { availability: true }, { new: true });
        if (!book) {
            throw new ValidationError('Book not found for return');
        }
        res.json(book);
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next(new ValidationError("Error returning the book: " + error.message));
    }
}

// Update a Book
export async function updateBook(req, res, next) {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            throw new ValidationError("Book not found for updating.");
        }
        res.json(book);
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next(new ValidationError("Error updating the book: " + error.message));
    }
}

// Delete a Book
export async function deleteBook(req, res, next) {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            throw new ValidationError("Book not found for deletion.");
        }
        res.status(204).send();
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        next(new ValidationError("Error deleting the book: " + error.message));
    }
}
