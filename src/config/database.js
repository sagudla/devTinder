const mongoose = require('mongoose');
const dbURI = "mongodb+srv://gudlasanthoshkumar112_db_user:SlFDJblQKkHapmJO@namastenode.ezkfaon.mongodb.net/devTinder?retryWrites=true&w=majority";
//const dbURI = "mongodb://gudlasanthoshkumar112_db_user:SlFDJblQKkHapmJO@ac-4bt17ww-shard-00-00.ezkfaon.mongodb.net:27017,ac-4bt17ww-shard-00-01.ezkfaon.mongodb.net:27017,ac-4bt17ww-shard-00-02.ezkfaon.mongodb.net:27017/?ssl=true&replicaSet=atlas-10j25a-shard-0&authSource=admin";
const connectDB = async () => {
    await mongoose.connect(dbURI);
    // try {
    //     await mongoose.connect(dbURI);
    //     console.log("connected");
    // } catch(error) {
    //     console.log(error);
    // }
}
module.exports = connectDB;

