import "reflect-metadata";
import "express-async-errors";

import express, { json } from "express";
import { addressRoute } from "./address/routes";
import { productRoute } from "./products/routes";
import { storeRoutes } from "./store/routes";
import { employeeRoutes } from "./employee/routes";
import { clientAuthenticationRouter } from "./client_auth/routes";
import { clientRouter } from "./client/routes";
import { orderRouter } from "./order/routes";
import { HandleErrors } from "./@shared/handleErrors";
import { IStoreId } from "./store/interfaces";
import { initStore } from "./configs/initStore.config";
import helmet from "helmet";

export let loadedStore: IStoreId = { id: 0 };

export const app = express();

const initApp = async () => {
  await initStore(loadedStore);
};


initApp();
app.use(helmet());
app.use(json());
app.use("/address", addressRoute);
app.use("/products", productRoute);
app.use("/store", storeRoutes);
app.use("/employee", employeeRoutes);
app.use("/login", clientAuthenticationRouter);
app.use("/clients", clientRouter);
app.use("/orders", orderRouter);
app.use(HandleErrors.execute);
