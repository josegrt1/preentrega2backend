import UsersRepository from "../repositories/users.repository.js";
import CartsRepository from "../repositories/carts.repository.js";
import { createHash, isValidPassword } from "../utils/password.js";
import CurrentUserDTO from "../dto/CurrentUser.dto.js";
import { generateResetToken, verifyResetToken } from "../utils/resetToken.js";
import { sendPasswordResetEmail } from "../utils/mailing.js";

const usersRepository = new UsersRepository();
const cartsRepository = new CartsRepository();

export default class SessionsService {
  async registerUser(userData) {
    const { first_name, last_name, email, age, password } = userData;

    if (!first_name || !last_name || !email || !age || !password) {
      const error = new Error("Faltan campos");
      error.statusCode = 400;
      throw error;
    }

    const exists = await usersRepository.getUserByEmail(email);
    if (exists) {
      const error = new Error("Email ya registrado");
      error.statusCode = 409;
      throw error;
    }

    const newCart = await cartsRepository.createCart({ products: [] });

    const newUser = await usersRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: "user"
    });

    return {
      status: "success",
      message: "Usuario creado",
      payload: {
        id: newUser._id,
        email: newUser.email
      }
    };
  }

  getCurrentUser(user) {
    return {
      status: "success",
      payload: new CurrentUserDTO(user)
    };
  }

  async forgotPassword(email) {
    if (!email) {
      const error = new Error("Debes enviar un email");
      error.statusCode = 400;
      throw error;
    }

    const user = await usersRepository.getUserByEmail(email);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const token = generateResetToken({
      id: user._id.toString(),
      email: user.email,
      purpose: "reset_password"
    });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return {
      status: "success",
      message: "Correo de recuperación enviado"
    };
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      const error = new Error("Token y nueva contraseña son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    let payload;
    try {
      payload = verifyResetToken(token);
    } catch (err) {
      const error = new Error("Token inválido o expirado");
      error.statusCode = 401;
      throw error;
    }

    if (payload.purpose !== "reset_password") {
      const error = new Error("Token inválido");
      error.statusCode = 401;
      throw error;
    }

    const user = await usersRepository.getUserById(payload.id);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const samePassword = isValidPassword(newPassword, user.password);
    if (samePassword) {
      const error = new Error("No puedes usar la misma contraseña anterior");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = createHash(newPassword);
    await usersRepository.updateUserPassword(user._id, hashedPassword);

    return {
      status: "success",
      message: "Contraseña restablecida correctamente"
    };
  }
}