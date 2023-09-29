import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    phone: {
      type: String,
      default: '+919472040607',
    },
    about: {
      type: String,
      default: 'Hey there, I am using the chat application',
    },
    avatar: {
      type: String,
      default: 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png',
    },
    verificationToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },


    friends: [
      {
        type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    sentFriendRequests: [
      {
        type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    approvalRequests: [
      {
        type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
