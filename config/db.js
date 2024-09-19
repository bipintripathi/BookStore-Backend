const mongoose = require('mongoose');	
const db = "mongodb://localhost:27017/books";


mongoose.set("strictQuery", true);

const connectDB = async ()=>{
    try{
        await mongoose.connect(db);
        console.log("MongoDB is connected...");
    }
    catch(err){
        console.log("Error: ", err);
        process.exit(1);
    }
}

module.exports = connectDB; 