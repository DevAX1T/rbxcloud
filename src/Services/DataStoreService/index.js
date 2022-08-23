const crypto = require('crypto');
const _axios = require('axios').default;

class DataStoreKeyInfo {
    DataType = JSON;
    #userIds = [];
    #attributes = {};
    // set property 'ho' as read only
    constructor(data) {
        this.CreatedTime = Math.floor(Date.parse(data.CreatedTime) / 1000);
        this.UpdatedTime = Math.floor(Date.parse(data.UpdatedTime) / 1000);
        this.Version = data.Version
        this.DataType = data.DataType || JSON;
        this.#userIds = data.userIds || [];
        this.#attributes = data.attributes || {};
    }
    /**
     * Returns the metadata associated with the object.
     * @returns {Dictionary}
     */
    GetMetadata() {
        return this.#attributes;
    }
    /**
     * An array of `UserIds` tagged with a key.
     * @returns {Array<number>}
     */
    GetUserIds() {
        return this.#userIds;
    }
}
class DataStoreSetOptions {
    #attributes = {};
    constructor(attributes = {}) {
        this.#attributes = attributes;
    }
    /**
     * Gets the custom metadata set with this `DataStoreSetOptions` instance.
     * @returns {Dictionary}
     */
    GetMetadata() {
        return this.#attributes;
    }
    /**
     * Sets custom metadata to be associated with the key.
     * @param  {Dictionary} attributes Metadata values to set for the key.
     */
    SetMetadata(attributes) {
        this.#attributes = attributes || {};
    }
    
}

class DataStoreIncrementOptions {
    #attributes = {};
    constructor(attributes = {}) {
        this.#attributes = attributes;
    }
    /**
     * Gets the custom metadata set with this `DataStoreIncrementOptions` instance.
     * @returns {Dictionary} Metadata associated with this `DataStoreIncrementOptions` instance.
     */
    GetMetadata() {
        return this.#attributes;
    }
    /**
     * Sets custom metadata to be associated with the key.
     * @param  {Dictionary} attributes
     */
    SetMetadata(attributes) {
        this.#attributes = attributes || {};
    }
}

class EntryVersion {
    constructor(data) {
        this.version = data.version
        this.deleted = data.deleted
        this.contentLength = data.contentLength
        this.createdTime = data.createdTime
        this.objectCreatedTime = data.objectCreatedTime
    }
}

