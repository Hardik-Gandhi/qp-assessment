import { Request } from "express";
import { db, sequelize } from "../models";
import { ResponseMessages } from "../constants/responseMessages";
import { APIResponse } from "@src/types/response.type";
import { IInventoryAvailability } from "@src/types/inventory.type";

const { Inventory, Order, OrderItem } = db;

class Orderservice {
  public async add(req: Request): Promise<APIResponse> {
    const availabilityResponse = await this.checkInventoryAvailability(
      req?.body?.order
    );

    if (!availabilityResponse) {
      return { status: false, message: ResponseMessages.INSUFFICIENT_INVENTORY_QUANTITY };
    }

    const t = await sequelize.transaction();

    try {
      const decrementPromises = availabilityResponse?.map(
        async (orderItem: { quantity: number; inventory: number }) => {
          const [affectedRows] = await Inventory.decrement(
            "availableQuantity",
            {
              by: orderItem.quantity,
              where: { id: orderItem.inventory },
              transaction: t,
            }
          );

          if (affectedRows === 0) {
            throw new Error(
              `Inventory with ID ${orderItem.inventory} not found or insufficient quantity`
            );
          }
        }
      );

      // Wait for all decrement operations to complete
      await Promise.all(decrementPromises);

      // Create new Order
      const newOrder = await Order.create({ userId: req.user.id }, { transaction: t });

      if (!newOrder) {
        throw new Error(ResponseMessages.ORDER_ADD_FAILURE);
      }

      const newOrderItemsPayload = availabilityResponse?.map((orderItem: { inventory: number }) => {
        const { inventory, ...payload } = orderItem;
        return { orderId: newOrder.id, inventoryId: inventory, ...payload };
      });

      // Create new OrderItems
      await OrderItem.bulkCreate(newOrderItemsPayload, { transaction: t });

      // Update order status to COMPLETED
      newOrder.status = "COMPLETED";
      await newOrder.save({ transaction: t });

      // Commit the transaction
      await t.commit();

      return { status: true, data: newOrder };
    } catch (error) {
      await t.rollback();
      return { status: false, message: ResponseMessages.ORDER_ADD_FAILURE };
    }
  }

  
  private async checkInventoryAvailability(
    orderItems: IInventoryAvailability[]
  ): Promise<IInventoryAvailability[] | null> {
    try {
      const inventoryIds = orderItems.map((item) => item.inventory);

      // Fetch inventories with their available quantities
      const inventories = await Inventory.findAll({
        where: {
          id: inventoryIds,
          deletedAt: null,
        },
        attributes: ["id", "availableQuantity", "price"],
      });

      // Create a map of inventoryId to availableQuantity
      const inventoryMap = inventories.reduce((map, inventory) => {
        map[inventory.id] = inventory;
        return map;
      }, {});

      // Check quantities
      for (const item of orderItems) {
        if (
          item.quantity >
          (inventoryMap?.[item?.inventory]?.availableQuantity || 0)
        ) {
          return null; // Return null if any quantity exceeds availableQuantity
        }

        item["perUnitPrice"] = inventoryMap?.[item?.inventory]?.price;
        item["totalAmount"] =
          item.quantity * inventoryMap?.[item?.inventory]?.price;
      }

      return orderItems; // Return orderItems if all quantities are valid
    } catch (error) {
      throw error;
    }
  }
}

export default Orderservice;
