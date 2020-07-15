import { Router } from "express";

const appointmentsRouter = Router();

appointmentsRouter.get("", (request, response) => {
  console.log("Incoming get Request - Create Appointment");
  // appointments_table: id, appointment_title, appointment_address, appointment_start, appointment_end, appointment_duration, create_time
  return response.send("Get Appointments");
});

appointmentsRouter.post("", (request, response) => {
  console.log("Incoming post Request - Create Appointment");
  // appointments_table: id, appointment_title, appointment_address, appointment_start, appointment_end, appointment_duration, create_time
  return response.send("post Appointments");
});

export default appointmentsRouter;
