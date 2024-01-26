// To connect Express.js with MongoDB


// Mongoose is the library for node.js and MongoDB
const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook";  // mongodb connection string : using Ipv4 causing connection failed  error
//  above connection string provides the link to the mongodb server which is running at the localhost portno 27017
const connectToMongo = ()=>{
    return mongoose.connect(mongoURI) 
        .then(() => {
            console.log("Connect to mongoDB successfully");
        })
        .catch((error)=>{
            console.log("Error connection failed",error);
        })
};

module.exports = connectToMongo;