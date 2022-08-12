const DataStore = require('./DataStore')

let Service = {}

Service.RegisterUniverse = function(universe) {
    Service.universe = universe
    return Service
}


Service.GetDataStore = function(store) {
    return new DataStore(store, Service.universe || global.__OpenCloud.UniverseID)
}

/** 
 * ! does not work !
 * Returns a `DataStoreListingPages` object for enumerating through all of the experience's data stores.
 * It accepts an optional `prefix` parameter to only locate data stores whose names start with the provided prefix.
 * @param  {string} [prefix]
 * @param  {number} [pageSize]
 */
Service.ListDataStoresAsync = function(prefix, pageSize) {
    prefix + 'a'

}




module.exports = Service