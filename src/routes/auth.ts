import { Router, Request, Response } from 'express';

import Authservice from '../service/auth.service';
import { errorResponse, successResponse } from '../common/response';
import HttpStatusCodes from '../constants/httpStatusCodes';
import { ResponseMessages } from '../constants/responseMessages';
import { AuthValidation } from '../validations/auth.validation';

const router = Router();
const auth = new Authservice();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const valid = AuthValidation.loginSchema.validate(req.body);
    if (valid.error) {
      return errorResponse(res, valid.error.message, HttpStatusCodes.UNPROCESSABLE_ENTITY);
    }
    const authResponse = await auth.login(req);

    if (!authResponse?.status && authResponse?.message) {
      throw new Error(authResponse?.message);
    }

    return res.status(HttpStatusCodes.OK).json(successResponse(ResponseMessages.LOGIN_SUCCESS, authResponse));
  } catch (error) {
    return errorResponse(res, error.message, HttpStatusCodes.BAD_REQUEST);
  }
});

export default router;