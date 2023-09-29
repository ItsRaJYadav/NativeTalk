import express from 'express';
const router = express.Router();

import { acceptFriendRequest, createRoom, findRoomAndMessages, getAllUser, getUserById, getallFriendRequest, getallFriendsByUserId, lastMessages, loginUserController, registerUserController, updateUserController } from '../controllers/authControllers.js';
import { requireAuth } from '../helpers/middleware.js';

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.patch('/update-user',requireAuth, updateUserController);

router.get('/user/:userId', getUserById)
router.get('/allusers/:userId', getAllUser)
router.get('/chat/room/:userId1/:userId2', findRoomAndMessages)
router.get('/lastmessage/:userId1/:userId2', lastMessages)

router.get('/allrequests/:userId', getallFriendRequest)
router.post('/createRoom', createRoom)
router.post('/acceptFriendReq', acceptFriendRequest)
router.get('/allfriends/:userId', getallFriendsByUserId);


export default router; 
