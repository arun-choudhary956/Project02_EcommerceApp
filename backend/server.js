require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS - allow the deployed frontend (and localhost for dev) to call this API
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Health check - useful for confirming the Render deployment is alive
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'E-commerce API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
