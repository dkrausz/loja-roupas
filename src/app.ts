import "reflect-metadata";
import "express-async-errors";

import express, { json } from "express";
import { addressRoute } from "./address/routes";
import { productRoute } from "./products/routes";
import { clientRouter } from "./client/routers";
import { orderRouter } from "./order/routers";

export const app = express();

app.use(json());
app.use("/clients", clientRouter);
app.use("/order", orderRouter);
