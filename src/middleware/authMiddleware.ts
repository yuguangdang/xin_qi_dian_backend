// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, 'secret'); // Use your secret
    req.user = decoded; // Add the decoded user to the request object

    next(); // Pass control to the next middleware/function
  } catch (error) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};
