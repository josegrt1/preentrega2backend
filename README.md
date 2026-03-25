# Backend II - Primera Entrega

Implementación de un sistema de autenticación y autorización con JWT utilizando Passport sobre un ecommerce desarrollado con Node.js, Express y MongoDB.

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- MongoDB (Mongoose)
- Passport
- JWT (jsonwebtoken)
- bcrypt
- Socket.io
- Handlebars

---

## 📦 Instalación

Instalar dependencias:

npm install

Crear archivo .env basado en .env.example:

MONGO_URL=tu_string_de_mongo
PORT=8080
JWT_SECRET=tu_clave_secreta
JWT_COOKIE_NAME=authToken

Ejecutar el servidor:

npm run dev

Servidor disponible en:

http://localhost:8080
🔐 Endpoints de Autenticación
📝 Registro

POST /api/sessions/register

{
  "first_name": "Jose",
  "last_name": "Rodriguez",
  "email": "jose@test.com",
  "age": 30,
  "password": "1234"
}
🔑 Login

POST /api/sessions/login

{
  "email": "jose@test.com",
  "password": "1234"
}

Genera un token JWT almacenado en cookie.

👤 Usuario Actual

GET /api/sessions/current

Devuelve los datos del usuario autenticado mediante JWT.

🛡️ Características implementadas

Modelo User con:

first_name

last_name

email (único)

age

password (hash bcrypt)

cart (referencia a Cart)

role (default: user)

Encriptación de contraseña con bcrypt.hashSync

Estrategia Passport Local para login

Estrategia Passport JWT

Estrategia "current" para validación de usuario

Sistema de autenticación mediante JWT en cookies

📌 Notas

No se incluye node_modules.

Variables sensibles gestionadas mediante .env.
