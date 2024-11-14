import mongoose from "mongoose";


const  MONGODB_URI = process.env.MONGODB_URI

const connect = async () =>{
    const connectionState = mongoose.connection.readyState;
    if(connectionState === 1){
        console.log("Already Connected");
        return;
    }

    if(connectionState == 2){
        console.log("Conneting...");
    }
    
    try{
        mongoose.connect(MONGODB_URI!,{
            dbName: 'nest114-mongodb-restapis',
            bufferCommands: true
        });
        console.log("Conneted");
    }
    catch(err: unknown){
        console.log("Error:", err);

        // Check if err is an Error to get the message; otherwise, use a generic message.
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        
        throw new Error(errorMessage);
    }
}
export default connect;