import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

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

app.listen(PORT, () => {
  console.log(`Dummy payment gateway running on http://localhost:${PORT}`);
});
