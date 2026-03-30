import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "username must be required"],
  },

  email: {
    type: String,
    unique: true,
    required: [true, "email must be required"],
  },

  password: {
    type: String,
    required: [true, "password must be required"],
  },
  verified:{
	type:Boolean,
	default:false
  }
});


const User=mongoose.model("User",userSchema);

export default User;