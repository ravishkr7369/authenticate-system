import mongoose, { Types } from "mongoose";


const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is required"],
  },

  refreshTokenHash: {
    type: String,
    required: [true, "refresh token hash is required"],
  },

  ip: {
    type: String,
    required: [true, "ip is required"],
  },
  
  userAgent: {
    type: String,
    required: [true, "ip is required"],
  }, 

  revoked:{
	type:Boolean,
	default:false
  }
},{timestamps:true});


const Session=mongoose.model("Session",sessionSchema);
export default Session;