import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { findUserById } from '../../helper/user-db.js';
import { buildUserResponse } from '../../utils/user-helpers.js';
import { Role, User, UserEmail, UserProfile, UserRole } from './User.model.js';
import {
  assignRoleHelper,
  registerUserHelper,
} from '../../helper/auth-operations.js';

const buildRoleResponse = (role) => ({
  id: role.Id,
  name: role.Name,
  createdAt: role.CreatedAt,
  updatedAt: role.UpdatedAt,
});

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }

    if (value.toLowerCase() === 'false') {
      return false;
    }
  }

  return null;
};

export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;

  const roleInclude = role
    ? { where: { Name: role }, required: true }
    : { required: false };

  const users = await User.findAll({
    attributes: { exclude: ['Password'] },
    include: [
      { model: UserProfile, as: 'UserProfile' },
      { model: UserEmail, as: 'UserEmail' },
      {
        model: UserRole,
        as: 'UserRoles',
        required: role ? true : false,
        include: [
          {
            model: Role,
            as: 'Role',
            ...roleInclude
          },
        ],
      },
    ],
    subQuery: false,
    distinct: true,
    order: [['CreatedAt', 'DESC']],
  });

  return res.status(200).json({
    success: true,
    message: 'Usuarios obtenidos exitosamente',
    data: users.map((user) => buildUserResponse(user)),
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await findUserById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Usuario obtenido exitosamente',
    data: buildUserResponse(user),
  });
});

export const getRolesCatalog = asyncHandler(async (req, res) => {
  const roles = await Role.findAll({
    order: [['Name', 'ASC']],
  });

  return res.status(200).json({
    success: true,
    message: 'Catalogo de roles obtenido exitosamente',
    data: roles.map((role) => buildRoleResponse(role)),
  });
});

export const changeUserRole = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const roleName = req.body.roleName || req.body.role;
    const requestingUserId = req.usuario?.sub || req.usuario?.userId || req.usuario?.id;

    if (!requestingUserId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    const result = await assignRoleHelper(requestingUserId, id, roleName);

    return res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    let statusCode = error.status || 400;

    if (error.message.includes('no encontrado') || error.message.includes('no existe')) {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al actualizar rol',
    });
  }
});

export const createUserAdmin = asyncHandler(async (req, res) => {
  const { name, surname, username, email, phone, password, role } = req.body;

  try {
    const result = await registerUserHelper({
      name,
      surname,
      username,
      email,
      phone,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    console.error('Error creando usuario admin:', error);
    let statusCode = 400;
    if (error.message.includes('ya existe') || error.message.includes('en uso')) {
      statusCode = 409;
    }
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al crear usuario',
    });
  }
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const nextStatus = parseBoolean(req.body.status);

  if (nextStatus === null) {
    return res.status(400).json({
      success: false,
      message: 'El campo status debe ser booleano',
    });
  }

  const user = await User.findByPk(id, {
    include: [
      { model: UserProfile, as: 'UserProfile' },
      { model: UserEmail, as: 'UserEmail' },
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
  }

  await user.update({ Status: nextStatus });

  return res.status(200).json({
    success: true,
    message: nextStatus ? 'Usuario reactivado exitosamente' : 'Usuario congelado exitosamente',
    data: buildUserResponse(user),
  });
});
