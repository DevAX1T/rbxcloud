<div align="center">
    <h1>RbxCloud</h1>
    <h3><b>Open Cloud API for Roblox experiences</b></h3>
</div>

## About

RbxCloud is an open cloud API for Roblox experiences.
- Object oriented
- Aims to be as close to the Roblox API as possible for the following services:
    - DataStoreService
    - MessagingService
- Promise-based
- Support for non-JSON responses and such
- Support for nearly all open-cloud features
    - Place publishing will come in a later update.

## Installation

```sh-session
npm install rbxcloud
```

## Example Usage

You can find working examples in `example/general-usage.js` or just read below:

Publish a message using MessagingService:
```js
const { OpenCloud, MessagingService } = require('rbxcloud');
OpenCloud.Configure({
    MessagingService: 'API-KEY', // This is an API key for MessagingService
    UniverseId: 0, // You can get the UniverseId from the Asset explorer
});

MessagingService.PublishAsync('MyTopic', 'Hello World!').then(() => {
    console.log('Publish was a success!');
}).catch(err => {
    console.log(err);
});
```
Read, set, and update DataStore entry:
```js
const { OpenCloud, DataStoreService } = require('rbxcloud');
const { DataStoreSetOptions } = DataStoreService.Objects;

OpenCloud.Configure({
    DataStoreService: 'API-KEY', // This is an API key for MessagingService
    UniverseId: 0, // You can get the UniverseId from the Asset explorer
});

const GoldStore = DataStoreService.GetDataStore('Gold');

GoldStore.GetAsync(125196014).then(([data, keyInfo]) => {
    console.log(keyInfo.DataType === JSON); // true / false
    console.log(keyInfo.CreatedTime); // UNIX Timestamp
    console.log(keyInfo.UpdatedTime); // UNIX Timestamp
    console.log(keyInfo.Version); // DataStore key version
    console.log(`The player has ${data.amount} gold!`)
});

// SetAsync the player's gold
GoldStore.SetAsync(125196014, {
    currency: 'Gold',
    amount: 100,
}).then((result) => {
    console.log('Data saved: ', result);
}).catch((err) => {
    console.log('Error', err);
});

// Delete the player's gold
GoldStore.RemoveAsync(125196014).then()

// Increment a player's gold (incompatible with the current data setup though)
GoldStore.IncrementAsync(125196014, 5).then(([newAmount, keyInfo]) => {
    console.log(`The player now has ${newAmount} gold!`);
}).catch((err) => {
    console.log(err);
});

// Now use UpdateAsync; has nearly the exact same functionality as the native implementation. Do not yield this.
// Additionally, if you use this with the data being an array, you will lose your data unless you wrap the array inside another array.
GoldStore.UpdateAsync(125196014, function(data, keyInfo) {
    if (data.amount < 100) {
        data += 100;
    }
    //return data; <-- This is valid
    
    // Alternatively, you can return numerous values as specified by the Roblox API for UpdateAsync:
    const metadata = {
        IsOwnedByAPlayer: true,
        IsThisPlayerVeryCool: true
    };
    return [ data, [], metadata ]
});

// UpdateAsync with an array:
GoldStore.UpdateAsync(125196014, function(data, keyInfo) {
    data.push('Hello World!');
    return [ [ data ], [], metadata ]
})
```

<!-- Publish a Roblox experience:
```js
const { OpenCloud, PublishingService } = require('rbxcloud');

OpenCloud.Configure({
    PublishingService: 'API-KEY', // Unofficial 'PublishingService'
    DataStoreService: 'API-KEY', // This is an API key for MessagingService
    UniverseId: 0, // You can get the UniverseId from the Asset explorer
});

PublishingService.publish('./place.rbxl').then(()) => {
    console.log('Successfully published place!');
}).catch((err) => {
    console.log('Couldn\'t publish place: ', err);
});

``` -->


## Links
- [Documentation](https://github.com/DevAX1T/rbxcloud/wiki)
- [npm](https://www.npmjs.com/package/rbxcloud)
- [GitHub](https://github.com/DevAX1T/rbxcloud)

## Contributing
Create an issue for any suggestions or bug reports that you find. Please ensure that you've read the [documentation](https://github.com/DevAX1T/rbxcloud/wiki), and if you're creating an issue, verify that it isn't a duplicate.
