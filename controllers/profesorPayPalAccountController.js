const ProfesorPayPalAccount = require('../models/ProfesorPayPalAccounts');
const Profesor = require('../models/Profesor');
exports.getProfesorPayPalAccountByProfesorId = async (req, res) => {
    try {
      const { profesorId } = req.params;
      const profesorPayPalAccount = await ProfesorPayPalAccount.findOne({ where: { profesor_id: profesorId } });
      if (!profesorPayPalAccount) {
        return res.status(404).json({ message: 'Cuenta de PayPal del profesor no encontrada' });
      }
      res.status(200).json(profesorPayPalAccount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la cuenta de PayPal del profesor' });
    }
  };
exports.createProfesorPayPalAccount = async (req, res) => {
  try {
    const { profesor_id, paypal_email } = req.body;

    // Verificar si el profesor existe
    const profesor = await Profesor.findByPk(profesor_id);
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    // Crear la cuenta de PayPal del profesor
    const profesorPayPalAccount = await ProfesorPayPalAccount.create({
      profesor_id,
      paypal_email
    });

    res.status(201).json(profesorPayPalAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la cuenta de PayPal del profesor' });
  }
};

exports.getProfesorPayPalAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const profesorPayPalAccount = await ProfesorPayPalAccount.findByPk(id);
    if (!profesorPayPalAccount) {
      return res.status(404).json({ message: 'Cuenta de PayPal del profesor no encontrada' });
    }
    res.status(200).json(profesorPayPalAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la cuenta de PayPal del profesor' });
  }
};

exports.updateProfesorPayPalAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { paypal_email } = req.body;

    const profesorPayPalAccount = await ProfesorPayPalAccount.findByPk(id);
    if (!profesorPayPalAccount) {
      return res.status(404).json({ message: 'Cuenta de PayPal del profesor no encontrada' });
    }

    profesorPayPalAccount.paypal_email = paypal_email;
    await profesorPayPalAccount.save();

    res.status(200).json(profesorPayPalAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la cuenta de PayPal del profesor' });
  }
};

exports.deleteProfesorPayPalAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const profesorPayPalAccount = await ProfesorPayPalAccount.findByPk(id);
    if (!profesorPayPalAccount) {
      return res.status(404).json({ message: 'Cuenta de PayPal del profesor no encontrada' });
    }

    await profesorPayPalAccount.destroy();
    res.status(204).json({ message: 'Cuenta de PayPal del profesor eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la cuenta de PayPal del profesor' });
  }
};
