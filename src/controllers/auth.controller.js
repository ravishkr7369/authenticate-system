import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateOtp, getOtpHtml } from "../utils/utils.js";

import { sendEmail } from "../services/email.service.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  try {
    const existsUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existsUser) {
      return res.status(409).json({
        message: "user already exists with this email or username",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const otp = generateOtp();
    const html = getOtpHtml(otp);

    await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`, html);

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await Otp.create({
      otpHash: hashedOtp,
      user: user._id,
      email: email,
    });

    return res.status(201).json({
      message: "OTP sent on your registered email",
      email: email,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyUser = async (req, res) => {
  const { otp, email } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "otp and email are required",
    });
  }

  try {
    const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");

    const otpCheck = await Otp.findOne({ email, otpHash: otpHashed });

    if (!otpCheck) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const user = await User.findByIdAndUpdate(
      otpCheck.user,
      { verified: true },
      { new: true },
    );

    await Otp.deleteMany({
      user: otpCheck.user,
    });

    return res.status(200).json({
      message: "email verified successfully",
      user,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found with this email",
      });
    }

    if (!user.verified) {
      return res.status(404).json({
        message: "email not verified",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const verifyPassword = hashedPassword === user.password;
    if (!verifyPassword) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const HashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.create({
      user: user._id,
      refreshTokenHash: HashedRefreshToken,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    const accessToken = jwt.sign(
      {
        id: user._id,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "user Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};



export const getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
 const token=authHeader.split(" ")[1];
 if(!token){
  return res.status(401).json({
    message:"Unauthorized access"
  })
 }


 try {
   const decoded=jwt.verify(token,process.env.JWT_SECRET);

    const session = await Session.findById(decoded.sessionId);

    if (!session || session.revoked) {
      return res.status(401).json({
        message: "Session expired",
      });
    }


    const user=await User.findById(decoded.id);

    if(!user){ 
      return res.status(404).json({
        message:"user not found"
      })
    }

 return res.status(200).json({
  user:{
    id:user._id,  
    username:user.username,
    email:user.email
  }
 })

 } catch (error) {
  console.log(error?.message);
  return res.status(500).json({
    message:"internal server error"
  })
 }

};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(404).json({
      message: "unauthorized",
    });
  }

  try {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({
      refreshTokenHash: hashedRefreshToken,
      revoked: false,
    });

    if (!session) {
      return res.status(404).json({
        message: "invalid refresh token ",
      });
    }

    session.revoked = true; // marked as used refreshToken for blacklist
    await session.save();

    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};



export const logoutAll = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  try {


      const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken)
      .digest("hex");

      const session=await Session.findOne({
        refreshTokenHash:hashedRefreshToken,
        revoked:false
      })

      if(!session){
        return res.status(401).json({
          message:"invalid refresh token"
        })
      }
      

    await Session.updateMany({
      user:session.user,
      revoked:false
    },{
      revoked:true
    })


    res.clearCookie("refreshToken");
    return res.status(200).json({
      message:"user logout from all device successfully"
    })

  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const refreshAccessToken=async (req,res)=>{
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  try {



    const decoded=jwt.verify(refreshToken,process.env.JWT_SECRET);


    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");


      

    const session = await Session.findOne({
      refreshTokenHash: hashedRefreshToken,
      revoked:false
    });

    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      {
        id: session.user,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );


    

    return res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
    });
   



  } catch (error) {
    
  }

}



