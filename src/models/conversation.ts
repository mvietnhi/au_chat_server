import mongoose from 'mongoose';
import messageSchema from './message';
const { Schema } = mongoose;

const conversationSchema = new Schema({
    messages: [messageSchema],
    channelId: String // userid-touserid
})

export default mongoose.model("Conversation", conversationSchema);