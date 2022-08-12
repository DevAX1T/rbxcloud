class DataStoreKeyInfo {
    IsJSON = true;
    DataType = JSON;
    constructor(data) {
        this.CreatedTime = Math.floor(Date.parse(data.CreatedTime) / 1000)
        this.UpdatedTime = Math.floor(Date.parse(data.UpdatedTime) / 1000)
        this.Version = data.Version
    }
    /**
     * Internal function to set the data type
     * @param  {JSON | String | any} type - Either 'JSON' or 'String' (objects)
     * @example keyInfo.setType(JSON); keyInfo.setType(String)
     */
    setType(type) {
        if (type === 'JSON') {
            this.IsJSON = true
            this.DataType = 'JSON'
        } else {
            this.IsJSON = false
            this.DataType = type
        }
    }
}
class DataStoreSetOptions {
    constructor(data = {}) {
        this.data = data
    }
    GetMetadata() {

    }
    SetMetadata() {
        
    }
}


module.exports = { DataStoreKeyInfo, DataStoreSetOptions }