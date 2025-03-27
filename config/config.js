require('dotenv').config();

module.exports = {
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    airtable: {
        apiKey: process.env.AIRTABLE_API_KEY,
        baseId: process.env.AIRTABLE_BASE_ID,
        tableName: process.env.AIRTABLE_TABLE_NAME
    },
    solar: {
        apiKey: process.env.SOLAR_API_KEY,
        apiUrl: process.env.SOLAR_API_URL
    },
    googleCloud: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
}; 