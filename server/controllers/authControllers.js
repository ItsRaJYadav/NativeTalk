import User from '../models/UserModel.js';
import { hashPassword, comparePasswords } from '../helpers/Bcrypt.js';
import jwt from 'jsonwebtoken';
import Chat from '../models/ChatData.js';
import { v4 as uuidv4 } from 'uuid';

// Register a new user
export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//login with password and email
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user.password = undefined;
    res.status(200).json({
      message: 'User logged in successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the currently authenticated user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all users
    const users = await User.find();

    if (users) {
      const filteredUsers = users
        .filter(user => (
          user._id.toString() !== userId &&
          !currentUser.friends.includes(user._id.toString()) &&
          !currentUser.sentFriendRequests.includes(user._id.toString())
        ))
        .map(user => ({
          id: user._id,
          name: user.name,
          avatar: user.avatar,
        }));

      res.json(filteredUsers);
    } else {
      res.status(404).json({ message: 'Users not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






//update user profile
export const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    //user find
    const user = await User.findOne({ email });
    //password validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updated user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated Please Login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update Api",
      error,
    });
  }
};



export const createRoom = async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    res.status(404).json({ message: 'please sent both Id' });
    return;
  }

  try {

    console.log(senderId, receiverId);


    const receiver = await User.findById(receiverId);
    if (receiver && receiver.approvalRequests.includes(senderId)) {
      res.status(400).json({ message: 'Request already sent' });
      return;
    }
    try {
      await User.findByIdAndUpdate(receiverId, {
        $push: { approvalRequests: senderId },
      });

      await User.findByIdAndUpdate(senderId, {
        $push: { sentFriendRequests: receiverId },
      });


      res.status(201).json({ message: 'Friend Request sent successfully' });
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    res.status(400).json({ message: 'Bad request' });
  }
};







export const getallFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("approvalRequests", "name email avatar")
      .lean();

    const freindRequests = user.approvalRequests;

    res.json(freindRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const findRoomsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const rooms = await Chat.find({
      'users.isApproved': true,
      $or: [
        { 'users.senderId': userId },
        { 'users.receiverId': userId },
      ],
    });

    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    console.log('acceptFriendRequest', senderId, receiverId);

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    // Check if the friend request has already been accepted
    if (
      sender.friends.includes(receiverId) ||
      receiver.friends.includes(senderId)
    ) {
      return res.status(400).json({ message: "Friend request already accepted" });
    }

    sender.friends.push(receiverId);
    receiver.friends.push(senderId);

    sender.approvalRequests.remove(receiverId);
    receiver.sentFriendRequests.remove(senderId);

    await sender.save();
    await receiver.save();

    const roomId = uuidv4();
    const room = new Chat({
      roomId: roomId,
      users: [senderId, receiverId],
    });
    await room.save();

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getallFriendsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email avatar"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}






export const findRoomAndMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const chatRooms = await Chat.find({
      'users': { $all: [userId1, userId2] },
    });

    if (!chatRooms) {

      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Extract the roomId and messages from the chat rooms
    const result = chatRooms.map((chatRoom) => ({
      roomId: chatRoom.roomId,
      messages: chatRoom.messages,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const lastMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const chatRooms = await Chat.find({
      'users': { $all: [userId1, userId2] },
    });

    if (!chatRooms || chatRooms.length === 0) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Extract the roomId, last message text, and time from the chat rooms
    const result = chatRooms.map((chatRoom) => ({
      roomId: chatRoom.roomId,
      lastMessage: chatRoom.messages.length > 0 ? chatRoom.messages[chatRoom.messages.length - 1].text : null,
      time: chatRoom.messages.length > 0 ? chatRoom.messages[chatRoom.messages.length - 1].time : null,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

