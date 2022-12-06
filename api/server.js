const express = require('express'); // importing a CommonJS module
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//Middleware:
function customMorgan(req, res, next){
  console.log(`You made a ${req.method} request`)
  next()
}

//B/c the next() was not invoked, the request kept looping
function shortCircuit(req, res, next){
  res.json(`The request was short cicuited`)
}

//Will not show in the console or the http request - will show in httpie if you interpolate it in the server.get() function
function addFriend(req, res, next){
  req.friend = `Breaking Benjamin`
  next()
}

server.use(express.json());
server.use(morgan('dev'))
//invoking middleware:
server.use(customMorgan)
// server.use(shortCircuit)
server.use(addFriend)

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Hubs API ${req.friend}</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
