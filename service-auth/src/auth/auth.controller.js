import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { registerUser, loginUser } from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { name, surname, email, password, phone, profilePicture } = req.body;

  const user = await registerUser({ name, surname, email, password, phone, profilePicture });

  res.status(201).json({
    success: true,
    message: 'Usuario registrado correctamente',
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
