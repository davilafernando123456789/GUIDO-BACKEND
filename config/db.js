const { Sequelize } = require('sequelize');

// Configuración de conexión a la base de datos en AWS RDS
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log,
});

// Verificar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos de AWS RDS.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos de AWS RDS:', err);
  });

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false }) // Setea a true solo si necesitas recrear las tablas
  .then(() => {
    console.log('Tablas sincronizadas correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });

module.exports = sequelize;

// // config/db.js
// const { Sequelize } = require('sequelize');

// // Configuración de conexión a la base de datos en AWS RDS
// const sequelize = new Sequelize('mydb', 'admin', '#Fernando12', {
//   host: 'guidodatabase.cpsczlory4uj.us-east-1.rds.amazonaws.com',
//   port: 3306,
//   dialect: 'mysql',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // Agregar esta línea
//     }
//   },
//   logging: console.log,
// });


// // Verificar la conexión a la base de datos
// sequelize.authenticate()
//   .then(() => {
//     console.log('Conexión exitosa a la base de datos de AWS RDS.');
//   })
//   .catch(err => {
//     console.error('Error al conectar a la base de datos de AWS RDS:', err);
//   });

// // Sincronizar modelos con la base de datos
// sequelize.sync({ force: false }) // Setea a true solo si necesitas recrear las tablas
//   .then(() => {
//     console.log('Tablas sincronizadas correctamente');
//   })
//   .catch((error) => {
//     console.error('Error al sincronizar las tablas:', error);
//   });

// module.exports = sequelize;



//config/db.js
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('mydb', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

// // Verificar la conexión a la base de datos
// sequelize.authenticate()
//   .then(() => {
//     console.log('Conexión exitosa a la base de datos.');
//   })
//   .catch(err => {
//     console.error('Error al conectar a la base de datos:', err);
//   });
//   // Sincronizar modelos con la base de datos
// sequelize.sync({ force: false }) // setea a true si deseas recrear las tablas en cada reinicio
//     .then(() => {
//     console.log('Tablas sincronizadas correctamente');
//     })
//     .catch((error) => {
//     console.error('Error al sincronizar las tablas:', error);
//     });

// module.exports = sequelize;
