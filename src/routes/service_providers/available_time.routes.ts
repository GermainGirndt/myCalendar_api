import { Router } from "express";

const avilableTimeRouter = Router();

avilableTimeRouter.get("", (request, response) => {
  console.log("Incoming Post Request - Create Free Time Entry");
  // available_table: id, available_start, available_end, service_provider[one -> one], appointment_type_id[one -> one], create_time
});

export default avilableTimeRouter;
