import 'dotenv/config';
import { connectMongoDB, disconnectMongoDB } from '../configs/mongodb.js';
import { User } from '../src/auth/auth.model.js';
import { hashPassword } from '../utils/password-utils.js';
import { DEFAULT_USER } from './default-user.js';

const seedDefaultUser = async () => {
  await connectMongoDB();

  const existingUser = await User.findOne({ email: DEFAULT_USER.email });
  if (existingUser) {
    console.log(`El usuario de prueba ya existe: ${DEFAULT_USER.email}`);
    await disconnectMongoDB();
    return;
  }

  const hashedPassword = await hashPassword(DEFAULT_USER.password);

  await User.create({
    name: DEFAULT_USER.name,
    surname: DEFAULT_USER.surname,
    username: DEFAULT_USER.username,
    email: DEFAULT_USER.email,
    password: hashedPassword,
    phone: DEFAULT_USER.phone,
    status: true, // cuenta ya activa/verificada, lista para pruebas
  });

  console.log('Usuario de prueba creado correctamente:');
  console.log(`  Correo: ${DEFAULT_USER.email}`);
  console.log(`  Usuario: ${DEFAULT_USER.username}`);
  console.log(`  Contraseña: ${DEFAULT_USER.password}`);

  await disconnectMongoDB();
};

seedDefaultUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error al crear el usuario de prueba:', error.message);
    process.exit(1);
  });
