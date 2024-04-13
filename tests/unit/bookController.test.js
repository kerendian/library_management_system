import { addBook } from '../../src/api/controllers/booksController.js';
import Book from '../../src/api/models/Book.js'; // Mock this model
import { ValidationError, DatabaseError } from '../../src/utils/customErrors.js';
import logger from '../../src/utils/logger.js';

// Mock external modules and services
jest.mock('../../src/api/models/Book');
jest.mock('../../src/utils/logger');

describe('addBook Controller', () => {
    const mockRequest = () => ({
        body: {
            title: 'Test Book',
            authorId: '123',
            topic: 'Fiction',
            year: 2021,
            availability: true
        }
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const nextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks in between tests
    });

    test('should create a new book and respond with 201 and the created book', async () => {
        const req = mockRequest();
        const res = mockResponse();

        Book.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({
                _id: '1',
                title: 'Test Book',
                author: '123',
                topic: 'Fiction',
                year: 2021,
                availability: true
            })
        }));

        await addBook(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
        expect(res.json.mock.calls[0][0]).toEqual({
            _id: '1',
            title: 'Test Book',
            author: '123',
            topic: 'Fiction',
            year: 2021,
            availability: true
        });
    });

    test('should handle validation errors and call next with ValidationError', async () => {
        const req = mockRequest();
        const error = new Error('Validation error');
        error.name = 'ValidationError';
        Book.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(error)
        }));

        await addBook(req, mockResponse(), nextFunction);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    test('should handle duplicate key errors and call next with DatabaseError', async () => {
        const req = mockRequest();
        const error = new Error('Duplicate key error');
        error.name = 'MongoError';
        error.code = 11000;

        Book.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(error)
        }));

        await addBook(req, mockResponse(), nextFunction);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(DatabaseError));
    });
});
