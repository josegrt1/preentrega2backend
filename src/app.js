import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("json spaces", 2);

const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.set("io", io);

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

if (!process.env.MONGO_URL) {
  console.log("❌ Falta MONGO_URL en el .env");
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.log("❌ Error MongoDB:", err.message));

io.on("connection", (socket) => {
  console.log("💬 Cliente conectado:", socket.id);
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
