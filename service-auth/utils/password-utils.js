import argon2 from 'argon2';

export const hashPassword = async (password) => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error('Error al hashear password:', error);
    throw new Error('Error al procesar contraseña');
  }
};

export const verifyPassword = async (hashedPassword, password) => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Error al verificar password:', error);
    throw new Error('Error al verificar contraseña');
  }
};
