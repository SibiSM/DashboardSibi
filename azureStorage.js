const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_ACCOUNT_KEY;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(
  `DefaultEndpointsProtocol=https;AccountName=${AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`
);

async function listFilesWithMetadata() {
  const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
  const fileDetails = [];

  for await (const blob of containerClient.listBlobsFlat()) {
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
    const properties = await blockBlobClient.getProperties();
    const metadata = properties.metadata;

    fileDetails.push({
      fileName: blob.name,
      userId: metadata ? metadata.userId : 'Unknown',
      uploadDate: properties.lastModified,
    });
  }

  return fileDetails;
}

async function downloadFileFromBlobStorage(filename) {
  const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
  const blobClient = containerClient.getBlockBlobClient(filename);
  const downloadBlockBlobResponse = await blobClient.download();

  return downloadBlockBlobResponse.readableStreamBody;
}

async function deleteFileFromBlobStorage(filename) {
  const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
  const blobClient = containerClient.getBlockBlobClient(filename);
  await blobClient.delete();
}

module.exports = {
  listFilesWithMetadata,
  downloadFileFromBlobStorage,
  deleteFileFromBlobStorage,
};
