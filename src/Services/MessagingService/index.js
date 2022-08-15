const axios = require('axios').default

let Service = {}
Service.RegisterUniverse = function(universe) {
    let serviceCopy = Object.assign({}, this)
    serviceCopy.universe = universe
    return serviceCopy
}

Service.PublishAsync = function(topic, message) {
    return new Promise((resolve, reject) => {
        if (typeof topic !== 'string') {
            reject(new Error('Topic must be a string'))
        }
        if (topic.length > 80) {
            reject(new Error('Topic must be less than 80 characters'))
        }
        if (typeof message !== 'string') {
            reject(new Error('Message must be a string'))
        }
        // make sure message is under 1kb
        if (message.length > 1024) {
            reject(new Error('Message must be under 1kb in size'))
        }
        const UniverseId = this.universe || global.__OpenCloud.UniverseId
        const url = new URL(`https://apis.roblox.com/messaging-service/v1/universes/${UniverseId}/topics/${topic}`)

        axios.post(url.toString(), { message }, {
            headers: {'x-api-key': global.__OpenCloud.MessagingService},
            'Content-Type': 'application/json'
        }).then((res) => {
            resolve(res.data)
        }).catch((err) => {
            reject(err)
        })
    })
}
//* SubscribeAsync is only available for Roblox servers





module.exports = Service