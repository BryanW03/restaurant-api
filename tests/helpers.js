require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

// Any valid ObjectId that does not exist in the database
const FAKE_ID = '65f1c2a4e1b2c3d4e5f60718';

const connect = () => mongoose.connect(process.env.MONGODB_URI);
const disconnect = () => mongoose.connection.close();

module.exports = { FAKE_ID, connect, disconnect };
