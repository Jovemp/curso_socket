var socket = io.connect('http://192.168.1.28:3001',{'forceNew':true});

socket.on('messages', function(data){
    render(data);
});

socket.on('clientes', function(data){
    renderCliente(data);
});

function render(data){
   var html = data.map(function(message, index){
       return (`
            <div class="message success">
                <strong>${message.nickname}</strong>
                <p>${message.text}</p>
            </div>
       `);
   }).join('');

   var div_msgs = document.getElementById('messages');

   div_msgs.innerHTML = html;

   div_msgs.scrollTop = div_msgs.scrollHeight;
}

function renderCliente(data){
   var html = data.map(function(cliente, index){
       return (`
            <div class="cliente" onclick="escolhe(${cliente.id});">
                <strong>${cliente.id} - ${cliente.nickname}</strong>
            </div>
       `);
   }).join('');

   var div_msgs = document.getElementById('clientes');

   div_msgs.innerHTML = html;
}

function addMessage(e) {
    var message = {
        nickname: document.getElementById('nickname').value,
        text: document.getElementById('text').value
    };

    socket.emit('add-message', message);

    return false;
}

function escolhe(numero){
    var message = {
        id: numero
    }

    console.log(numero);

    socket.emit('escolhe', message);
}

function entrar(e) {
    var message = {
        nickname: document.getElementById('nickname').value,
        tipoUsuario: 'S'
    };

    document.getElementById('messages').style.display = 'block';
    document.getElementById('clientes').style.display = 'block';
    document.getElementById('frmMessage').style.display = 'block';
    document.getElementById('frmEntrar').style.display = 'none';

    socket.emit('entrar', message);

    return false;
}

