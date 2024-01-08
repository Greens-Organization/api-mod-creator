import "dotenv/config";
import express from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";
import connectDB from "./database/mongodb";
import { validateAccessKeyMiddleware } from "./middlewares/validateAccessKeyMiddleware";

const app = express();
app.use(express.json());

connectDB();

app.use(cookieParser()); // USe coookies

app.use("/api", validateAccessKeyMiddleware);

app.use("/api", routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running! Port ${PORT}`);
});
