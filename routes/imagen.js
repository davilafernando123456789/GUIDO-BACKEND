//routes/imagen.js
const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");

// AWS S3 Configuration
const s3 = new aws.S3({
//claves aqui
});

// Upload Image Route
router.post("/upload-image", (req, res) => {
  // Verifica si se cargó un archivo
  if (!req.file) {
    return res.status(400).json({ error: "No se cargó ningún archivo" });
  }

  const timestamp = Date.now();
  const uniqueId = Math.random().toString(36).substring(2, 8);
  const key = `image-${timestamp}-${uniqueId}`;
  const params = {
    Bucket: "geniustec",
    Key: key,
    Body: req.file.buffer, // Usar req.file.buffer en lugar de req.files.image.data
    //ACL: 'public-read'
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading image to AWS S3:", err);
      res.status(500).json({ error: "Failed to upload image to AWS S3" });
    } else {
      const imageUrl = data.Location;
      res.status(200).json({ imageUrl });
    }
  });
});

module.exports = router;
