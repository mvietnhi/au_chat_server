import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const roomSchema = new Schema({
    name: String,
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Room", roomSchema);
