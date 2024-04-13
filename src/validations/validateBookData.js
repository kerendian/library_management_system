import { ValidationError } from '../utils/customErrors.js';
import Author from '../api/models/Author.js';

const validateBookData = async (req, res, next) => {
    try {
        if (!req.body.title) {
            throw new ValidationError("Title is required.");
        }
        if (!req.body.authorName) {
            throw new ValidationError("Author name is required.");
        }

        // Check if the author exists by name
        const author = await Author.findOne({ name: req.body.authorName });
        if (!author) {
            throw new ValidationError("Author not found with provided name.");
        }

        // Attach authorId to the request object to use in the controller
        req.authorId = author._id;

        next();
    } catch (error) {
        next(error);
    }
};

export {
    validateBookData
};
