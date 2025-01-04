import * as Joi from 'joi';

export class OrderValidation {
    public static addOrderSchema = Joi.object({
        order: Joi.array().items({
            inventory: Joi.number().strict().required(),
            quantity: Joi.number().strict().required(),
        }).min(1).required(),
    });
}