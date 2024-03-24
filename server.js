// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const apiRoutes = require('./routes/apiRoutes');
const backtestRoutes = require('./routes/backtestRoutes');
const userRoutes = require('./routes/userRoutes');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const flash = require('express-flash');

// Configure winston to log to console and a file
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/server.log' })
  ],
});

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  logger.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000; 

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS  
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    logger.info("Database connected successfully");
  })
  .catch((err) => {
    logger.error("Database connection error: " + err.message, err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.use(flash()); // Initialize express-flash

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    logger.info("Session created at: " + new Date().toISOString());
  } else {
    sess.views++;
    logger.info(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Rate Limiting configuration for password reset requests
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 password reset requests per windowMs
  handler: function(req, res /*, next */) {
    logger.warn(`Too many password reset requests from IP: ${req.ip}`);
    res.status(429).send('Too many password reset requests, please try again later.');
  },
});

// Apply rate limiting to password reset request route
app.use('/auth/passwordResetRequest', passwordResetLimiter);

// Authentication Routes
app.use(authRoutes);

// Subscription Management Routes
app.use(subscriptionRoutes);

// Dashboard Route
app.use(dashboardRoutes);

// API Routes
app.use(apiRoutes);

// Backtest Route
app.use(backtestRoutes);

// User Profile Route
app.use(userRoutes);

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  if (err) {
    logger.error("Unhandled application error: " + err.message, err.stack);
    res.status(500).send("There was an error serving your request.");
  }
});

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});