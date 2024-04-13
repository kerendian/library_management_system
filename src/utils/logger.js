import { createLogger, format as _format, transports as _transports } from 'winston';

const logger = createLogger({
    level: 'info', // Minimum level to log
    format: _format.combine(
        _format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        _format.errors({ stack: true }), // Log stack trace
        _format.splat(),
        _format.json()
    ),
    defaultMeta: { service: 'book-service' },
    transports: [
        // Write all logs with level `error` and below to `error.log`
        new _transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Write all logs with level `info` and below to `combined.log`
        new _transports.File({ filename: 'logs/combined.log' })
    ]
});

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
    logger.add(new _transports.Console({
        format: _format.combine(
            _format.colorize(),
            _format.simple()
        )
    }));
}

export default logger;