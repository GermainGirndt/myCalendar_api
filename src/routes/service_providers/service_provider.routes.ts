import { Router } from "express";

const serviceProviderRouter = Router();

serviceProviderRouter.get("", (request, response) => {
  console.log("Incoming GET Request - Create Service Provider");
  return response.send("Incoming GET Request - List Client");
});

serviceProviderRouter.post("", (request, response) => {
  console.log("Incoming Post Request - Create Service Provider");
  console.log(request);
  const { name } = request.body;
  // service_providers_table: id, name, create_time
  return response.send("Incoming POST Request - Create Client");
});

export default serviceProviderRouter;
