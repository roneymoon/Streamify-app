import { StreamChat } from "stream-chat"
import "dotenv/config"

const API_KEY = process.env.STREAM_API_KEY
const SECRET_KEY = process.env.STREAM_SECRET_KEY

if(!API_KEY || !SECRET_KEY){
    console.log("Stream API KEY or SECRET KEY is missing")
}

const streamClient = StreamChat.getInstance(API_KEY, SECRET_KEY)

// if there is no user it will create user else it will update the user
export const upsertStreamUser = async (UserData) => {
    try{
        await streamClient.upsertUsers([UserData])
        return UserData
    } catch(error){
        console.error("Error upserting Stream User", error)
    }
}

// TODO: make sure to complete it later
export const generateStreamToken = async (userId) => {
    try {
        const userID = userId.toString();
        return streamClient.createToken(userID)
    } catch (error) {
        console.log("Error in generateStreamToken", error);
        
    }
}