// import { Server } from 'socket.io';
// import Chat from './models/ChatData.js';

// export function configureSocket(httpServer) {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: ['http://192.168.0.104'],
//     },
//   });

//   io.on('connection', (socket) => {
//     socket.on('join-room', ({ roomId, role }) => {
//       console.log(`User joined room ${roomId} with role ${role}`);
//       socket.join(roomId);
//     });

//     socket.on('chat', async ({ senderId, text, roomId, time }) => {
//       try {

//         let chatData = await Chat.findOne({ roomId });

//         if (!chatData) {
//           chatData = new Chat({ roomId, messages: [] });
//         }

//         const { messages } = chatData;


//         messages.push({ senderId, text, time });


//         chatData.messages = messages;
//         await chatData.save();

//         // Emit the message to all users in the room
//         io.to(roomId).emit('chat', { text, roomId, senderId, time });
        

//       } catch (error) {
//         console.error('Error saving chat message:', error);
//       }
//     });

//     // Handle typing events
//     socket.on('typing', ({ roomId }) => {
//       console.log(`User is typing in room ${roomId}`);
//       socket.to(roomId).emit('typing-started-from-server', { roomId });
//     });

//     socket.on('stop_typing', ({ roomId }) => {
//       console.log(`User stopped typing in room ${roomId}`);
//       socket.to(roomId).emit('typing-stopped-from-server', { roomId });
//     });

//     socket.on('disconnect', () => {
//       // Handle user disconnect event if needed
//     });
//   });
// }


import { Server } from 'socket.io';
import Chat from './models/ChatData.js';

export function configureSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://192.168.0.104'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join-room', async ({ roomId, role }) => {
      console.log(`User joined room ${roomId} with role ${role}`);
      socket.join(roomId);

    });

    socket.on('chat', async ({ senderId, text, roomId, time }) => {
      try {
        let chatData = await Chat.findOne({ roomId });

        if (!chatData) {
          chatData = new Chat({ roomId, messages: [] });
        }

        const { messages } = chatData;

        messages.push({ senderId, text, time });

        chatData.messages = messages;
        await chatData.save();

        // Emit the message to all users in the room
        io.to(roomId).emit('chat', { text, roomId, senderId, time });

        
        io.to(roomId).emit('new-chat', { text, roomId, senderId, time });
      } catch (error) {
        console.error('Error saving chat message:', error);
      }
    });

    // Handle typing events
    socket.on('typing', ({ roomId }) => {
      console.log(`User is typing in room ${roomId}`);
      socket.to(roomId).emit('typing-started-from-server', { roomId });
    });

    socket.on('stop_typing', ({ roomId }) => {
      console.log(`User stopped typing in room ${roomId}`);
      socket.to(roomId).emit('typing-stopped-from-server', { roomId });
    });

    socket.on('disconnect', () => {
      // Handle user disconnect event if needed
    });
  });
}

