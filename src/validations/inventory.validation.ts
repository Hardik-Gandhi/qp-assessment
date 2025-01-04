import * as Joi from 'joi';

export class InventoryValidation {
    public static addInventorySchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional().allow(null,''),
        image: Joi.string().optional().allow(null,''),
        quantity: Joi.number().strict().required(),
        price: Joi.number().strict().required()
    });

    public static editInventorySchema = Joi.object({
        id: Joi.number().strict().required(),
        name: Joi.string().required(),
        description: Joi.string().optional().allow(null,''),
        image: Joi.string().optional().allow(null,''),
        quantity: Joi.number().strict().required(),
        price: Joi.number().strict().required()
    });

    public static deleteInventorySchema = Joi.object({
        id: Joi.number().strict().required()
    });
}