const multer = require('multer');
const upload = multer();

// Configura multer para manejar la carga de archivos
app.use(upload.single('image'));