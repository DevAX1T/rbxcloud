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
module.exports = { DataStoreIncrementOptions, DataStoreKeyInfo, DataStoreSetOptions, EntryVersion }