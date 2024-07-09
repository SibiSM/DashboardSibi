const express = require('express');
const router = express.Router();
const multer = require('multer');
const azureStorage = require('azure-storage');
const config = require('../config/config');

// Azure Blob Storage Setup
const blobService = azureStorage.createBlobService(config.azure.accountName, config.azure.accountKey);
const containerName = config.azure.containerName;

// Multer Setup for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for File Upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const blobName = Date.now() + '-' + req.file.originalname;
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        await new Promise((resolve, reject) => {
            blobService.createBlockBlobFromStream(containerName, blobName, bufferStream, req.file.size, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        res.json({ message: 'File uploaded successfully', filename: blobName });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

module.exports = router;
