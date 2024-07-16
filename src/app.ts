import "reflect-metadata";
import "express-async-errors";

import express, { json } from "express";
import { addressRoute } from "./address/routes";
import { productRoute } from "./products/routes";
import { storeRoutes } from "./store/routes";
import { employeeRoutes } from "./employee/routes";
import { employeeAuthRouter } from "./employee.auth/routes";
import { clientAuthenticationRouter } from "./client_authentication/routes";

export const app = express();

app.use(json());
app.use("/address", addressRoute);
// app.use("/products",productRoute);
app.use("/store", storeRoutes);
app.use("/employee", employeeRoutes);
app.use("/employeeLogin", employeeAuthRouter);
app.use("/login", clientAuthenticationRouter);
