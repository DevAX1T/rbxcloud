const DataStore = require('./DataStore');
const objects = require('./objects');

let Service = {};
Service.Objects = objects;

Service.RegisterUniverse = function(universe = undefined) {
    Service.universe = universe;
    return Service;
}

/**
 * Creates a `DataStore` instance with the provided name and scope.
 * @param  {string} name
 * @returns {DataStore}
 */
Service.GetDataStore = function(name) {
    const DataStoreReturned = new DataStore(name, this.universe || global.__OpenCloud.UniverseId);
    if (this.universe) delete this.universe;
    return DataStoreReturned;
}

module.exports = Service;