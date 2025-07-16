const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.json());

const ADMIN_PASSWORD = '123456789'; // 管理员密码

app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

io.on('connection', (socket) => {
  console.log('一个用户连接：', socket.id);

  socket.on('user_message', (data) => {
    io.emit('new_message', { sender: '用户', message: data });
  });

  socket.on('admin_message', (data) => {
    io.emit('new_message', { sender: '客服', message: data });
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接：', socket.id);
  });
});

http.listen(3000, () => {
  console.log('服务器已启动：http://localhost:3000');
});
