// const axios = require('axios');
// const config = require('../config/zoomConfig'); // Archivo de configuración de Zoom

// async function createMeetingRoom(meetingName) {
//   try {
//     const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
//       topic: meetingName,
//       type: 2, // Tipo de reunión: 2 para programada
//       settings: {
//         host_video: true,
//         participant_video: true
//       }
//     }, {
//       headers: {
//         'Authorization': `Bearer ${config.zoomAccessToken}` // Token de acceso de Zoom
//       }
//     });

//     const meetingLink = response.data.join_url;
//     console.log('Sala de reuniones de Zoom creada con éxito:', meetingLink);

//     return meetingLink;
//   } catch (error) {
//     console.error('Error al crear la sala de reuniones de Zoom:', error.message);
//     throw error;
//   }
// }

// module.exports = createMeetingRoom;

// const path = require('path');
// const { google } = require('googleapis');

// const credencialesPath = path.resolve(__dirname, '../geniustec1.json');

// async function createMeetingRoom(roomName) {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       keyFile: credencialesPath,
//       scopes: ['https://www.googleapis.com/auth/calendar'],
//     });

//     const client = await auth.getClient();

//     const calendar = google.calendar({
//       version: 'v3',
//       auth: client,
//     });

//     const calendarEvent = await calendar.events.insert({
//       calendarId: 'primary', // Opcional: aquí puedes especificar el ID del calendario donde deseas crear la sala
//       resource: {
//         summary: roomName,
//         description: 'Reunión de Google Meet',
//         start: {
//           dateTime: new Date().toISOString(),
//         },
//         end: {
//           dateTime: new Date(new Date().getTime() + 3600000).toISOString(), // Duración de la reunión: 1 hora
//         },
//       },
//     });

//     return calendarEvent.data;
//   } catch (error) {
//     console.error('Error al crear la sala:', error.message);
//     throw error;
//   }
// }

// module.exports = createMeetingRoom;