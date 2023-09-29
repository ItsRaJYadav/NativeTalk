import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import DataBase from './config/Database.js'; 
import authRoutes from './routes/authRoutes.js';
import { sendSMS } from './helpers/twilioConfig.js';
import http from 'http';
import { configureSocket } from './socket.js';

const app = express();
const httpServer = http.createServer(app);
dotenv.config();
DataBase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// Logging with Morgan
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);






app.get('/send-sms', async (req, res) => {
  const messageText = 'Hello from your server! your otp message is: 1234';
  const recipientPhoneNumber = '+919472040607';

  try {
    await sendSMS(messageText, recipientPhoneNumber);
    res.send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});




const port = process.env.PORT || 8000; 
httpServer.listen(port, () => {
  console.log(`Socket Server is listening on port ${port}`);
  configureSocket(httpServer);
});
