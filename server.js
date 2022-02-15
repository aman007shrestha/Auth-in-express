require('dotenv').config({ path: './config.env' });
const connectDb = require('./config/db');
const errorHandler = require('./middleware/error');
// Connect DB
connectDb();

const express = require('express');
const app = express();
//  Datas from body like body parser
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));
// Error handler should be last piece of middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`App running on port ${PORT}`)
);

// Handle crashes for easier reading
process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
