import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../constants/httpStatusCodes";
import passport from "passport";
import { IUser } from "@src/types/user.type";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUser, info: { message: string }) => {
      if (err) {
        return res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal server error.", error: err.message });
      }
      if (!user) {
        const statusCode = info?.message
          ? HttpStatusCodes.FORBIDDEN
          : HttpStatusCodes.UNAUTHORIZED;
        return res
          .status(statusCode)
          .json({ message: info?.message || "Unauthorized access." });
      }

      // Attach the user object to the request
      req.user = user;

      // Proceed to the next middleware
      next();
    }
  )(req, res, next);
};
