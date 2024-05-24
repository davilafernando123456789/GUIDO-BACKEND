const { Usuario } = require('../models/Usuario');
const Profesores = require('../models/Profesor');
const Alumnos = require('../models/Alumno');
const Administrador = require('../models/Administrador');

const jwt = require('jsonwebtoken');

// Importar tus modelos y otras dependencias

exports.autenticarUsuario = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Buscar en la tabla Alumnos
    const alumno = await Alumnos.findOne({
      where: { usuario, password },
      attributes: { exclude: ['password'] }, // Excluir el campo de contraseña
    });

    if (alumno) {
      const token = jwt.sign({ id: alumno.id, rol: 1 }, 'secreto', { expiresIn: '1h' }); // Crear token para alumnos
      return res.status(200).json({ mensaje: 'OK', rol: 1, usuario: alumno, token });
    }

    // Buscar en la tabla Profesores
    const profesor = await Profesores.findOne({
      where: { usuario, password },
      attributes: { exclude: ['password'] }, // Excluir el campo de contraseña
    });

    if (profesor) {
      const token = jwt.sign({ id: profesor.id, rol: 2 }, 'secreto', { expiresIn: '1h' }); // Crear token para profesores
      return res.status(200).json({ mensaje: 'OK', rol: 2, usuario: profesor, token });
    }

    const administrador = await Administrador.findOne({
      where: { usuario, password },
      attributes: { exclude: ['password'] }, // Excluir el campo de contraseña
    });

    if (administrador) {
      const token = jwt.sign({ id: administrador.id, rol: 3 }, 'secreto', { expiresIn: '1h' }); // Crear token para profesores
      return res.status(200).json({ mensaje: 'OK', rol: 3, usuario: administrador, token });
    }

    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al autenticar usuario' });
  }
};

