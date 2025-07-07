import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    // this is one-to-one
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    // this is many-to-many
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    // this is one-to-many
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    isShareable: {
        type: Boolean,
        required: true,
        default: true
    },
    shares: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

export default mongoose.model("Post", postSchema)