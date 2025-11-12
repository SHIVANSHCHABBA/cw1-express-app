const path = require('path');
const fs = require('fs');

async function lessonImage(req, res) {
  const fileParam = req.params && req.params.file;
  if (!fileParam) {
    return res.status(400).json({ error: 'No file specified' });
  }

  // Prevent path traversal by taking only the basename
  const safeName = path.basename(fileParam);
  const imagePath = path.resolve(__dirname, '..', '..', 'images', 'lessons', safeName);

  try {
    await fs.promises.access(imagePath, fs.constants.R_OK);
    // sendFile will handle headers; use absolute path
    res.sendFile(imagePath, (err) => {
      if (err) {
        // If sendFile fails for any reason, respond with 404
        res.status(404).json({ error: 'Image not found' });
      }
    });
  } catch (e) {
    res.status(404).json({ error: 'Image not found' });
  }
}

module.exports = lessonImage;
