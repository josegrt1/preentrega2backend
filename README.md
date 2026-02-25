## 🔐 Sistema de Autenticación

Se implementó un sistema completo de autenticación y autorización utilizando:

- Passport (Local + JWT)
- bcrypt para encriptación de contraseñas
- JSON Web Tokens almacenados en cookies httpOnly

---

### 📝 Registro de Usuario

POST `/api/sessions/register`

```json
{
  "first_name": "Jose",
  "last_name": "Rodriguez",
  "email": "jose@test.com",
  "age": 30,
  "password": "1234"
}

La contraseña se almacena en formato hash utilizando bcrypt.

Al registrarse se crea automáticamente un carrito asociado al usuario.

🔑 Login

POST /api/sessions/login

{
  "email": "jose@test.com",
  "password": "1234"
}

Si las credenciales son correctas, se genera un JWT.

El token se guarda en una cookie httpOnly.

👤 Usuario Actual

GET /api/sessions/current

Valida el JWT almacenado en la cookie.

Devuelve los datos del usuario autenticado.

Si el token es inválido o inexistente, devuelve error 401.
