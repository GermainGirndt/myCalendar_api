import * as express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log("Access");
  return res.send("Hi");
});

export default app;
