require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const routes = require('./routes');
const db = require('./config/db');
const socketio = require('socket.io');
const socket = require('./helpers/socket');
const handleErr = require('./middleware/handleErr');
const morgan = require('morgan');
const fs = require('fs');

const port = process.env.PORT;

const app = express();
const useragent = require('express-useragent');
db.connect();

app.use(morgan('common'));
app.use(cors());
app.use(useragent.express());

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// config https
const key = fs.readFileSync('./https/private.key');
const cert = fs.readFileSync('./https/certificate.crt');

const server = https.createServer({
  key: key,
  cert: cert,
}, app);

// const server = http.createServer(app);
const io = socketio(server);
socket(io);
routes(app, io);

app.use(handleErr);

server.listen(port, function () {
  console.log('App listening at http://localhost:' + port);
});
