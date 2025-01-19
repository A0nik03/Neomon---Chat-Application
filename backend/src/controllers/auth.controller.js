import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { GenerateToken } from "../lib/utils.js";
import cloudinary from '../lib/cloudinary.js'

export const SignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Validate input fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    //Generate jwt token here
    GenerateToken(newUser._id, res);
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      User: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });

  } catch (error) {
    console.error("Error In Sign Up Controller");
    return res.status(500).json({ message: "Server error" });
  }
};

export const LogIn = async(req, res) => {
  const {email,password} = req.body;
  try {
    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    
    //Generate jwt token here
    GenerateToken(user._id, res);

    return res.json({
      message: "Logged In Successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      }
    });
  } catch (error) {
    console.error("Error In Log In Controller");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const LogOut = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.error("Error In Log Out Controller");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const UpdateProfile = async(req,res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    
    if(!profilePic){
      return res.status(400).json({ message: "Profile Pic is required" });
    }
    
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

    return res.status(200).json({ message: "Profile Updated Successfully", user: updatedUser });

  } catch (error) {
    console.error("Error In Update Profile Controller");
    return res.status(500).json({ message: "Internal Server error" });
  }
}

export const CheckAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error In Check Auth Controller",error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
}