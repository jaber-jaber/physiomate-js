const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const PORTNAME = 'COM5';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = new SerialPort({ path: PORTNAME, baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/physiomate.html')
})

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css')
})

app.get('/render.js', function(req, res) {
    res.sendFile(__dirname + '/render.js');
});

io.on('connection', (socket) => {
    console.log(socket.id);
    port.on("open", () => {
        console.log('serial port open');
    })
    
    parser.on('data', (data) => {
        socket.emit('data', data);
    });
})

server.listen(3000, () => {
    console.log('Listening!');
})
