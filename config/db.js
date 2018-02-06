const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds157987.mlab.com:57987/pusherpoller').then(() => console.log('MongoDB Connected')).catch(err => console.log(err)); // will give you a promise
// Make sure to change user and password mlab