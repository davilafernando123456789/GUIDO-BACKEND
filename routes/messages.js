const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");

router.post("/", (req, res) => {
  messagesController.crearMensaje(req, res);
});

router.get("/", (req, res) => {
  messagesController.getMessages(req, res);
});

router.get("/destinatario/:destinatario_id", (req, res) => {
  messagesController.getMensajesPorDestinatario(req, res);
});

router.get("/remitente/:remite_id", (req, res) => { // Corrección aquí
  messagesController.getMensajesPorRemitente(req, res); // Corrección aquí
});
router.put("/editar/:messageId", (req, res) => {
  messagesController.updateMensajeById(req, res);
});


router.delete("/:messageId", (req, res) => { // Corrección aquí
  messagesController.deleteMensajeById(req, res); // Corrección aquí
});

module.exports = router;
