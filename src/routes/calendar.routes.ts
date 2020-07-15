import * as express from "express";

const app = express();

app.get("/", (request, response) => {
  console.log("Incoming Post Request - Create Service Provider");
  return response.send("Hi");
});

app.post("/service_provider/", (request, response) => {
  console.log("Incoming Post Request - Create Service Provider");
  // service_providers_table: id, name, create_time
});

app.post("/service_provider/free-time", (request, response) => {
  console.log("Incoming Post Request - Create Service Provider");
  // free_time_table: id, free_time_start, free_time_end, service_provider[one -> one], appointment_type_id[one -> one], create_time
});

app.post("/service_provider/appointments", (request, response) => {
  console.log("Incoming Post Request - Create Service Provider");
  // appointments_table: id, appointment_title, appointment_address, appointment_start, appointment_end, appointment_duration, create_time
});

app.post("/client/", (request, response) => {
  console.log("Incoming Post Request - Create Service Provider");
  // client_table: id, name, create-time
});

export default app;
