const express = require('express');
const router = express.Router();
const azureStorage = require('azure-storage');
const config = require('../config/config');

// Azure Blob Storage Setup
const blobService = azureStorage.createBlobService(config.azure.accountName, config.azure.accountKey);
const containerName = config.azure.containerName;

// Route to List Files
router.get('/files', async (req, res) => {
    try {
        blobService.listBlobsSegmented(containerName, null, (err, result) => {
            if (err) {
                console.error('Error listing blobs:', err);
                res.status(500).json({ error: 'Failed to fetch files from Azure Storage' });
            } else {
                const files = result.entries.map(entry => entry.name);
                res.status(200).json(files);
            }
        });
    } catch (error) {
        console.error('Error fetching files from Azure Storage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to Download a File
router.get('/files/download/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
        const blobName = filename;
        blobService.getBlobProperties(containerName, blobName, (err, properties) => {
            if (err) {
                console.error('Error fetching blob properties:', err);
                res.status(404).json({ error: 'File not found' });
            } else {
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                blobService.createReadStream(containerName, blobName).pipe(res);
            }
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

// Route to Delete a File
router.delete('/files/delete/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
        blobService.deleteBlobIfExists(containerName, filename, err => {
            if (err) {
                console.error('Error deleting blob:', err);
                res.status(500).json({ error: 'Failed to delete file from Azure Storage' });
            } else {
                res.json({ message: 'File deleted successfully' });
            }
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

module.exports = router;
