import { z } from "zod";
import { addressSchema, returnAddressBodySchema } from "../address/schemas";


export const storeSchema = z.object({
    id: z.number(),
    publicId: z.string(),
    name: z.string().max(255).min(1),
    CNPJ: z.string().max(14).min(1),
    addressId: z.number(),
});

export const returnStoreSchema = storeSchema.extend({address: returnAddressBodySchema.nullish()}).omit({id: true,addressId:true});

export const getStoreSchema = returnStoreSchema.omit({ address: true});

export const createStoreSchema = storeSchema.omit({id: true, addressId:true}).extend({address:addressSchema});

export const updateStoreSchema = createStoreSchema.partial();


