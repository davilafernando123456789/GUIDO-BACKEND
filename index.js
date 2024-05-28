const express = require("express");
const conectarDB = require("./config/db");
const config = require("./config/global");
const cors = require("cors");
const horarioRoutes = require("./routes/horario");
const direccionRoutes = require("./routes/direccion");
const reunionesRoutes = require("./routes/reuniones");
const antecedentesEducativosRoutes = require("./routes/antecedentesEducativos");
const inscripcionesRoutes = require("./routes/inscripciones");
const administradorRoutes = require("./routes/administrador");
const usuariosRoutes = require("./routes/usuario");
const imagenRoutes = require("./routes/imagen");
const messagesRoutes = require("./routes/messages");
const suscripcionRoutes = require("./routes/suscripcion");
const multer = require("multer");
const upload = multer();
const app = express();
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const Mensaje = require("./models/Messages");
const sequelize = require("./config/db");
const aws = require("aws-sdk");
const twilio = require('twilio');
const bodyParser = require('body-parser');

// AWS S3 Configuration
const s3 = new aws.S3({


});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// Verificar la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos.");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

io.on("connection", async (socket) => {
  console.log("Usuario conectado");

  socket.on("cargar-mensajes-anteriores", async (destinatario_id) => {
    try {
      // Obtener los mensajes anteriores del destinatario específico de la base de datos
      const mensajesAnteriores = await Mensaje.findAll({
        where: { destinatario_id },
      });
      //console.log("Mensajes anteriores encontrados:", mensajesAnteriores);
      // Emitir los mensajes anteriores al cliente que los solicitó
      socket.emit("cargar-mensajes-anteriores", mensajesAnteriores);
    } catch (error) {
      console.error("Error al obtener mensajes anteriores:", error);
    }
  });

  socket.on("cargar-mensajes-anteriores-alumnos", async (remite_id) => {
    try {
      // Obtener los mensajes anteriores del destinatario específico de la base de datos
      const mensajesAnteriores = await Mensaje.findAll({
        where: { remite_id },
      });
      //console.log("Mensajes anteriores encontrados alumnos :", mensajesAnteriores);
      // Emitir los mensajes anteriores al cliente que los solicitó
      socket.emit("cargar-mensajes-anteriores-alumnos", mensajesAnteriores);
    } catch (error) {
      console.error("Error al obtener mensajes anteriores alumnos:", error);
    }
  });

  // Manejar mensajes
  socket.on("mensaje", async (data) => {
    try {
      const {
        contenido,
        remite_id,
        destinatario_id,
        audio_url,
        archivo_url,
        sent,
      } = data;

      if (audio_url) {
        // Guardar el mensaje de voz en la base de datos
        const mensaje = await guardarMensajeVoz(
          remite_id,
          destinatario_id,
          audio_url,
          sent
        );
        io.emit("mensaje", mensaje);
        console.log("Mensaje de voz emitido:", mensaje);
      } else if (archivo_url) {
        const mensaje = await guardarArchivo(
          remite_id,
          destinatario_id,
          archivo_url,
          sent
        );
        io.emit("mensaje", mensaje);
        console.log("Mensaje de voz emitido:", mensaje);
      } else {
        // Guardar el mensaje de texto en la base de datos
        const mensaje = await Mensaje.create({
          contenido,
          remite_id,
          destinatario_id,
          sent,
        });
        io.emit("mensaje", mensaje);
        console.log("Mensaje de voz emitido:", mensaje);
      }
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
    }
  });
  async function guardarMensajeVoz(
    remite_id,
    destinatario_id,
    audio_url,
    sent
  ) {
    const params = {
      Bucket: "geniustec",
      Key: `audio_url-${Date.now()}.webm`,
      Body: audio_url,
    };

    try {
      const data = await s3.upload(params).promise();
      const audioUrl = data.Location;

      const mensaje = await Mensaje.create({
        contenido: "Mensaje de voz",
        remite_id,
        destinatario_id,
        sent,
        audio_url: audioUrl,
      });

      return mensaje;
    } catch (err) {
      console.error("Error al subir el archivo de audio:", err);
      throw err;
    }
  }

  async function guardarArchivo(remite_id, destinatario_id, archivo, sent) {
    const { nombre, archivo: buffer } = archivo; // Extraer el nombre y el buffer del objeto archivo
    const params = {
      Bucket: "geniustec",
      Key: `${Date.now()}-${nombre}`, // Usar el nombre del archivo en la clave
      Body: buffer,
    };

    try {
      const data = await s3.upload(params).promise();
      const fileUrl = data.Location;

      const mensaje = await Mensaje.create({
        contenido: "Archivo adjunto",
        remite_id,
        destinatario_id,
        sent,
        archivo_url: fileUrl,
      });

      return mensaje;
    } catch (err) {
      console.error("Error al subir el archivo:", err);
      throw err;
    }
  }
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.use("/api/profesores", require("./routes/profesor"));
app.use("/api/alumnos", require("./routes/alumno"));
app.use("/api/apoderados", require("./routes/apoderado"));
app.use("/api/horarios", horarioRoutes);
app.use("/api/direccion", direccionRoutes);
app.use("/api/antecedentes_penales", antecedentesEducativosRoutes);
app.use("/api/reuniones", reunionesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/inscripciones", inscripcionesRoutes);
app.use("/api/mensajes", messagesRoutes);
app.use("/api/administrador", administradorRoutes);
app.use("/api/suscripcion", suscripcionRoutes);
app.use(upload.single("image"));
app.use("/api/imagen", imagenRoutes);
// Iniciar el servidor
const PORT = process.env.PORT || config.port;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
