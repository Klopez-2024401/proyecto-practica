import {
  checkUserExists,
  createNewUser,
  findUserByEmailOrUsername,
  markEmailAsVerified,
  findUserById,
} from './user-db.js';
import { USER_ROLE } from './role-constants.js';
import { verifyPassword } from '../utils/password-utils.js';
import { buildUserResponse } from '../utils/user-helpers.js';
import { generateJWT } from './generate-jwt.js';

const getExpirationTime = (timeString) => {
  const timeValue = parseInt(timeString);
  const timeUnit = timeString.replace(timeValue.toString(), '');

  switch (timeUnit) {
    case 's':
      return timeValue * 1000;
    case 'm':
      return timeValue * 60 * 1000;
    case 'h':
      return timeValue * 60 * 60 * 1000;
    case 'd':
      return timeValue * 24 * 60 * 60 * 1000;
    default:
      return 30 * 60 * 1000; // Default: 30 minutos
  }
};

export const registerUserHelper = async (userData) => {
  try {
    const {
      email,
      username,
      password,
      name,
      surname,
      phone,
      profilePicture,
      role = USER_ROLE,
    } = userData;

    const userExists = await checkUserExists(email, username);
    if (userExists) {
      throw new Error(
        'Ya existe un usuario con este email o nombre de usuario'
      );
    }

    const newUser = await createNewUser(
      {
        name,
        surname,
        username,
        email,
        password,
        phone,
        profilePicture: profilePicture,
      },
      role
    );

    await markEmailAsVerified(newUser.Id);

    return {
      success: true,
      user: buildUserResponse(newUser),
      message: 'Usuario creado correctamente.',
    };
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

export const loginUserHelper = async (emailOrUsername, password) => {
  try {
    const user = await findUserByEmailOrUsername(emailOrUsername);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await verifyPassword(user.Password, password);

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.UserEmail || !user.UserEmail.EmailVerified) {
      throw new Error(
        'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada o reenvía el email de verificación.'
      );
    }

    if (!user.Status) {
      throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
    }

    const role = user.UserRoles?.[0]?.Role?.Name;

    const token = await generateJWT(user.Id.toString(), {
      email: user.Email,
      name: user.Name,
      ...(role && { role })
    });

    const expiresInMs = getExpirationTime(process.env.JWT_EXPIRES_IN || '30m');
    const expiresAt = new Date(Date.now() + expiresInMs);

    const fullUser = buildUserResponse(user);
    const userDetails = fullUser;

    return {
      success: true,
      message: 'Login exitoso',
      token,
      userDetails,
      expiresAt,
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Helper para asignar roles a un usuario con validaciones de seguridad
 * Restricciones:
 * - Solo se puede AGREGAR roles, nunca QUITAR
 * - PLATFORM_ADMIN puede asignar cualquier rol
 * - CLIENT no puede asignar roles
 */
export const assignRoleHelper = async (
  requestingUserId,
  targetUserId,
  newRoleName
) => {
  try {
    // Importar aquí para evitar circular dependencies
    const { assignRoleToUser } = await import('./user-db.js');

    // Validar que el usuario destino existe
    const targetUser = await findUserById(targetUserId);
    if (!targetUser) {
      const err = new Error('Usuario destino no encontrado');
      err.status = 404;
      throw err;
    }

    // Validar que el usuario que solicita existe y obtener su rol
    const requestingUser = await findUserById(requestingUserId);
    if (!requestingUser) {
      const err = new Error('Usuario autenticado no encontrado');
      err.status = 401;
      throw err;
    }

    const requesterRole = requestingUser.UserRoles?.[0]?.Role?.Name || 'CLIENT';
    const targetRole = targetUser.UserRoles?.[0]?.Role?.Name || 'CLIENT';

    // Regla de seguridad: un PLATFORM_ADMIN solo puede cambiar SU PROPIO rol
    // cuando el usuario destino ya es PLATFORM_ADMIN.
    if (
      targetRole === 'PLATFORM_ADMIN' &&
      requestingUserId !== targetUserId
    ) {
      const err = new Error(
        'No puedes cambiar el rol de otro usuario PLATFORM_ADMIN. Solo ese admin puede cambiar su propio rol.'
      );
      err.status = 403;
      throw err;
    }

    // Validaciones de permisos
    // Solo PLATFORM_ADMIN puede asignar PLATFORM_ADMIN
    if (newRoleName === 'PLATFORM_ADMIN' && requesterRole !== 'PLATFORM_ADMIN') {
      const err = new Error(
        'Solo PLATFORM_ADMIN puede asignar el rol PLATFORM_ADMIN'
      );
      err.status = 403;
      throw err;
    }

    // CLIENT no puede asignar roles
    if (requesterRole === 'CLIENT') {
      const err = new Error('CLIENT no tiene permisos para asignar roles');
      err.status = 403;
      throw err;
    }

    // Validar que el rol que se intenta asignar existe en ALLOWED_ROLES
    const { ALLOWED_ROLES } = await import('./role-constants.js');
    if (!ALLOWED_ROLES.includes(newRoleName)) {
      const err = new Error(`Rol '${newRoleName}' no está permitido`);
      err.status = 400;
      throw err;
    }

    // Asignar el rol mediante user-db
    const updatedUser = await assignRoleToUser(targetUserId, newRoleName);

    return {
      success: true,
      message: `Rol '${newRoleName}' asignado exitosamente al usuario (rol anterior eliminado)`,
      user: buildUserResponse(updatedUser),
    };
  } catch (error) {
    console.error('Error en assignRoleHelper:', error);
    throw error;
  }
};
