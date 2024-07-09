const express = require('express');
const router = express.Router();
const { listFilesWithMetadata, downloadFileFromBlobStorage, deleteFileFromBlobStorage } = require('../azureStorage');
const passport = require('passport');

// Route for listing files
router.get('/files', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const files = await listFilesWithMetadata();
    res.json(files);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Route for downloading a file
router.get('/files/download/:filename', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { filename } = req.params;
  try {
    const fileStream = await downloadFileFromBlobStorage(filename);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Route for deleting a file
router.delete('/files/delete/:filename', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { filename } = req.params;
  try {
    await deleteFileFromBlobStorage(filename);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
