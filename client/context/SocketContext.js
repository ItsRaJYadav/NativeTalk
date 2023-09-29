import React from 'react';
import socketio from 'socket.io-client';
const server_url= 'http://192.168.0.104:8000'
export const socket = socketio.connect(server_url);
export const SocketContext = React.createContext();
