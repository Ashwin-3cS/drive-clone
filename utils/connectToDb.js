import mongoose from "mongoose";

let isConnected = false; 


export const connectTodb = async() => {

    mongoose.set('strictQuery',true);
    if(isConnected){
        console.log('Mongo DB is already connected');
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName : 'drive-clone'
        }
    )
    isConnected = true;
    console.log('Mongo DB connected')
    } catch (error) {
        console.log(error)
    }
}
