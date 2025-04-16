import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);



const User=mongoose.model("User",userSchema);//the user document is not created yet, it will be created when model first interacts with the database for the first tiem,ie, newUser.save(). NOTE: COLLECTION WILL BE CALLED users,ie lowercase and plural

export default User;
//A model in Mongoose is a wrapper around a schema and provides methods to interact with MongoDB (such as save(), find(), update(), etc.).
//Schema defines the structure of the documents that will be stored in the users collection