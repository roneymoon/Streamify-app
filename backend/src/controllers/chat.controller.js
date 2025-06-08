import { generateStreamToken } from "../lib/Stream.js";

export async function getStreamToken(req, res){
    try {
        const token = await generateStreamToken(req.user.id)
        console.log("getStreamToken - ", token)
        res.status(200).json({token})
    } catch (error) {
        console.log("Error in getStreamToken", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}