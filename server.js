// Requiring dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Requiring files
const connectDB = require('./backend/config/db');
const urlRoutes = require('./backend/routes/urlRoutes');

// Loading env variables
dotenv.config();

// Connecting to database
connectDB();

// Initializing the app
const app = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Mounting the routes
app.use('/shorten', urlRoutes);

// Setting static files
app.use(express.static(path.join(__dirname, 'client')));

const PORT = process.env.PORT || 5000;

// Listening on port
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
