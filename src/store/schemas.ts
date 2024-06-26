import { z } from "zod";
import { addressSchema } from "../address/schemas";
import { productSchema } from "../products/schemas";
import { orderSchema } from "../order/schemas";
import { clientSchema } from "../client/schemas";
import { employeeSchema } from "../employee/schemas";

export const storeSchema = z.object({
    id: z.number(),
    publicId: z.string(),
    name: z.string().max(255).min(1),
    CNPJ: z.string().max(14).min(1),
    adressId: z.number(),
});

// export const returnStoreSchema = storeSchema.omit({id: true});

export const returnStoreSchema = storeSchema.extend({adress: addressSchema.nullish(), products: productSchema.nullish(), orders: orderSchema.nullish(), clients: clientSchema.nullish(), employees: employeeSchema.nullish()}).omit({id: true});

export const createStoreSchema = storeSchema.omit({id: true, publicId: true});

export const updateStoreSchema = createStoreSchema.pick({name: true, CNPJ: true}).partial();

export type TReturnStore = z.infer<typeof returnStoreSchema>;

export type TCreateStore = z.infer<typeof createStoreSchema>;

export type TUpdateStore = z.infer<typeof updateStoreSchema>;


// adress: z.array(addressSchema).nullish(),
// products: z.array(productSchema).nullish(),
// orders: z.array(orderSchema).nullish(),
// clients: z.array(clientSchema).nullish(),
// employees: z.array(employeeSchema).nullish(),


