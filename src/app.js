import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.use("/", viewsRouter);


const productManager = new ProductManager(
  path.join(__dirname, "data", "products.json")
);


io.on("connection", async (socket) => {
  console.log("💬 Cliente conectado:", socket.id);


  const products = await productManager.getProducts();
  socket.emit("updatedProducts", products);


  socket.on("newProduct", async (data) => {
    console.log("📩 newProduct recibido:", data);
    try {
      await productManager.addProduct(data);
      const updated = await productManager.getProducts();
      io.emit("updatedProducts", updated);
    } catch (error) {
      console.log("❌ Error al crear producto:", error);
      socket.emit("errorMessage", "No se pudo crear el producto");
    }
  });


  socket.on("deleteProduct", async (id) => {
    console.log("🗑 deleteProduct recibido:", id);
    try {
      await productManager.deleteProduct(Number(id));
      const updated = await productManager.getProducts();
      io.emit("updatedProducts", updated);
    } catch (error) {
      console.log("❌ Error al eliminar producto:", error);
      socket.emit("errorMessage", "No se pudo eliminar el producto");
    }
  });
});


httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
