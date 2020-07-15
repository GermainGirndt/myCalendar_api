import * as express from "express";

const app = express();

app.get("", (request, response) => {
  console.log("Incoming Post Request - Create Service Provider");
  // service_providers_table: id, name, create_time
});

export default app;
