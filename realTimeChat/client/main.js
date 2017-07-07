let socket = io.connect('http://192.168.0.13:6677',{'forceNew' : true});
let user;

//**************************************callbacks de evento
socket.on('message', (messages) => {
  renderMessages(messages)
});

socket.on('registerConfirm',(messages)  =>  {
  renderMessages(messages)
});

socket.on('nick',(data)  =>  {
confirm(data);
});

socket.on('users',(data)  =>  {
renderUsers(data);
});
//*************************************callbacks de evento

//functions por aparte

function renderUsers(data){

  let aux = data.map((message,index) => {
      return (`<div class="user">
      <strong>${message.user}</strong>
      </div>`);
  }).join(' ');
  document.getElementById('users').innerHTML = aux ;
}

function confirm(data){
  if(data.correcto) {
    user = data.nick;
    document.getElementById('nickBox').style.display = "none" ;
    document.getElementById('messageBox').style.display = "block" ;
    alert("usuario creado con exito");
  }else{
    alert("ya existe un usuario con ese nombre");
  }
}

let counterMessages = 0;
function renderMessages(data) {
  let aux = data.map((message,index) => {
    if(message.nickName == user){
      return (`<div class="messageUser">
      <strong>${message.nickName}</strong> dice:
      <p>${message.text}</p>
      </div>`);
    }else{
      return (`<div class="message">
      <strong>${message.nickName}</strong> dice:
      <p>${message.text}</p>
      </div>`);
    }

  }).join(' ');
  document.getElementById('menssages').innerHTML = aux ;
  $("#menssages").animate({ scrollTop: $('#menssages')[0].scrollHeight}, 1000); // funcion con callback de jquery, sirve para animar y desplazar hacia abajo del scroll
  let isExpanded = $(collapseOne).attr("aria-expanded"); // bootstrap usa un atributo para reconocer si esta expandido o no ********

  if(isExpanded == "false"){
    counterMessages++;
    document.getElementById('messageCounter').innerHTML = `NEW( ${counterMessages} )`;
  }

}

function clearCounter(){
  counterMessages = 0;
  document.getElementById('messageCounter').innerHTML = "";
}

function registerNick(e){
  let nick = document.getElementById('nickName').value;
  socket.emit('nick', {nick: nick});
  return false;
}

function addMessage(e){
  let message = {
    nickName : document.getElementById('nickName').value,
    text : document.getElementById('text').value
  };
  socket.emit('add-message',message); // le emite al servidor

  document.getElementById('text').value = "";
  return false;
}
