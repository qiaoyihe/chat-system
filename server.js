const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('新用户连接: ', socket.id);

  socket.on('user_message', (data) => {
    const { message, time } = data;
    console.log(`用户消息: ${message} | 时间: ${time}`);
    io.emit('new_message', {
      sender: 'customer',
      message: message,
      time: time,
    });
  });

  socket.on('admin_message', (data) => {
    const { message, time } = data;
    console.log(`客服消息: ${message} | 时间: ${time}`);
    io.emit('new_message', {
      sender: 'support',
      message: message,
      time: time,
    });
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('服务已启动：http://localhost:3000');
});