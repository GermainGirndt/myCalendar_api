import { Router } from "express";

const availableTimeRouter = Router();

availableTimeRouter.get("", (request, response) => {
  console.log("Incoming GET Request - List avaiable time");
  return response.send("Incoming GET Request - List Available Time");
});

availableTimeRouter.post("", (request, response) => {
  console.log("Incoming Post Request - Create Free Time Entry");

  // available_table: id, available_start, available_end, service_provider[one -> one], appointment_type_id[one -> one], create_time
  return response.send("Incoming POST Request - Create Available Time");
});
export default availableTimeRouter;
