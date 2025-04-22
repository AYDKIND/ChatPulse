import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../libs/utils.js";
import cloudinary from "../libs/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!password || !email || !fullName) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password length should be at lest 6" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ message: "user already existes,login instead" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
    } else {
      return res.status(400).json({ message: "invalid user details" });
    }

    res.status(200).json(newUser);
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "invalid credentials" });
    }

    const hashedPassword = user.password;

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "invalid credentials" });
    }

    generateToken(user._id, res);

    return res.status(200).json(user);
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateProfile=async (req,res)=>{
    const {profilePic}=req.body;
    const userId = req.user._id;
    try {
        if(!profilePic){
            return res.status(400).json({message:"give profile pic url"});
        } 

        const uploadResponse=await cloudinary.uploader.upload(profilePic);

        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

        res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in updateProfile controller", error.message);
      res.status(500).json({ message: "internal server error" });
    }
};



export const checkAuth=async (req,res)=>{
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};