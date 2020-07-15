import { Router } from "express";

const clientsRouter = Router();

clientsRouter.get("", (request, response) => {
  console.log("Incoming GET Request - Create Client");
  // client_table: id, name, create-time
  return response.send("Incoming GET Request - Create Client");
});

clientsRouter.post("", (request, response) => {
  console.log("Incoming post Request - Create Client");
  // client_table: id, name, create-time
  return response.send("Incoming post Request - Create Client");
});

export default clientsRouter;
