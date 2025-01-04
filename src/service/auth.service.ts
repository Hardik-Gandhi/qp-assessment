import { generateToken } from '../config/jwt';
import { Request } from 'express';
import { db } from '../models';
import { removeUnwantedFields, verifyHash } from './utils.service';
import { ResponseMessages } from '../constants/responseMessages';
import { USER_STATUS } from '../constants/user';
import { APIResponse } from '@src/types/response.type';
const { User, Role } = db;

class Authservice {
    public async login(req: Request): Promise<APIResponse> {
        const { email, password } = req.body;
        let user = await User.findOne({
            where: { email },
            include: {
                model: Role,
                attributes: ["name"]
            }
            
        });

        user = user.toJSON();

        if (!user) {
            // User not exist with given email
            return { status: false, message: ResponseMessages.USER_EMAIL_NOT_EXIST }
        }

        if (user.status !== USER_STATUS.ACTIVE) {
            // User not ACTIVE
            return { status: false, message: ResponseMessages.USER_NOT_ACTIVE }
        }

        const isPasswordMatch = await verifyHash(password, user.password);

        if (!isPasswordMatch) {
            // Password not match with system password
            return { status: false, message: ResponseMessages.USER_PASSWORD_INVALID }
        }

        const token = await generateToken({id: user.id});

        const filteredUser = removeUnwantedFields(user, ["password", "roleId"])

        const data = { ...filteredUser, token };


        return { status: true, data };
    }
}

export default Authservice