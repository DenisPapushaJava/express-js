import express, { Request, Response } from "express";
import cors from "cors"
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let data = { message: "Response from Express JS" };

app.get("/api", (req: Request, res: Response) => {
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});