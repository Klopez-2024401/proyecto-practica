import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import {
  registerUser,
  loginUser,
  setProfilePicture,
  verifyEmail as verifyEmailService,
  resendVerification as resendVerificationService,
  changePassword as changePasswordService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { name, surname, email, password, phone, profilePicture } = req.body;

  const user = await registerUser({ name, surname, email, password, phone, profilePicture });

  res.status(201).json({
    success: true,
    message: 'Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta.',
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { token, user } = await loginUser(email, password);

  res.status(200).json({
    success: true,
    message: 'Login exitoso',
    token,
    user,
  });
});

export const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Debes enviar un archivo de imagen en el campo "profilePicture"',
    });
  }

  const userId = req.usuario.sub;
  const user = await setProfilePicture(userId, req.file.path);

  res.status(200).json({
    success: true,
    message: 'Foto de perfil actualizada correctamente',
    user,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, token } = req.body;

  const user = await verifyEmailService(email, token);

  res.status(200).json({
    success: true,
    message: 'Cuenta verificada correctamente',
    user,
  });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await resendVerificationService(email);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.usuario.sub;

  const user = await changePasswordService(userId, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: 'Contraseña actualizada correctamente',
    user,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  const result = await resetPasswordService(email, token, newPassword);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
