import "dotenv/config";
import nodemailer from "nodemailer";

console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS ? "OK cargada" : "NO cargada");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendPasswordResetEmail = async (to, resetLink) => {
  return await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: "Recuperación de contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Este enlace expirará en 1 hora.</p>
        <a
          href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#111;
            color:#fff;
            text-decoration:none;
            border-radius:8px;
            margin-top:10px;
          "
        >
          Restablecer contraseña
        </a>
      </div>
    `
  });
};