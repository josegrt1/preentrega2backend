console.log("✅ realtime.js cargado");

const socket = io();

socket.on("connect", () => {
  console.log("🟢 Conectado al servidor de sockets. ID:", socket.id);
});

const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");
const productsContainer = document.getElementById("productsContainer");


productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(productForm).entries());
  data.price = Number(data.price);
  data.stock = Number(data.stock);

  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    productForm.reset();
  } catch (error) {
    alert("Error al crear producto");
    console.error(error);
  }
});


deleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = new FormData(deleteForm).get("id");

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    deleteForm.reset();
  } catch (error) {
    alert("Error al eliminar producto");
    console.error(error);
  }
});


socket.on("updatedProducts", (products) => {
  console.log("📥 updatedProducts recibido:", products);
  productsContainer.innerHTML = "";

  products.forEach((p) => {
    const article = document.createElement("article");
    article.classList.add("product-card");

    article.innerHTML = `
      <header class="product-card__header">
        <h3 class="product-card__title">${p.title}</h3>
        <span class="product-card__price">$${p.price}</span>
      </header>

      <p class="product-card__description">${p.description}</p>

      <ul class="product-card__meta">
        <li><strong>Categoría:</strong> ${p.category}</li>
        <li><strong>Código:</strong> ${p.code}</li>
        <li><strong>Stock:</strong> ${p.stock}</li>
        <li><strong>ID:</strong> ${p._id}</li>
      </ul>
    `;

    productsContainer.appendChild(article);
  });
});
