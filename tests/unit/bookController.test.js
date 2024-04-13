import { addBook } from '../../src/api/controllers/booksController';
import Book from '../../src/api/models/Book';
import { ValidationError, DatabaseError } from '../../src/utils/customErrors';
import logger from '../../src/utils/logger';

// Mock external modules and services
jest.mock('../../src/api/models/Book', () => ({
    __esModule: true, // This tells Jest to handle this as an ES module
    default: jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
            _id: '1',
            title: 'Test Book',
            author: '123',
            topic: 'Fiction',
            year: 2021,
            availability: true
        })
    }))
}));
jest.mock('../../src/utils/logger');

describe('addBook Controller', () => {
    const mockRequest = () => ({
        body: {
            title: 'Test Book',
            authorId: '123',
            topic: 'Fiction',
            year: 2021,
            availability: true
        },
        originalUrl: '/books/add',
        method: 'POST',
        ip: '127.0.0.1'
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const nextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new book and respond with 201 and the created book', async () => {
        const bookDetails = {
            _id: '1',
            title: 'Test Book',
            author: '123',
            topic: 'Fiction',
            year: 2021,
            availability: true
        };
    
        Book.mockImplementation(() => {
            const instance = {
                save: jest.fn().mockResolvedValue(bookDetails)
            };
            return instance;
        });
    
        const req = mockRequest();
        const res = mockResponse();
    
        await addBook(req, res, nextFunction);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(bookDetails);
    });
    
    it('should handle validation errors and call next with ValidationError', async () => {
        const validationError = new Error('Validation error');
        validationError.name = 'ValidationError';

        Book.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(validationError)
        }));

        const req = mockRequest();
        const res = mockResponse();

        await addBook(req, res, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
        expect(logger.error).toHaveBeenCalled();
    });

    it('should handle duplicate key errors and call next with DatabaseError', async () => {
        const mongoError = new Error('Duplicate key error');
        mongoError.name = 'MongoError';
        mongoError.code = 11000;

        Book.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(mongoError)
        }));

        const req = mockRequest();
        const res = mockResponse();

        await addBook(req, res, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(expect.any(DatabaseError));
        expect(logger.error).toHaveBeenCalled();
    });

    it('should handle other errors and call next', async () => {
        const genericError = new Error('Generic error');

        Book.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(genericError)
        }));

        const req = mockRequest();
        const res = mockResponse();

        await addBook(req, res, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(genericError);
        expect(logger.error).toHaveBeenCalled();
    });
});
