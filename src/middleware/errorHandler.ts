import { Request, Response, NextFunction } from 'express';

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Catch default status code 200 errors
  res.status(statusCode).send({
    status: 'error',
    statusCode,
    message: err.message || 'An unexpected error occurred on the server.',
  });
};

export default errorHandler;
