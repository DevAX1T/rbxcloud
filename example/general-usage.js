const { DataStoreService, MessagingService, OpenCloud } = require('rbxcloud');
require('dotenv').config();

// Set different keys for different services
OpenCloud.Configure({
    DataStoreService: process.env.Cloud_DataStoreService,
    MessagingService: process.env.Cloud_MessagingService,
    UniverseID: 3264572693 //UniverseId
});

// Or set the same key
OpenCloud.Configure({
    Global: process.env.GlobalOpenCloudAPIKey,
    UniverseID: 3264572693 // Universe ID
})

//game:GetService('MessagingService'):PublishAsync('CSCMessage', 'hi! i am a message')


// MessagingService.PublishAsync('CSCMessage', 'hi! i am a message').then((res) => {
//     console.log('Publish success!')
// }).catch((err) => {
//     console.log(err)
//     console.log('Publish failed!')
// })

// const crypto = require('crypto')
// const hash = crypto.createHash('md5').update('hello').digest('base64')
// console.log(hash)


const CoinsStore = DataStoreService.GetDataStore('coins');

// CoinsStore.GetAsync(125196014).then(([coins, keyInfo]) => {
//     console.log(keyInfo.DataType === JSON ? 'Data is JSON' : 'Data is not JSON');
//     console.log(`You have ${coins} coins!`);
//     console.log(keyInfo.GetUserIds())
// }).catch((e) => {
//     console.log('error', e);
// });

CoinsStore.IncrementAsync(125196014, 1).then(([newValue, keyInfo]) => {
    console.log(newValue, keyInfo)
}).catch((err) => {
    console.log(err)
});
// CoinsStore.SetAsync(125196014, 1).then((result) => {
// // }, [1], (new DataStoreService.Objects.DataStoreSetOptions({possum: true}))).then((result) => {
//     console.log('Data saved: ', result);
// }).catch((err) => {
//     console.log('Error', err);
// });

// CoinsStore.RemoveAsync(125196014).then(([result, keyInfo]) => {
//     console.log('Data removed: ', result);
//     console.log('Key info: ', keyInfo)

//     console.log(keyInfo.GetMetadata())
//     console.log(keyInfo.GetUserIds())
// }).catch((err) => {
//     console.log('Error', err);
// })
// CoinsStore.UpdateAsync(125196014, function(data, keyInfo) {
//     // console.log('Current data', data)
//     if (!data) {
//         data = { currency: 'Gold', amount: 100, version: 1 }
//     }
//     data.version += 1
//     if (data.amount < 101) {
//         data.amount += 100
//     }
//     return [data]
// }).then(([newData, entryVersion]) => {
//     console.log(newData)
// }).catch((err) => {
//     console.log(err)
// })