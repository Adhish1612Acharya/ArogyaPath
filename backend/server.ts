import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.json("Success");
});

const port = 3000;

app.listen(port, () => {
  console.log("Server listening on port : ", port);
});
