import mongoose from "mongoose";

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.6gmfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connectToDB = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Error connecting to database: " + error.message);
    });
};

export default connectToDB;
