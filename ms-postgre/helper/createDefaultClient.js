import { sequelize } from '../configs/db.js';
import {
    User,
    UserProfile,
    UserEmail,
    UserPasswordReset,
    Role,
    UserRole,
} from '../src/User/User.model.js';
import { hashPassword } from '../utils/password-utils.js';

const CLIENT_ROLE = 'CLIENT';
const DEFAULT_CLIENT_USERNAME = 'client';
const DEFAULT_CLIENT_EMAIL = 'client@proyecto.local';
const DEFAULT_CLIENT_PASSWORD = 'Client@1234!';

export const createDefaultClient = async () => {
    const transaction = await sequelize.transaction();

    try {
        const clientRole = await Role.findOne({
            where: { Name: CLIENT_ROLE },
            transaction,
        });

        if (!clientRole) {
            throw new Error('No existe el rol CLIENT en la base de datos');
        }

        const clientExists = await UserRole.findOne({
            where: { RoleId: clientRole.Id },
            include: [
                {
                    model: User,
                    as: 'User',
                    where: { Email: DEFAULT_CLIENT_EMAIL },
                    required: true,
                },
            ],
            transaction,
        });

        if (clientExists) {
            await transaction.rollback();
            console.log('El CLIENT por defecto ya existe');
            return;
        }

        const hashedPassword = await hashPassword(DEFAULT_CLIENT_PASSWORD);

        const client = await User.create(
            {
                Name: 'Cliente',
                Surname: 'Prueba',
                Username: DEFAULT_CLIENT_USERNAME,
                Email: DEFAULT_CLIENT_EMAIL,
                Password: hashedPassword,
                Status: true,
            },
            { transaction }
        );

        await UserProfile.create(
            {
                UserId: client.Id,
                ProfilePicture: '',
                Phone: '22345680',
            },
            { transaction }
        );

        await UserEmail.create(
            {
                UserId: client.Id,
                EmailVerified: true,
                EmailVerificationToken: null,
                EmailVerificationTokenExpiry: null,
            },
            { transaction }
        );

        await UserPasswordReset.create(
            {
                UserId: client.Id,
                PasswordResetToken: null,
                PasswordResetTokenExpiry: null,
            },
            { transaction }
        );

        await UserRole.create(
            {
                UserId: client.Id,
                RoleId: clientRole.Id,
            },
            { transaction }
        );

        await transaction.commit();

        console.log('CLIENT por defecto creado automáticamente');
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        console.error('Error creando CLIENT por defecto:', error);
    }
};
