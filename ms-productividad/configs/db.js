import mongoose from 'mongoose';

/**
 * Establece la conexión con MongoDB utilizando Mongoose.
 * Registra escuchadores de eventos para monitorear el estado de la conexión.
 */
export const dbConnection = async () => {
  try {
    mongoose.connection.on('error', () => {
      console.log('MongoDB | No se pudo conectar a MongoDB');
      mongoose.disconnect();
    });

    mongoose.connection.on('connecting', () => {
      console.log('MongoDB | Intentando conectar a MongoDB');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB | Conectado a MongoDB');
    });

    mongoose.connection.on('open', () => {
      console.log('MongoDB | Conexión a la base de datos de Gestión de Productividad abierta exitosamente');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB | Reconectado a MongoDB');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB | Desconectado de MongoDB');
    });

    const uri = process.env.URI_MONGODB || 'mongodb://127.0.0.1:27017/db_gestion_tareas';

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Cierra la conexión de la base de datos de manera limpia en respuesta a señales de terminación.
 */
const gracefulShutdown = async (signal) => {
  console.log(`\nMongoDB | Recibida señal ${signal}. Cerrando la conexión a la base de datos...`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB | Conexión de base de datos cerrada de manera limpia.');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB | Error durante el apagado limpio de la conexión:', error.message);
    process.exit(1);
  }
};

// Capturar señales de terminación del proceso
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Para reinicios con nodemon
