function errorHandler(err, req, res, next) {
    console.log('Error handling middleware called');
    console.log('Err:', err);

    // Default response structure
    let response = {
        message: err.message || 'Something went wrong, please try again later.',
        type: err.name,
        field: err.field || 'general', // Field causing the issue, if applicable
        tip: 'Contact support if the problem persists.' // Generic tip for all errors
    };

    // Set the HTTP status code based on the error type or a default
    let statusCode = err.statusCode || 500;

    // Distinguish between different environments for error detail level
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack; // Provide stack trace in non-production environments
    }

    // Customize response and statusCode based on error type
    switch (err.name) {
        case 'ValidationError':
            response.field = err.field || 'Unknown'; // Specifying the field involved, if not already specified
            statusCode = 400;
            break;
        case 'DatabaseError':
            response.tip = "Please try again later or contact support.";
            statusCode = 500;
            break;
        case 'ObjectIdError':
            response.message = 'Resource not found';
            response.tip = "Check the resource identifier.";
            statusCode = 404;
            break;
        case 'SyntaxError':
            response.message = 'Invalid JSON payload provided';
            response.tip = "Ensure the request body is correctly formatted.";
            statusCode = 400;
            break;
        default:
            // For other types of errors that may not be custom handled
            response.message = response.message || 'Unexpected error occurred.';
            break;
    }

    // Log the error in non-production environments
    if (process.env.NODE_ENV !== 'production') {
        console.error('An error occurred:', err);
    }

    // Send the response
    res.status(statusCode).json(response);
}

export default errorHandler;