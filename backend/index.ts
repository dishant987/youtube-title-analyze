import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import videosRouter from "./routes/videos.js";
dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(bodyParser.json({ limit: "1mb" }));

app.use(morgan(":method :url :status :response-time ms"));

app.use("/api/videos", videosRouter);

// app.use("/", (req, res) => {
//   res.send("working fine!");
// });

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
