const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Redis Client
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Session Management
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
