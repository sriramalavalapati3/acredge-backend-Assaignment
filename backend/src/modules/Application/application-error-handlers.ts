import { NextFunction, Request, Response } from "express";

export class ApplicationError extends Error {
    public httpStatusCode: number;
    public code: string;
  
    constructor(message: string, code: string, httpStatusCode: number) {
      super(message);
      this.code = code;
      this.httpStatusCode = httpStatusCode;
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this);
    }
  }
  
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApplicationError) {
        return res.status(err.httpStatusCode).json({
            error: {
                message: err.message,
                code: err.code
            }
        });
    }

     console.error('Unexpected Error:', err);

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
  });
};