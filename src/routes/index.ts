import { Router } from "express";

import calendarRouter from "./calendar.routes";

const routes = Router();

routes.use("/calendar", calendarRouter);

export default routes;
