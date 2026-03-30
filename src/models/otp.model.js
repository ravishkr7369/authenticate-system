import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
    },
  },
  { timestamps: true },
);

const Otp = mongoose.model("OTP", otpSchema);

export default Otp;
