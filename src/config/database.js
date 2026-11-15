const mongoose = require('mongoose');
const dbURI = process.env.DATABASE_SECRET;
const connectDB = async () => {
    await mongoose.connect(dbURI);
}
module.exports = connectDB;
