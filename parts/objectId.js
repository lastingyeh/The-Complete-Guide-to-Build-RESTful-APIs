// 12 bytes

// 4 bytes: timestamp
// 3 bytes: machine identifier
// 2 bytes: process identifier
// 3 bytes: counter

// 1 byte = 8 bits
// 2 ^ 8
// 2 ^ 24 = 16M

const mongoose = require('mongoose');

const objectId = mongoose.Types.ObjectId();

console.log('get timestamp', objectId.getTimestamp());

const isValid = mongoose.Types.ObjectId.isValid('1234');
console.log('isValid', isValid);
