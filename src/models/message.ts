import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
    userId: String,
    toUserId: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})
export default messageSchema

// export default mongoose.model("Message", messageSchema);
