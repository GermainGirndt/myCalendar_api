import * as express from "express";
import routes from "./routes";
const app = express();

app.use(routes);

app.listen(3003, () => {
  console.log("Server started at port 3000!");
});
