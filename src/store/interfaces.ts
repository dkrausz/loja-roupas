import { z } from "zod";
import {
  createStoreSchema,
  getStoreSchema,
  returnStoreSchema,
  storeSchema,
  updateStoreSchema,
} from "./schemas";

interface IStoreId {
  id: number;
}

type TStore = z.infer<typeof storeSchema>;

type TReturnStore = z.infer<typeof returnStoreSchema>;

type TGetStore = z.infer<typeof getStoreSchema>;

type TCreateStore = z.infer<typeof createStoreSchema>;

type TUpdateStore = z.infer<typeof updateStoreSchema>;

export {
  TReturnStore,
  TGetStore,
  TCreateStore,
  TUpdateStore,
  TStore,
  IStoreId,
};
