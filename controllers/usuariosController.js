const { Usuario } = require('../models/Usuario');
const Profesores = require('../models/Profesor');
const Alumnos = require('../models/Alumno');
const Administrador = require('../models/Administrador');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Importar tus modelos y otras dependencias

exports.autenticarUsuario = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Buscar en la tabla Alumnos
    const alumno = await Alumnos.findOne({ where: { usuario } });

    if (alumno) {
      console.log('Contraseña ingresada:', password);
      console.log('Hash en la base de datos:', alumno.password.length, alumno.password);

      const isPasswordValid = await bcrypt.compare(password, alumno.password);
      console.log('Es válida la contraseña:', isPasswordValid);

      if (isPasswordValid) {
        const token = jwt.sign({ id: alumno.id, rol: 1 }, 'secreto', { expiresIn: '1h' });
        return res.status(200).json({ mensaje: 'OK', rol: 1, usuario: alumno, token });
      } else {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }
    }

    // Buscar en la tabla Profesores
    const profesor = await Profesores.findOne({ where: { usuario } });

    if (profesor) {
      console.log('Contraseña ingresada:', password);
      console.log('Hash en la base de datos:', profesor.password.length, profesor.password);

      const isPasswordValid = await bcrypt.compare(password, profesor.password);
      console.log('Es válida la contraseña:', isPasswordValid);

      if (isPasswordValid) {
        const token = jwt.sign({ id: profesor.id, rol: 2 }, 'secreto', { expiresIn: '1h' });
        return res.status(200).json({ mensaje: 'OK', rol: 2, usuario: profesor, token });
      } else {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }
    }

    // Buscar en la tabla Administrador
    const administrador = await Administrador.findOne({ where: { usuario } });

    if (administrador) {
      console.log('Contraseña ingresada:', password);
      console.log('Hash en la base de datos:', administrador.password.length, administrador.password);

      const isPasswordValid = await bcrypt.compare(password, administrador.password);
      console.log('Es válida la contraseña:', isPasswordValid);

      if (isPasswordValid) {
        const token = jwt.sign({ id: administrador.id, rol: 3 }, 'secreto', { expiresIn: '1h' });
        return res.status(200).json({ mensaje: 'OK', rol: 3, usuario: administrador, token });
      } else {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }
    }

    // Si no se encuentra el usuario en ninguna tabla
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al autenticar usuario', error: error.message });
  }
};
// exports.autenticarUsuario = async (req, res) => {
//   const { usuario, password } = req.body;

//   try {
//     // Buscar en la tabla Alumnos
//     const alumno = await Alumnos.findOne({
//       where: { usuario, password },
//       attributes: { exclude: ['password'] }, // Excluir el campo de contraseña
//     });

//     if (alumno) {
//       const token = jwt.sign({ id: alumno.id, rol: 1 }, 'secreto', { expiresIn: '1h' }); // Crear token para alumnos
//       return res.status(200).json({ mensaje: 'OK', rol: 1, usuario: alumno, token });
//     }

//     // Buscar en la tabla Profesores
//     const profesor = await Profesores.findOne({
//       where: { usuario, password },
//       attributes: { exclude: ['password'] }, // Excluir el campo de contraseña
//     });

//     if (profesor) {
//       const token = jwt.sign({ id: profesor.id, rol: 2 }, 'secreto', { expiresIn: '1h' }); // Crear token para profesores
//       return res.status(200).json({ mensaje: 'OK', rol: 2, usuario: profesor, token });
//     }

//     const administrador = await Administrador.findOne({
//       where: { usuario, password },
//       attributes: { exclude: ['password'] }, // Excluir el campo de contraseña
//     });

//     if (administrador) {
//       const token = jwt.sign({ id: administrador.id, rol: 3 }, 'secreto', { expiresIn: '1h' }); // Crear token para profesores
//       return res.status(200).json({ mensaje: 'OK', rol: 3, usuario: administrador, token });
//     }

//     return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensaje: 'Error al autenticar usuario' });
//   }
// };

