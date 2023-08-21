global.__OpenCloud = {};

const DataStoreService = require('./Services/DataStoreService');
const MessagingService = require('./Services/MessagingService');

const OpenCloud = {
    Configure: (config) => {
        for (let key in config) {
            global.__OpenCloud[key] = config[key];
        }
        if (config.Global) {
            config.DataStoreService = config.Global
            config.MessagingService = config.Global
        }
    }
}

module.exports = { DataStoreService, MessagingService, OpenCloud };
