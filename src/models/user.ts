import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
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
    expirationDate: {
        type: Date
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  userSchema.methods.validPassword = async function (password) {
    console.log("validPassword");
    //(textPassword, hash)
    const isCorrectPass = await bcrypt.compare(password, this.password)
    console.log(isCorrectPass);

    if (!isCorrectPass) {
        throw {
            message: 'Username and password do not match!',
            status: 400
        };
    }
};
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
        },
            // ACCESS_TOKEN_SECRET//?? store in env and any string?
            "trinhzz"
        ,
        {expiresIn: '86400s'}
    );
};

userSchema.methods.toAuthJSON = function () {
  return {
      name: this.name,
      email: this.email,
      id: this._id,
      token: this.generateJWT(),
      expirationDate: this.expirationDate
  };
};

export default mongoose.model("User", userSchema);
