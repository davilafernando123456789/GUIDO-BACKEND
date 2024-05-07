const MeetingRoom = require('../models/MeetingRoom');

exports.createMeetingRoom = async (req, res, { meetingData, idProfesor }) => {
  try {
    // Extraer los datos relevantes de la sala de reuniones
    const {
      htmlLink,
      start,
      end,
      iCalUID,
      reminders,
      creator,
      organizer
    } = meetingData;

    // Crear la sala de reuniones asociada al profesor
    const newMeetingRoom = await MeetingRoom.create({
      idProfesor,
      htmlLink,
      startDateTime: start.dateTime,
      endDateTime: end.dateTime,
      iCalUID,
      remindersUseDefault: reminders.useDefault,
      creatorEmail: creator.email,
      organizerEmail: organizer.email,
    });

    res.status(201).json({ success: true, message: 'Sala de reuniones creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Hubo un error al crear la sala de reuniones' });
  }
};
