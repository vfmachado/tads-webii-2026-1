import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import { ensureDefaultAdmin } from "./bootstrap/ensure-default-admin";
import accessRoutes from "./modules/access/interfaces/http/access.routes";
import usersRoutes from "./modules/access/interfaces/http/users.routes";

const app = express();
const port = Number(process.env.PORT || 3333);
const corsOrigin = process.env.CORS_ORIGIN || "*";
const allowedOrigins = corsOrigin.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: corsOrigin === "*" ? true : allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use("/auth", accessRoutes);
app.use("/users", usersRoutes);

async function startServer() {
  await ensureDefaultAdmin();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

void startServer();
