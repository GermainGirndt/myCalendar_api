import { Router } from "express";

const appointmentsRouter = Router();

appointmentsRouter.get("", (request, response) => {
  console.log("Incoming Post Request - Create Appointment");
  // appointments_table: id, appointment_title, appointment_address, appointment_start, appointment_end, appointment_duration, create_time
});

export default appointmentsRouter;
