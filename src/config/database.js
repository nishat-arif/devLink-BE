const mongoose = require('mongoose'); // import mongoose
const {DB_CLUSTER_CONNECTION_STR , DB_STR} = require('../utils/constants')

const connectdb = async()=>{ await mongoose.connect(DB_CLUSTER_CONNECTION_STR + DB_STR) }// connect mongoose with cluster in mongodb db which returns a promisw

module.exports = {connectdb}