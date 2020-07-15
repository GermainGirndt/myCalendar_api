import { Router } from "express";

const clientsRouter = Router();

clientsRouter.get("", (request, response) => {
  console.log("Incoming Post Request - Create Client");
  // client_table: id, name, create-time
});

export default clientsRouter;
