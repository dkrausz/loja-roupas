import { z } from "zod";
import { createStoreSchema, getStoreSchema, returnStoreSchema, updateStoreSchema } from "./schemas";

type TReturnStore = z.infer<typeof returnStoreSchema>;

type TGetStore = z.infer<typeof getStoreSchema>;

type TCreateStore = z.infer<typeof createStoreSchema>;

type TUpdateStore = z.infer<typeof updateStoreSchema>;

export { TReturnStore, TGetStore, TCreateStore, TUpdateStore };
