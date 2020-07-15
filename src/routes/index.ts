import { Router } from "express";

import appointments from "./appointments";
import clientRouter from "./client";
import serviceProviders from "./service_providers";
// import appointmentsRouter from "./appointments.routes";

const routes = Router();

routes.use("/appointments", appointments);
routes.use("/clients", clientRouter);
routes.use("/service-providers", serviceProviders);
export default routes;
