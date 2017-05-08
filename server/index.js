var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('client'));

var messages = [];

var clients = [];
var clientsEnvio = [];
var clienteEmAtendimento = [];
var suports = [];

io.on('connection', function (socket) {
    console.log("IP: " + socket.handshake.address + " conectado...");

    socket.on('add-message', function (data) {

        clienteEmAtendimento.map(function (cliente, index) {
            if (cliente.socket.handshake.headers.cookie == socket.handshake.headers.cookie) {
                cliente.messages.push(data);
                cliente.socket.emit('messages', cliente.messages);
                cliente.suporte.socket.emit('messages', cliente.messages);
                console.log('Suporte: '+cliente.suporte);
            }
        }).join('');

        suports.map(function (suporte, index) {
            if (suporte.socket.handshake.headers.cookie == socket.handshake.headers.cookie) {
                suporte.cliente.messages.push(data);
                suporte.cliente.socket.emit('messages', suporte.cliente.messages);
                suporte.socket.emit('messages', suporte.cliente.messages);
            }
        }).join('');

    });

    socket.on('disconnect', function () {

        var indexRemover = -1;

        clienteEmAtendimento.map(function (cliente, index) {
            if (cliente.socket.handshake.headers.cookie == socket.handshake.headers.cookie) {
                indexRemover = index;
                console.log(cliente.socket.handshake.headers);
                console.log(socket.id);
            }
        }).join('');

        if (indexRemover >= 0) {
            clienteEmAtendimento.splice(indexRemover, 1);
            console.log('Achou cliente atendimento');
        }
        indexRemover = -1;

        clients.map(function (cliente, index) {
            if (cliente.socket.handshake.headers.cookie == socket.handshake.headers.cookie) {
                indexRemover = index;
                console.log(cliente.socket.handshake.headers);
                console.log(socket.id);
            }
        }).join('');

        if (indexRemover >= 0) {
            clients.splice(indexRemover, 1);
            clientsEnvio.splice(indexRemover, 1);
        }
        indexRemover = -1;

        suports.map(function (suporte, index) {
            if (suporte.socket.handshake.headers.cookie == socket.handshake.headers.cookie) {
                indexRemover = index;
                console.log(suporte.socket.id);
                console.log(socket.id);
            }
        }).join('');

        if (indexRemover >= 0) {
            suports.splice(indexRemover, 1);
            console.log('Achou Suporte');
        }

        io.sockets.emit('clientes', clientsEnvio);
    });

    clients.map(function (client, index) {
        if (client.socket.handshake.headers.cookie == socket.handshake.headers.cookie) {
            socket.emit('messages', client.messages);
        }

    }).join('');


    socket.on('escolhe', function (data) {
        if (data) {
            if (data.id > -1) {

                var suport;

                suports.map(function (suporte, index) {
                    if (suporte.socket.handshake.headers.cookie == socket.handshake.headers.cookie) {
                        suport = suporte;
                        if (suporte.cliente && suporte.cliente.socket) {
                            suporte.cliente.socket.disconnect(true);
                        }
                    }
                    return false;
                }).join('');

                if (clients.length > data.id) {

                    if (suport) {

                        suport.cliente = clients[data.id];
                        clients[data.id].suporte = suport;

                        message = {
                            id: 1,
                            text: "Bom dia! " + suport.cliente.nickname + ", Qual é a sua duvida?",
                            nickname: suport.nickname
                        }

                        clients[data.id].messages.push(message);

                        clients[data.id].socket.emit('messages', clients[data.id].messages);
                        socket.emit('messages', clients[data.id].messages);

                        clienteEmAtendimento.push(clients[data.id]);
                        clients.splice(data.id, 1);
                        clientsEnvio.splice(data.id, 1);
                    }
                }
                io.sockets.emit('clientes', clientsEnvio);
            }
        }
    });

    socket.on('entrar', function (data) {
        if (data) {
            if (data.tipoUsuario) {

                if (data.tipoUsuario == 'U') {

                    cliente = {
                        nickname: data.nickname,
                        socket: socket,
                        messages: []
                    };

                    clienteEnvio = {
                        nickname: data.nickname
                    };

                    message = {
                        id: 1,
                        text: "Bem vindo ao Chat de Atendimento " + data.nickname + " \nAguarde que um de Nossos Atendentes ira te atender",
                        nickname: "Bot Suport"
                    };

                    cliente.messages.push(message);

                    socket.emit('messages', cliente.messages);

                    clients.push(cliente);

                    clientsEnvio.push(clienteEnvio);

                    clienteEnvio.id = clientsEnvio.length - 1;

                    io.sockets.emit('clientes', clientsEnvio);
                } else {
                    suport = {
                        nickname: data.nickname,
                        socket: socket,
                        cliente: {}
                    };

                    suports.push(suport);

                    socket.emit('clientes', clientsEnvio);
                }
            }
        }
    });
});

server.listen(3001, function () {
    console.log('Servidor esta funcionando em http://localhost:3000');
});


