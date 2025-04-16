import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../libs/cloudinary.js";
import { getReceiverSocketId, io } from "../libs/socket.js";




  export const getUsersForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
      
  
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.log("error in getUsersForSidebar controller", error.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

export const getMessages= async(req,res)=>{
    try {
        const {id:userToChat}=req.params;
        const userId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:userToChat,recieverId:userId},
                {senderId:userId,recieverId:userToChat}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessages controller", error.message);
        res.status(500).json({ message: "internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
      
      const { text, image } = req.body;
      const { id: recieverId } = req.params;
      const senderId = req.user._id;
      let imageUrl;
      if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        recieverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();
  
      const receiverSocketId = getReceiverSocketId(recieverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
