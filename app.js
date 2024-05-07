// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const Mensaje = require("./models/Messages"); // Importa el modelo de Mensajes
// const sequelize = require("./config/db"); // Importa tu configuración Sequelize
// const cors = require("cors");
// const app = express();
// const server = http.createServer(app);
// const aws = require("aws-sdk");

// // AWS S3 Configuration
// const s3 = new aws.S3({
//  claves aqui
// });

// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:4200",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
// });
// app.use(
//   cors({
//     origin: "http://localhost:4200",
//   })
// );

// // Verificar la conexión a la base de datos
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Conexión exitosa a la base de datos.");
//   })
//   .catch((err) => {
//     console.error("Error al conectar a la base de datos:", err);
//   });

// io.on("connection", async (socket) => {
//   console.log("Usuario conectado");

//   // Escuchar la solicitud de mensajes anteriores
//   socket.on("cargar-mensajes-anteriores", async () => {
//     try {
//       // Obtener los mensajes anteriores de la base de datos
//       const mensajesAnteriores = await Mensaje.findAll();

//       // Emitir los mensajes anteriores al cliente que los solicitó
//       socket.emit("mensajes-anteriores", mensajesAnteriores);
//     } catch (error) {
//       console.error("Error al obtener mensajes anteriores:", error);
//     }
//   });
//   // Manejar mensajes
//   socket.on("mensaje", async (data) => {
//     try {
//       const { contenido, remite_id, destinatario_id, audio_url, archivo_url } = data;

//       if (audio_url) {
//         // Guardar el mensaje de voz en la base de datos
//         const mensaje = await guardarMensajeVoz(
//           remite_id,
//           destinatario_id,
//           audio_url
//         );
//         io.emit("mensaje", mensaje);
//       } else if (archivo_url) {
//         const mensaje = await guardarArchivo(remite_id, destinatario_id, archivo_url);
//         io.emit("archivo", mensaje.archivo_url);
  
     
//       } else {
//         // Guardar el mensaje de texto en la base de datos
//         const mensaje = await Mensaje.create({
//           contenido,
//           remite_id,
//           destinatario_id,
//         });
//         io.emit("mensaje", mensaje);
//       }
//     } catch (error) {
//       console.error("Error al guardar el mensaje:", error);
//     }
//   });
//   async function guardarMensajeVoz(remite_id, destinatario_id, audio_url) {
//     const params = {
//       Bucket: "geniustec",
//       Key: `audio_url-${Date.now()}.webm`,
//       Body: audio_url,
//     };

//     try {
//       const data = await s3.upload(params).promise();
//       const audioUrl = data.Location;

//       const mensaje = await Mensaje.create({
//         contenido: "Mensaje de voz",
//         remite_id,
//         destinatario_id,
//         audio_url: audioUrl,
//       });

//       return mensaje;
//     } catch (err) {
//       console.error("Error al subir el archivo de audio:", err);
//       throw err;
//     }
//   }

//   async function guardarArchivo(remite_id, destinatario_id, archivo) {
//     const { nombre, archivo: buffer } = archivo; // Extraer el nombre y el buffer del objeto archivo
//     const params = {
//       Bucket: "geniustec",
//       Key: `${Date.now()}-${nombre}`, // Usar el nombre del archivo en la clave
//       Body: buffer,
//     };
  
//     try {
//       const data = await s3.upload(params).promise();
//       const fileUrl = data.Location;
  
//       const mensaje = await Mensaje.create({
//         contenido: "Archivo adjunto",
//         remite_id,
//         destinatario_id,
//         archivo_url: fileUrl,
//       });
  
//       return mensaje;
//     } catch (err) {
//       console.error("Error al subir el archivo:", err);
//       throw err;
//     }
//   }
  
  

//   // Manejar desconexiones de sockets
//   socket.on("disconnect", () => {
//     console.log("Usuario desconectado");
//   });
// });

// // Iniciar el servidor
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`Servidor corriendo en el puerto ${PORT}`);
// });
