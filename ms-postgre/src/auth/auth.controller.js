import { loginUserHelper } from '../../helper/auth-operations.js';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { Role, User, UserRole } from '../User/User.model.js';

export const login = asyncHandler(async (req, res) => {
  try {
    const { emailOrUsername, email, username, password } = req.body;
    const credential = emailOrUsername || email || username;

    if (!credential || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email o Username y contraseña son requeridos',
        error: 'Credenciales incompletas',
      });
    }

    const result = await loginUserHelper(credential, password);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in login controller:', error);

    let statusCode = 401;
    if (
      error.message.includes('bloqueada') ||
      error.message.includes('desactivada')
    ) {
      statusCode = 423;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error en el login',
      error: error.message,
    });
  }
});

/**
 * Controlador para asignar un restaurante a un usuario (PLATFORM_ADMIN)
 * Solo PLATFORM_ADMIN puede asignar restaurantes
 */
export const assignRestaurantToUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { restaurantId } = req.body;
  const requestingUserId = req.usuario?.sub || req.usuario?.userId;

  // 1. Validar que quien solicita sea PLATFORM_ADMIN
  const requestingUser = await User.findByPk(requestingUserId, {
    include: [
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
  });

  if (!requestingUser || requestingUser.UserRoles?.[0]?.Role?.Name !== 'PLATFORM_ADMIN') {
    return res.status(401).json({
      success: false,
      message: 'Solo administradores de plataforma pueden asignar restaurantes'
    });
  }

  // 2. Validar restaurantId formato
  if (!restaurantId || typeof restaurantId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'restaurantId es requerido y debe ser texto'
    });
  }

  // 3. Obtener usuario target
  const targetUser = await User.findByPk(userId, {
    include: [
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }]
      }
    ]
  });
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // 4. Guardar restaurantId anterior
  const previousRestaurantId = targetUser.RestaurantId;

  // 5. Actualizar usuario
  targetUser.RestaurantId = restaurantId;
  await targetUser.save();

  // 6. Retornar datos
  res.status(200).json({
    success: true,
    message: 'Restaurante asignado exitosamente',
    data: {
      userId: targetUser.Id,
      name: targetUser.Name,
      surname: targetUser.Surname,
      email: targetUser.Email,
      restaurantId: targetUser.RestaurantId,
      previousRestaurantId,
      updatedAt: targetUser.UpdatedAt
    }
  });
});
