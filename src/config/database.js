const mongoose = require('mongoose');

const connectdb = async()=>{ await mongoose.connect(process.env.DB_CONNECTION_STR + process.env.DB_STR) }// connect mongoose with cluster in mongodb db which returns a promisw

module.exports = {connectdb}