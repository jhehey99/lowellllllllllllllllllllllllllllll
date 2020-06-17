const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

/**
 * Database connection
 */
const mongooseConfig = require('./config/mongoose');
const connection = require('./lib/mongoose/connection');

// Uncomment line below to connect to database
// connection.connect(mongooseConfig);

/**
 * My middlewares
 */
app.use(require('./middlewares/send-html'));

/**
 * Routes
 */
app.use('/', require('./routes/views/index'));
app.use('/ecg', require('./routes/views/ecg'));
app.use('/records', require('./routes/views/records'));
app.use('/api/accounts', require('./routes/api/accounts'));
app.use('/api/records', require('./routes/api/records'));
app.use('/dev', require('./dev/dev'));

/**
 * Place socket declarations here
 */
/* Data Sockets */
const dataSocketConfig = require('./config/datasocket');
const DataSocket = require('./lib/socket/datasocket');

/* Device Socket */
const deviceSocketConfig = require('./config/devicesocket');
const DeviceSocket = require('./lib/socket/devicesocket');

/* Process Sockets */
const processSocketConfig = require('./config/processsocket');
const ProcessSocket = require('./lib/socket/processsocket');

/* Python Config */
const pyConfig = require('./config/pyrunner');
const PyRunner = require('./lib/py/pyrunner');

app.setSocket = function (io) {
	/* Client Sockets for testing */
	require('./lib/socket/test')(io);

	io.on('connection', function (socket) {
		console.log(`SocketIO - Connected socketId: ${socket.id}`);
	});

	/* Data Sockets */
	const ecgSocket = new DataSocket(io, dataSocketConfig.ecg);

	/* Device Socket */
	const deviceSocket = new DeviceSocket(io, deviceSocketConfig);

	/* Python Process Runners */
	const ecgPyRunner = new PyRunner(pyConfig.ecg);

	/* Process Sockets */
	const ecgProcessSocket = new ProcessSocket(io, processSocketConfig.ecg, ecgPyRunner);
};

module.exports = app;
