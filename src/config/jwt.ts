import { JWT_ALGORITHM } from "../constants/env";
import { envs } from "../../config";
import { expressjwt } from "express-jwt";
import * as jwt from 'jsonwebtoken';

/**
 * Setup JWT configuration
 */
export const configJWT = async (): Promise<any> => {
  const result = await expressjwt({
    secret: envs.JWT_SECRET,
    algorithms: [JWT_ALGORITHM],
    credentialsRequired: false,
  });
  return result;
};

export const generateToken = async (data: {id: number}): Promise<string> => {
    return jwt.sign(data, envs.JWT_SECRET, { expiresIn: envs.EXPIRES_IN });
}

export const verifyToken = async (token: string): Promise<string | jwt.JwtPayload> => {
    return jwt.verify(token, envs.JWT_SECRET);
}
