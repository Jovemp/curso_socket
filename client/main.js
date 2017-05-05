var socket = io.connect('http://192.168.1.28:3001',{'forceNew':true});

socket.on('messages', function(data){
    render(data);
});

function render(data){
   var html = data.map(function(message, index){
       return (`
            <div class="message">
                <strong>${message.nickname}</strong>
                <p>${message.text}</p>
            </div>
       `);
   }).join('');

   var div_msgs = document.getElementById('messages');

   div_msgs.innerHTML = html;

   div_msgs.scrollTop = div_msgs.scrollHeight;
}

function addMessage(e) {
    var message = {
        nickname: document.getElementById('nickname').value,
        text: document.getElementById('text').value
    };

    document.getElementById('nickname').style.display = 'none';

    socket.emit('add-message', message);

    return false;
}

function entrar(e) {
    var message = {
        nickname: document.getElementById('nickname').value,
        tipoUsuario: 'U'
    };

    document.getElementById('messages').style.display = 'block';
    document.getElementById('frmMessage').style.display = 'block';
    document.getElementById('frmEntrar').style.display = 'none';

    socket.emit('entrar', message);

    return false;
}

