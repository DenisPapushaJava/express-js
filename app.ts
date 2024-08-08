import express, { Request, Response, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { PORT } from "./constants";
import { connectDB } from "./connectDB";
import router from "./router";
import errorMiddleware from "./middlewares/error-middleware";

const app = express();
const secretKey = "store";
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

connectDB()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
      })
    } catch (error) {
      console.log(error);
    }
  });