class DataStore {
    //create a hidden key in the data store
    #name = '';
    #axios = null;
    #baseURL = '';
    #universe = 0;
    constructor(name, universe, APIKey) {
        this.#name = name;
        this.#universe = universe;
        this.#baseURL = `https://apis.roblox.com/datastores/v1/universes/${this.#universe}/standard-datastores/datastore/entries`;
        this.#axios = _axios.create({
            headers: {'x-api-key': APIKey || global.__OpenCloud.DataStoreService}
        });
    }
    /**
     * Returns the value of a key in a specified data store and a `DataStoreKeyInfo` instance. 
     * If the key does not exist, or if the latest version has been marked as deleted, both return values wil be `null`.
     * @warning This does not support any values where `math.huge` (Infinity) was saved. Instead, the non-parsed value will be returned.
     * @param   {string} key - The key name for which the value is requested.
     * @returns {Promise<[any, DataStoreKeyInfo]>} - KeyInfo has 'IsJSON' and 'DataType' properties
     */
    async GetAsync(key) {
        return new Promise(async (resolve, reject) => {
            // resolve([22, this.#universe])
            const url = `${this.#baseURL}/entry?datastoreName=${this.#name}&entryKey=${key}`;
            this.#axios.get(url).then((res) => {
                const attributes = res.headers['roblox-entry-attributes'];
                const userids = res.headers['roblox-entry-userids'];
                let keyOpts = {
                    CreatedTime: res.headers['roblox-entry-created-time'],
                    UpdatedTime: res.headers['roblox-entry-version-created-time'],
                    Version: res.headers['roblox-entry-version'],
                    DataType: JSON,
                    userIds: userids ? JSON.parse(res.headers['roblox-entry-userids']) : [],
                    attributes: attributes ? JSON.parse(attributes) : {}
                }
                let result = res.data;
                try {
                    const preResult = JSON.parse(res.data);
                    result = preResult;
                } catch {
                    keyOpts.DataType = String;
                }
                const keyInfo = new DataStoreKeyInfo(keyOpts);
                resolve([result, keyInfo]);
                // resolve([returnString ? res.data : JSON.parse(res.data), keyInfo])
            }).catch((err) => {
                if (err.response && err.response.data) {
                    if (err.response.data.error && err.response.data.error === 'NOT_FOUND') {
                        resolve([null, null]); // Data doesn't exist
                    }
                }
                reject(err);
            })
        })
    }
    /**
     * Removes the specified key while also retaining an accessible version.
     * @warning If `ignorePreviousValue` is true, a GetAsync request will also be sent before removing the data associated with the key. (to return a DataStoreKeyInfo instead of void)
     * @param  {string} key Key name to be removed.
     * @param  {boolean} [ignorePreviousValue] If true, the function will not return anything.
     * @returns {Promise<[any, DataStoreKeyInfo | void]>}
     */
    async RemoveAsync(key, ignorePreviousValue) {
        return new Promise(async (resolve, reject) => {
            const url = `${this.#baseURL}/entry?datastoreName=${this.#name}&entryKey=${key}`;
            let data;
            let keyInfo;
            if (!ignorePreviousValue) {
                try {
                    [data, keyInfo] = await this.GetAsync(key);
                } catch (err) {
                    return reject(err);
                }
                if (data === null && keyInfo === null) return reject('Key does not exist');
            }
            this.#axios.delete(url).then((res) => {
                resolve([data, keyInfo]);
            }).catch((err) => {
                reject(err);
            })
        })
    }
    /**
     * Sets the value of the data store for the given key.
     * @param  {String} key Key name for which the value should be set.
     * @param  {any} value The value that the data store key will be set to.
     * @param  {Array<number>} [userIds] Array of `UserIds`, highly recommended to assist with GDPR tracking/removal.
     * @param  {DataStoreSetOptions} [DataStoreSetOptions] `DataStoreSetOptions` instance that allows for metadata specification on the key.
     * @returns {Promise<EntryVersion>}
     */
    async SetAsync(key, value, userIds, DataStoreSetOptions) {
        return new Promise(async (resolve, reject) => {
            const url = `${this.#baseURL}/entry?datastoreName=${this.#name}&entryKey=${key}`;
            const json = JSON.stringify(value);
            let headers = {
                'content-type': 'application/json',
                'content-length': json.length,
                'content-md5': crypto.createHash('md5').update(json).digest('base64')
            }
            if (userIds && userIds.length > 0) {
                if (userIds.length > 3) return reject('UserIds must be from 0-4');
                headers['roblox-entry-userids'] = JSON.stringify(userIds);
            }
            if (DataStoreSetOptions) headers['roblox-entry-attributes'] = JSON.stringify(DataStoreSetOptions.GetMetadata());
            this.#axios.post(url, json, { headers: headers }).then((res) => {
                const entryVersion = new EntryVersion(res.data);
                resolve(entryVersion);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    /**
     * Increments the value of a key by the provided amount (both must be integers).
     * @warning UNFINISHED
     * @param  {String} key Key name for which the value should be updated.
     * @param  {number} [delta] Amount to increment the current value by.
     * @param  {Array<number>} [userIds] A table of `UserIds` to associate with the key.
     * @param  {DataStoreIncrementOptions} [DataStoreIncrementOptions] The `DataStoreIncrementOptions` instance that combines multiple 
     * additional parameters as custom metadata and allows for future extensibility.
     * @returns {Promise<[number, DataStoreKeyInfo]>}
     */
    async IncrementAsync(key, delta = 1, userIds = [], DataStoreIncrementOptions) {
        return new Promise(async (resolve, reject) => {
            const url = `${this.#baseURL}/entry/increment?datastoreName=${this.#name}&entryKey=${key}&incrementBy=${delta}`;
            let headers = {}
            if (userIds && userIds.length > 0) {
                if (userIds.length > 3) return reject('UserIds must be from 0-4');
                headers['roblox-entry-userids'] = JSON.stringify(userIds);
            }
            if (DataStoreIncrementOptions) headers['roblox-entry-attributes'] = JSON.stringify(DataStoreIncrementOptions.GetMetadata());
            this.#axios.post(url, undefined, { headers: headers }).then((res) => {
                let keyOpts = {
                    CreatedTime: res.headers['roblox-entry-created-time'],
                    UpdatedTime: res.headers['roblox-entry-version-created-time'],
                    Version: res.headers['roblox-entry-version'],
                    DataType: JSON,
                    userIds: userIds ? JSON.parse(res.headers['roblox-entry-userids']) : [],
                    attributes: DataStoreIncrementOptions ? JSON.parse(res.headers['roblox-entry-attributes']) : {}
                }
                const keyInfo = new DataStoreKeyInfo(keyOpts);
                resolve([res.data, keyInfo]);
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    /**
     * Updates a key’s value with a new value from the specified callback function.
     * @warning If the data for the key is an array, you must wrap it inside of another array or you risk losing your data.
     * @warning This does not work if data does not already exist for the key.
     * @param  {String} key Key name for which the value should be updated.
     * @param  {function} transformFunction Transform function that takes the current value and `DataStoreKeyInfo` as parameters and 
     * returns the new value along with optional `UserIds` and metadata.
     * @returns {Promise<[any, DataStoreKeyInfo]>}
     * @example
     * // Save data
     * CoinsStore.UpdateAsync(125196014, function(data, keyInfo) {
     *    data.coins += 1
     *    return data
     *    // alternatively, return metatdata and UserIds
     *    return [ data, [], { randomProperty: true } ]
     * })
     * 
     * // Save data (where the data is an array)
     * CoinsStore.UpdateAsync(125196014, function(data, keyInfo) {
     *    data.push(1);
     *    const metadata = {
     *       IsPlayer: true,
     *       SomeOtherAttribute: 'SomeOtherAttributeValue'
     *    };
     * return [ [ data ] [], metadata]
     * })
     */
    async UpdateAsync(key, transformFunction) {
        return new Promise(async (resolve, reject) => {
            if (typeof transformFunction !== 'function') {
                reject(new Error('transformFunction must be a function'))
            }
            this.GetAsync(key).then(([value, keyInfo]) => {
                const result = transformFunction(value);
                // const [data, userIds = [], metadata = {}] = transformFunction(value, keyInfo); // If no data is provided, the value will be null
                let data;
                let userIds = [];
                let metadata = {};
                if (Array.isArray(result)) {
                    [data, userIds, metadata] = result;
                    if (!userIds) userIds = [];
                    if (!metadata) metadata = {};
                } else {
                    data = result;
                }
                if (data === null || data === undefined) return reject('Response cannot be null');
                this.SetAsync(key, data, userIds, new DataStoreSetOptions(metadata)).then((entryVersion) => {
                    const updatedKeyInfo = new DataStoreKeyInfo({
                        CreatedTime: new Date(keyInfo.CreatedTime * 1000).toISOString(),
                        UpdatedTime: entryVersion.createdTime,
                        Version: entryVersion.version,
                        DataType: keyInfo.DataType,
                        userIds: keyInfo.GetUserIds(),
                        attributes: keyInfo.GetMetadata()
                    });
                    resolve([data, updatedKeyInfo]);
                });
            }).catch(reject);
            // do this later
        });
    }
}











let Service = {};
Service.Objects = { DataStoreKeyInfo, DataStoreIncrementOptions, DataStore, DataStoreSetOptions, EntryVersion };

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