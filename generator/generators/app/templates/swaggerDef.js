const path = require('path');

module.exports = {
    openapi: '3.0.0',
    info: {
        title: '[%= name %] API',
        version: '1.0.0',
        description: 'Microservice [%= name %] API',
    },
    servers: [
        { url: 'http://localhost:[%= port %]' }
    ],
    apis: [path.join(__dirname, './src/**/**/*.ts')]
};
