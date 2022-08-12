const _axios = require('axios').default;
const objects = require('../objects')

class DataStore {
    //create a hidden key in the data store
    #name = '';
    #axios = null;
    #baseURL = '';
    #universe = 0;
    constructor(name, universe, APIKey) {
        this.#name = name;
        this.#universe = universe;
        this.#baseURL = `https://apis.roblox.com/datastores/v1/universes/${this.#universe}/standard-datastores/datastore/entries`
        this.#axios = _axios.create({
            headers: {'x-api-key': APIKey || global.__OpenCloud.DataStoreService}
        })
    }
    /**
     * This function returns the latest value of the provided key and a `DataStoreKeyInfo` instance. If the key does not exist, or if
     * the latest version has been marked as deleted, both return values wil be `null`.
     * @warning This does not support any values where `math.huge` (Infinity) was saved.
     * @param   {string} key - The key name for which the value is requested.
     * @returns {Array<boolean | JSON, DataStoreKeyInfo>} - KeyInfo has 'IsJSON' and 'DataType' properties
     */
    async GetAsync(key) {
        return new Promise(async (resolve, reject) => {
            // resolve([22, this.#universe])
            const url = `${this.#baseURL}/entry?datastoreName=${this.#name}&entryKey=${key}`
            this.#axios.get(url).then((res) => {
                const keyInfo = new objects.DataStoreKeyInfo({
                    CreatedTime: res.headers['roblox-entry-created-time'],
                    UpdatedTime: res.headers['roblox-entry-version-created-time'],
                    Version: res.headers['roblox-entry-version']
                })
                let result = res.data
                try {
                    const preResult = JSON.parse(res.data)
                    result = preResult
                } catch {
                    keyInfo.setType(String)
                }
                resolve([result, keyInfo])
                // resolve([returnString ? res.data : JSON.parse(res.data), keyInfo])
            }).catch((err) => {
                if (err.response && err.response.data) {
                    if (err.response.data.error && err.response.data.error === 'NOT_FOUND') {
                        resolve([null, null])
                    }
                }
                reject(err)
            })
        })
    }
    
    /**
     * @param  {} key
     * @param  {} value
     * @param  {} [userIds] lol
     * @param  {} [DataStoreSetOptions]
     * @returns {Promise<string>}
     */
    async SetAsync(key, value, userIds, DataStoreSetOptions) {
        return new Promise(async (resolve, reject) => {

        })
    }
    
    /**
     * ***NOT PRODUCTION READY***
     * @param  {} key
     * @param  {} transformFunction
     * @returns {Promise<DataStoreKeyInfo>}
     */
    async UpdateAsync(key, transformFunction) {
        return new Promise(async (resolve, reject) => {
            if (typeof transformFunction !== 'function') {
                reject(new Error('transformFunction must be a function'))
            }

            // do this later
        })
    }
}

module.exports = DataStore