const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Controllers
const { globalErrorHandler } = require('./controllers/errorsController');

// Routers
const { usersRouter } = require('./routes/usersRoutes');
const { productsRouter } = require('./routes/productsRoutes');
const { cartRouter } = require('./routes/cartRoutes');
const { categoriesRouter } = require('./routes/categoryRoutes');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: 'Too many requests from this IP',
});

app.use(limiter);

// Endpoints
app.use('/api/v1/users', usersRouter );
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/cart', cartRouter);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };