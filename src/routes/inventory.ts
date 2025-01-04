import { Router, Request, Response } from "express";

import Inventoryservice from "../service/inventory.service";
import { errorResponse, successResponse } from "../common/response";
import HttpStatusCodes from "../constants/httpStatusCodes";
import { ResponseMessages } from "../constants/responseMessages";
import { InventoryValidation } from "../validations/inventory.validation";
import { validateRole } from "../middlewares/validateRole.middleware";
import { SYSTEM_ROLES } from "../constants/user";

const router = Router();
const inventory = new Inventoryservice();

// Add new Inventory
router.post(
  "/",
  validateRole(SYSTEM_ROLES.ADMIN),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const valid = InventoryValidation.addInventorySchema.validate(req.body);
      if (valid.error) {
        return errorResponse(
          res,
          valid.error.message,
          HttpStatusCodes.UNPROCESSABLE_ENTITY
        );
      }
      const inventroyResponse = await inventory.add(req);

      if (!inventroyResponse?.status && inventroyResponse?.message) {
        throw new Error(inventroyResponse?.message);
      }

      return res
        .status(HttpStatusCodes.OK)
        .json(
          successResponse(
            ResponseMessages.INVENTORY_ADD_SUCCESSFULLY,
            inventroyResponse
          )
        );
    } catch (error) {
      return errorResponse(res, error.message, HttpStatusCodes.BAD_REQUEST);
    }
  }
);

// Update new Inventory
router.put(
  "/:id",
  validateRole(SYSTEM_ROLES.ADMIN),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const valid = InventoryValidation.editInventorySchema.validate({
        id: +req.params.id,
        ...req.body,
      });
      if (valid.error) {
        return errorResponse(
          res,
          valid.error.message,
          HttpStatusCodes.UNPROCESSABLE_ENTITY
        );
      }
      const inventroyResponse = await inventory.update(req);

      if (!inventroyResponse?.status && inventroyResponse?.message) {
        throw new Error(inventroyResponse?.message);
      }

      return res
        .status(HttpStatusCodes.OK)
        .json(
          successResponse(
            ResponseMessages.INVENTORY_UPDATE_SUCCESSFULLY,
            inventroyResponse
          )
        );
    } catch (error) {
      return errorResponse(res, error.message, HttpStatusCodes.BAD_REQUEST);
    }
  }
);

// Fetch all OR single Inventory
router.get("/:id?", async (req: Request, res: Response): Promise<any> => {
  try {
    const inventroyResponse = await inventory.get(req);

    if (!inventroyResponse?.status && inventroyResponse?.message) {
      throw new Error(inventroyResponse?.message);
    }

    return res
      .status(HttpStatusCodes.OK)
      .json(
        successResponse(
          ResponseMessages.INVENTORY_FETCHED_SUCCESSFULLY,
          inventroyResponse
        )
      );
  } catch (error) {
    return errorResponse(res, error.message, HttpStatusCodes.BAD_REQUEST);
  }
});

// Delete Inventory
router.delete(
  "/:id",
  validateRole(SYSTEM_ROLES.ADMIN),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const valid = InventoryValidation.deleteInventorySchema.validate({ id: +req.params.id });
      if (valid.error) {
        return errorResponse(
          res,
          valid.error.message,
          HttpStatusCodes.UNPROCESSABLE_ENTITY
        );
      }
      const inventroyResponse = await inventory.delete(req);

      if (!inventroyResponse?.status && inventroyResponse?.message) {
        throw new Error(inventroyResponse?.message);
      }

      return res
        .status(HttpStatusCodes.OK)
        .json(
          successResponse(
            ResponseMessages.INVENTORY_DELETED_SUCCESSFULLY,
            inventroyResponse
          )
        );
    } catch (error) {
      return errorResponse(res, error.message, HttpStatusCodes.BAD_REQUEST);
    }
  }
);

export default router;
