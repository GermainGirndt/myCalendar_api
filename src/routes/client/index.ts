import { Router } from "express";
import clients from "./clients.routes";

const routes = Router();
routes.use("/", clients);

export default routes;
