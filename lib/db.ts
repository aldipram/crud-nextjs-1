import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

export const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if(connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        mongoose.connect(MONGODB_URL!, {
            dbName: "restapinext14",
            bufferCommands: false
        })
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        throw new Error("Error")
    }
}