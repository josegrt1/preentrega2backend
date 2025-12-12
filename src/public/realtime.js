console.log("✅ realtime.js cargado");

const socket = io();

socket.on("connect", () => {
  console.log("🟢 Conectado al servidor de sockets. ID:", socket.id);
});

const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");
const productsContainer = document.getElementById("productsContainer");


productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(productForm).entries());
  data.price = Number(data.price);
  data.stock = Number(data.stock);

  console.log("📤 Enviando newProduct:", data);
  socket.emit("newProduct", data);
  productForm.reset();
});


deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = new FormData(deleteForm).get("id");
  console.log("📤 Enviando deleteProduct:", id);
  socket.emit("deleteProduct", id);
  deleteForm.reset();
});


socket.on("updatedProducts", (products) => {
  console.log("📥 updatedProducts recibido:", products);
  productsContainer.innerHTML = "";

  products.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p>Precio: $${p.price}</p>
      <p>ID: ${p.id}</p>
    `;
    productsContainer.appendChild(div);
  });
});

socket.on("errorMessage", (msg) => {
  alert(msg);
});
