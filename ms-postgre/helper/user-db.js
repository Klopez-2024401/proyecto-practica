import {
  User,
  UserProfile,
  UserEmail,
  UserPasswordReset,
  Role,
  UserRole,
} from '../src/User/User.model.js';
import { USER_ROLE } from './role-constants.js';
import { hashPassword } from '../utils/password-utils.js';
import { Op } from 'sequelize';

export const findUserByEmailOrUsername = async (emailOrUsername) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { Email: emailOrUsername.toLowerCase() },
          { Username: emailOrUsername.toLowerCase() },
        ],
      },
      include: [
        { model: UserProfile, as: 'UserProfile' },
        { model: UserEmail, as: 'UserEmail' },
        { model: UserPasswordReset, as: 'UserPasswordReset' },
        {
          model: UserRole,
          as: 'UserRoles',
          include: [{ model: Role, as: 'Role' }],
        },
      ],
    });

    return user;
  } catch (error) {
    console.error('Error buscando usuario:', error);
    throw new Error('Error al buscar usuario');
  }
};

export const findUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [
        { model: UserProfile, as: 'UserProfile' },
        { model: UserEmail, as: 'UserEmail' },
        { model: UserPasswordReset, as: 'UserPasswordReset' },
        {
          model: UserRole,
          as: 'UserRoles',
          include: [{ model: Role, as: 'Role' }],
        },
      ],
    });

    return user;
  } catch (error) {
    console.error('Error buscando usuario por ID:', error);
    throw new Error('Error al buscar usuario');
  }
};

export const checkUserExists = async (email, username) => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { Email: email.toLowerCase() },
          { Username: username.toLowerCase() },
        ],
      },
    });

    return !!existingUser;
  } catch (error) {
    console.error('Error verificando si el usuario existe:', error);
    throw new Error('Error al verificar usuario');
  }
};

export const createNewUser = async (userData, roleName) => {
  const transaction = await User.sequelize.transaction();

  try {
    const { name, surname, username, email, password, phone, profilePicture } =
      userData;

    const hashedPassword = await hashPassword(password);

    const user = await User.create(
      {
        Name: name,
        Surname: surname,
        Username: username.toLowerCase(),
        Email: email.toLowerCase(),
        Password: hashedPassword,
        Phone: phone,
        Status: false,
      },
      { transaction }
    );

    await UserProfile.create(
      {
        UserId: user.Id,
        Phone: phone,
        ProfilePicture: profilePicture || '',
      },
      { transaction }
    );

    await UserEmail.create(
      {
        UserId: user.Id,
        EmailVerified: false,
      },
      { transaction }
    );

    await UserPasswordReset.create(
      {
        UserId: user.Id,
      },
      { transaction }
    );

    const targetRoleName = roleName ? roleName.toString().trim() : USER_ROLE;
    const targetRole = await Role.findOne({
      where: { Name: targetRoleName },
      transaction,
    });

    if (targetRole) {
      await UserRole.create(
        {
          UserId: user.Id,
          RoleId: targetRole.Id,
        },
        { transaction }
      );
    }

    await transaction.commit();

    const completeUser = await findUserById(user.Id);
    return completeUser;
  } catch (error) {
    await transaction.rollback();
    console.error('Error creando usuario:', error);
    throw new Error('Error al crear usuario');
  }
};

export const markEmailAsVerified = async (userId) => {
  try {
    await UserEmail.update(
      {
        EmailVerified: true,
        EmailVerificationToken: null,
        EmailVerificationTokenExpiry: null,
      },
      {
        where: { UserId: userId },
      }
    );

    await User.update({ Status: true }, { where: { Id: userId } });
  } catch (error) {
    console.error('Error marcando email como verificado:', error);
    throw new Error('Error al verificar email');
  }
};

/**
 * Asigna un rol a un usuario (reemplaza el rol anterior)
 * El usuario solo puede tener UN rol a la vez
 * Validaciones:
 * - El usuario debe existir
 * - El rol debe existir
 * - Elimina el rol anterior y asigna el nuevo
 */
export const assignRoleToUser = async (userId, newRoleName) => {
  const transaction = await User.sequelize.transaction();

  try {
    // Validar que el usuario existe
    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserRole,
          as: 'UserRoles',
          include: [{ model: Role, as: 'Role' }],
        },
      ],
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Validar que el rol existe
    const newRole = await Role.findOne({
      where: { Name: newRoleName },
      transaction,
    });

    if (!newRole) {
      throw new Error(`Rol '${newRoleName}' no existe`);
    }

    // Eliminar todos los roles anteriores
    await UserRole.destroy(
      {
        where: { UserId: userId },
        transaction,
      }
    );

    // Crear la nueva relación de rol
    await UserRole.create(
      {
        UserId: userId,
        RoleId: newRole.Id,
      },
      { transaction }
    );

    await transaction.commit();

    // Retornar el usuario actualizado
    const updatedUser = await findUserById(userId);
    return updatedUser;
  } catch (error) {
    await transaction.rollback();
    console.error('Error asignando rol al usuario:', error);
    throw error;
  }
};
