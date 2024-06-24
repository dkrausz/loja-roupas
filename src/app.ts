import "reflect-metadata";
import "express-async-errors";

import express, { json } from "express";
import { addressRoute } from "./address/routes";
import { productRoute } from "./products/routes";



export const app = express();

app.use(json());
app.use("/address",addressRoute);
app.use("/products",productRoute);