# Dummy Payment Gateway

This is a simple dummy payment gateway for testing/demo purposes. It accepts fake card details and an amount, and always returns a success response (no real payment is processed).

## How to Run

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Make a POST request to `http://localhost:3001/pay` with JSON body:
   ```json
   {
     "cardNumber": "4111111111111111",
     "expiry": "12/30",
     "cvv": "123",
     "amount": 100
   }
   ```

You will get a success response for any valid input.
