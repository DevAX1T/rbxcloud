const DataStore = require('./DataStore');
const objects = require('./objects');
const DataStoreOptions = objects.DataStoreOptions;

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
Service.GetDataStore = function(name, scope, options) {
    const DataStoreReturned = new DataStore(store, this.universe || global.__OpenCloud.UniverseId);
    if (this.universe) delete this.universe;
    return DataStoreReturned;
}

module.exports = Service;