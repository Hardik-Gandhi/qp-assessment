import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../constants/httpStatusCodes";
import { ResponseMessages } from "../constants/responseMessages";

export const validateRole = (allowedRoles: String[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req?.user?.Role?.name)) {
        return res
        .status(HttpStatusCodes.FORBIDDEN)
        .json({ message: ResponseMessages.FORBIDDEN_ACCESS });
    }

    // Proceed to the next middleware
    next();
};
