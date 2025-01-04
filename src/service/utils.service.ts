import { HASH_ROUND } from "../constants/env";
import bcrypt from "bcrypt";

export async function generateHash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(HASH_ROUND);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export async function verifyHash(password: string, hash:string): Promise<boolean> {
    return bcrypt.compareSync(password, hash);
}

export function removeUnwantedFields(obj: any, fieldsToRemove?: string[]) {
    let fieldsList = ["createdAt", "updatedAt", "deletedAt"];

    if (fieldsToRemove) {
        fieldsList = [...fieldsToRemove, ...fieldsList];
    }
    
    const result = { ...obj };
    
    // Remove specified fields
    fieldsList.forEach(field => {
      delete result[field];
    });
    
    return result;
}