const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Verificar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });
  // Sincronizar modelos con la base de datos
sequelize.sync({ force: false }) // setea a true si deseas recrear las tablas en cada reinicio
    .then(() => {
    console.log('Tablas sincronizadas correctamente');
    })
    .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
    });

module.exports = sequelize;
