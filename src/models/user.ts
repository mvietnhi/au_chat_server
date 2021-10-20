import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
      },
    password: {
        type: String,
        required: true
      },
    socketId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

export default mongoose.model("User", userSchema);
