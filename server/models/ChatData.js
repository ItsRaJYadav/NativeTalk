import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
  roomId: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",

    },
  ],
  messages: [
    {
      text: String,
      senderId: String,
      time: String,
    },
  ],

},
  {
    timestamps: true,
  });
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

