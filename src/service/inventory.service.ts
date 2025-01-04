import { Request } from 'express';
import { db } from '../models';
import { ResponseMessages } from '../constants/responseMessages';
import { removeUnwantedFields } from './utils.service';
import { INVENTORY_STATUS } from '../constants/inventory';
import { Op } from 'sequelize';
import { APIResponse } from '@src/types/response.type';
const { Inventory } = db;

class Inventoryservice {
    public async add(req: Request): Promise<APIResponse> {
        const { name, description, image, quantity, price } = req.body;
        const payload = { name, description, image, availableQuantity: quantity, price };

        const newInventory = await Inventory.create(payload);

        const data = removeUnwantedFields(newInventory.toJSON());

        return { status: true, data };
    }

    public async update(req: Request): Promise<APIResponse> {
        const { name, description, image, quantity, price } = req.body;
        const { id } = req.params;
        const payload = { name, description, image, availableQuantity: quantity, price };

        const [updateInventory] = await Inventory.update({...payload}, { where: { id, deletedAt: null } });

        if (!updateInventory) {
            return { status: false, message: ResponseMessages.INVENTORY_UPDATE_FAILURE }
        }

        const data = await Inventory.findOne({ 
            raw: true,                 
            where: { id },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        });
        
        return { status: true, data };
    }

    public async get(req: Request): Promise<APIResponse> {
        const { id } = req.params;
        const { status } = req.query;

        let data;

        if (id) {
            data = await Inventory.findOne({ 
                raw: true,                 
                where: { id, deletedAt: null },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                }
            });

            if (!data) {
                return { status: false, message: ResponseMessages.INVENTORY_NOT_FOUND }
            }
        } else {
            const whereCondition: { deletedAt: null, availableQuantity?: { [Op.gt]: number } | { [Op.lte]: number } } = { deletedAt: null };

            if (status) {
                if (status === INVENTORY_STATUS.AVAILABLE) {
                    whereCondition['availableQuantity'] = { [Op.gt]: 0 }
                }

                if (status === INVENTORY_STATUS.UNAVAILABLE) {
                    whereCondition['availableQuantity'] = { [Op.lte]: 0 }
                }
            }

            data = await Inventory.findAll({
                where: whereCondition,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                },
                order: [['id']]
            });

            if (!!!data?.length) {
                return { status: false, message: ResponseMessages.INVENTORY_NOT_FOUND }
            }
        }

        return { status: true, data };
    }

    public async delete(req: Request): Promise<APIResponse> {
        const { id } = req.params;

        const data = await Inventory.findOne({
            where: { id, deletedAt: null },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        });

        if (!data) {
            return { status: false, message: ResponseMessages.INVENTORY_NOT_FOUND }
        }

        await Inventory.destroy({ where: { id }});
        
        return { status: true, data };
    }
}

export default Inventoryservice