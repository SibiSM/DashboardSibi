// config.js

module.exports = {
    mongoURI: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    jwtSecret: process.env.JWT_SECRET,
    azure: {
        accountName: process.env.AZURE_ACCOUNT_NAME,
        accountKey: process.env.AZURE_ACCOUNT_KEY,
        containerName: process.env.AZURE_CONTAINER_NAME
    }
};
