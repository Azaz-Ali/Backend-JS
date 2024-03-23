const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config()
const PORT = process.env.PORT || 6000;

/******************Person*************************** */
// Import the person routes
const personRoutes = require('./routes/personRoutes');
// Use the person router
app.use('/person', personRoutes);

/*******************Menu****************************** */
// Import menu routes
const menuRoutes = require('./routes/menuRoutes');
app.use('/menu', menuRoutes);

// Body parser middleware
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
