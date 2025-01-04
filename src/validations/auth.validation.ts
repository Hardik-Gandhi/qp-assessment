import * as Joi from 'joi';

export class AuthValidation {
    public static loginSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'test'] } }).required(),
        password: Joi.string().required(),
    });
}