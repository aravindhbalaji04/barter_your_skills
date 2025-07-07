
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';


const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = 3001;


app.use(cors());
app.use(express.static('../login_page')); 
app.use('/feed', express.static('../feed'));
app.use(bodyParser.json());

app.get("/", (req,res) =>{
  res.redirect("/index.html");
})


// Dummy payment endpoint
app.post('/pay', (req, res) => {
  const { cardNumber, expiry, cvv, amount } = req.body;
  // Basic validation (for demo only)
  if (!cardNumber || !expiry || !cvv || !amount) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  if (cardNumber.length < 12 || cardNumber.length > 19) {
    return res.status(400).json({ success: false, message: 'Invalid card number.' });
  }
  if (cvv.length < 3 || cvv.length > 4) {
    return res.status(400).json({ success: false, message: 'Invalid CVV.' });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount.' });
  }
  // Always succeed (dummy)
  return res.json({ success: true, message: `Payment of $${amount} successful!` });
});

// --- Socket.IO Chat ---
// In-memory message store (for demo only)
const messages = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
    // Send chat history
    if (messages[room]) {
      messages[room].forEach(msg => {
        socket.emit('chatMessage', msg);
      });
    }
  });

  socket.on('chatMessage', (msg) => {
    // Save message
    if (!messages[msg.room]) messages[msg.room] = [];
    messages[msg.room].push(msg);
    // Emit to all in room
    io.to(msg.room).emit('chatMessage', msg);
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server with chat running on http://localhost:${PORT}`);
});