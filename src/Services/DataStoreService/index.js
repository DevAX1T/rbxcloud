const DataStore = require('./DataStore');
const objects = require('./objects')

let Service = {};
Service.Objects = objects;

Service.RegisterUniverse = function(universe = undefined) {
    Service.universe = universe;
    return Service;
}


Service.GetDataStore = function(store) {
    const DataStoreReturned = new DataStore(store, this.universe || global.__OpenCloud.UniverseId);
    if (this.universe) delete this.universe;
    return DataStoreReturned;
}

/** 
 * ! does not work !
 * Returns a `DataStoreListingPages` object for enumerating through all of the experience's data stores.
 * It accepts an optional `prefix` parameter to only locate data stores whose names start with the provided prefix.
 * @param  {string} [prefix]
 * @param  {number} [pageSize]
 */
// Service.ListDataStoresAsync = function(prefix, pageSize) {
//     prefix + 'a'

// }




module.exports = Service;