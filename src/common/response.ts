import { Response } from "express";

interface SuccessResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, any>;
}

interface ErrorResponse {
  success: boolean;
  error: string | object;
  statusCode?: number;
}

export const successResponse = <T>(
  message: string,
  data?: T,
  meta?: Record<string, any>
): SuccessResponse<T> => {
  return {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
};

export const errorResponse = (
  res: Response,
  error: string | object,
  statusCode: number = 500
): Response => {
  const errorResponse: ErrorResponse = {
    success: false,
    error,
    statusCode,
  };
  return res.status(statusCode).json(errorResponse);
};