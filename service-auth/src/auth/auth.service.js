import { User } from './auth.model.js';
import { hashPassword, verifyPassword } from '../../utils/password-utils.js';
import { generateJWT } from '../../helper/generate-jwt.js';

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  surname: user.surname,
  email: user.email,
  phone: user.phone,
  profilePicture: user.profilePicture,
  status: user.status,
  createdAt: user.createdAt,
});

export const registerUser = async ({ name, surname, email, password, phone, profilePicture }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('Ya existe un usuario con este correo electrónico');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name,
    surname,
    email,
    password: hashedPassword,
    phone,
    profilePicture,
  });

  return buildUserResponse(newUser);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
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
    const error = new Error('Tu cuenta está desactivada. Contacta al administrador.');
    error.statusCode = 423;
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
