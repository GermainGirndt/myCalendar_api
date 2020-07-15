import { Router } from "express";
import service_providers from "./service_provider.routes";
import available_time from "./available_time.routes";

const routes = Router();
routes.use("/", service_providers);
routes.use("/available-time", available_time);

export default routes;
