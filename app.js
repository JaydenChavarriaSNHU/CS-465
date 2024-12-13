require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const passport = require('passport');
const cors = require('cors');  // Make sure this is present
const jwt = require('jsonwebtoken');

require('./app_api/models/db');
require('./app_api/config/passport');

//Define routers 
const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes/index');

const handlebars = require('hbs');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not set!');

  process.exit(1);
}

const app = express();

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader) {
    console.log('No auth header present');
    return res.status(401).json({ message: 'No authorization header' });
  }

  try {
    const token = authHeader.split(' ')[1];
    console.log('Token validation attempt for request:', req.path);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token validation error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');
handlebars.registerPartials(__dirname + '/app_server/views/partials');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

app.use('/api', (req, res, next) => {
  // Allow public access to GET /trips endpoints
  if (req.method === 'GET' && (req.path === '/trips' || req.path.startsWith('/trips/'))) {
      return next();
  }
  // Allow public access to login and register endpoints
  if (req.path === '/login' || req.path === '/register') {
      return next();
  }
  // Apply authentication for all other API routes
  return checkAuth(req, res, next);
});

// wire-up routes to controllers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// catch unauthorized error 401
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error('Authentication error:', {
      path: req.path,
      method: req.method,
      headers: req.headers
    });
    return res.status(401).json({
      message: "Authentication error",
      error: err.message
    });
  }
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
