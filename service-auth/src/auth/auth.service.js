import { User } from './auth.model.js';
import { hashPassword, verifyPassword } from '../../utils/password-utils.js';
import { generateJWT } from '../../helper/generate-jwt.js';
import { generateToken, hashToken } from '../../helper/token-utils.js';
import { sendMail } from '../../helper/mailer.js';
import { config } from '../../configs/config.js';

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  surname: user.surname,
  username: user.username,
  email: user.email,
  phone: user.phone,
  profilePicture: user.profilePicture || config.cloudinary.defaultAvatarUrl,
  status: user.status,
  createdAt: user.createdAt,
});

const getExpiryDate = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);

const sendVerificationEmail = (user, token) =>
  sendMail({
    to: user.email,
    subject: 'Verifica tu cuenta',
    html: `<p>Hola ${user.name},</p>
      <p>Tu código de verificación es: <strong>${token}</strong></p>
      <p>También puedes verificar tu cuenta entrando a este enlace:</p>
      <p><a href="${config.frontendUrl}/verify-email?email=${encodeURIComponent(user.email)}&token=${token}">Verificar cuenta</a></p>
      <p>Este código expira en ${config.verification.emailExpiryHours} horas.</p>`,
  });

export const registerUser = async ({ name, surname, username, email, password, phone, profilePicture }) => {
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });
  if (existingUser) {
    const isDuplicateEmail = existingUser.email === email.toLowerCase();
    const error = new Error(
      isDuplicateEmail
        ? 'Ya existe un usuario con este correo electrónico'
        : 'Ya existe un usuario con este nombre de usuario'
    );
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const { token, tokenHash } = generateToken();

  const newUser = await User.create({
    name,
    surname,
    username,
    email,
    password: hashedPassword,
    phone,
    profilePicture,
    status: false,
    emailVerificationToken: tokenHash,
    emailVerificationTokenExpiry: getExpiryDate(config.verification.emailExpiryHours),
  });

  await sendVerificationEmail(newUser, token);

  return buildUserResponse(newUser);
};

export const loginUser = async (emailOrUsername, password) => {
  const identifier = emailOrUsername.trim();
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
  });
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await verifyPassword(user.password, password);
  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  if (!user.status) {
    const error = new Error(
      'Debes verificar tu cuenta con el código enviado a tu correo antes de iniciar sesión.'
    );
    error.statusCode = 403;
    // Se incluye el correo real de la cuenta para poder reenviar el código de
    // verificación aunque el login se haya intentado con el username.
    error.data = { email: user.email };
    throw error;
  }

  const token = await generateJWT(user._id.toString(), {
    email: user.email,
    name: user.name,
  });

  return {
    token,
    user: buildUserResponse(user),
  };
};

export const setProfilePicture = async (userId, imageUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicture: imageUrl },
    { new: true, runValidators: true }
  );

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return buildUserResponse(user);
};

export const verifyEmail = async (email, token) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const error = new Error('Token de verificación inválido');
    error.statusCode = 400;
    throw error;
  }

  if (user.status) {
    const error = new Error('La cuenta ya fue verificada');
    error.statusCode = 409;
    throw error;
  }

  if (!user.emailVerificationToken) {
    const error = new Error('Token de verificación inválido');
    error.statusCode = 400;
    throw error;
  }

  if (user.emailVerificationTokenExpiry < new Date()) {
    const error = new Error('El código de verificación expiró, solicita uno nuevo');
    error.statusCode = 400;
    throw error;
  }

  if (hashToken(token) !== user.emailVerificationToken) {
    const error = new Error('Token de verificación inválido');
    error.statusCode = 400;
    throw error;
  }

  user.status = true;
  user.emailVerificationToken = null;
  user.emailVerificationTokenExpiry = null;
  await user.save();

  return buildUserResponse(user);
};

export const resendVerification = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && !user.status) {
    const { token, tokenHash } = generateToken();
    user.emailVerificationToken = tokenHash;
    user.emailVerificationTokenExpiry = getExpiryDate(config.verification.emailExpiryHours);
    await user.save();

    await sendVerificationEmail(user, token);
  }

  // No revela si el correo existe ni si ya estaba verificado, para evitar enumeración de usuarios
  return {
    message: 'Si el correo existe y la cuenta no ha sido verificada, se envió un nuevo código de verificación.',
  };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const isValidPassword = await verifyPassword(user.password, currentPassword);
  if (!isValidPassword) {
    const error = new Error('La contraseña actual no es correcta');
    error.statusCode = 401;
    throw error;
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return buildUserResponse(user);
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    const { token, tokenHash } = generateToken();
    user.passwordResetToken = tokenHash;
    user.passwordResetTokenExpiry = getExpiryDate(config.verification.passwordResetExpiryHours);
    await user.save();

    await sendMail({
      to: user.email,
      subject: 'Recupera tu contraseña',
      html: `<p>Hola ${user.name},</p>
        <p>Tu código para restablecer tu contraseña es: <strong>${token}</strong></p>
        <p><a href="${config.frontendUrl}/reset-password?email=${encodeURIComponent(user.email)}&token=${token}">Restablecer contraseña</a></p>
        <p>Este código expira en ${config.verification.passwordResetExpiryHours} hora(s).</p>`,
    });
  }

  // No revela si el correo existe o no, para evitar enumeración de usuarios
  return {
    message: 'Si el correo existe en nuestro sistema, se enviaron instrucciones para restablecer la contraseña.',
  };
};

export const resetPassword = async (email, token, newPassword) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.passwordResetToken) {
    const error = new Error('Token de restablecimiento inválido');
    error.statusCode = 400;
    throw error;
  }

  if (user.passwordResetTokenExpiry < new Date()) {
    const error = new Error('El token de restablecimiento expiró, solicita uno nuevo');
    error.statusCode = 400;
    throw error;
  }

  if (hashToken(token) !== user.passwordResetToken) {
    const error = new Error('Token de restablecimiento inválido');
    error.statusCode = 400;
    throw error;
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetToken = null;
  user.passwordResetTokenExpiry = null;
  await user.save();

  return { message: 'Contraseña actualizada correctamente' };
};
