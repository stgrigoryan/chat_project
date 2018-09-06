

const url = "ws://" + window.location.host;

let user;

console.log(url);
let count = 0;


function enterClick() {

    ws = new WebSocket (url);

    user = document.getElementById("name").value;

    ws.onmessage = function (msg) {
        let chatBox = document.getElementById("chatbox");

        let message = JSON.parse(msg.data);
        console.log(message);
        if (message.text == 'is typing') {
            if(count == 0) {
                chatBox.innerHTML = "<b>" + message.user + "</b>:" +"<i> "+ message.text + "</i>" + "<br>" + chatBox.innerHTML;
            }
            count++;
        } else {
            let lines = chatBox.innerHTML.split('<br>');
            if(lines[0].includes('is typing')){
                lines.splice(0, 1);
                chatBox.innerHTML = lines.join('<br>')
            }
            chatBox.innerHTML = "<b>" + message.user + "</b>:" + message.text + "<br>" + chatBox.innerHTML;
            count = 0;

        }
    };

    let usermesg = document.getElementById("usermsg").value;
    console.log(usermesg);


    usermsg.addEventListener("keypress", function () {
        let message = {};
        message.user = user;
        message.text = 'is typing';
        ws.send(JSON.stringify(message));

    });


    ws.onopen = function () {
        console.log(`Socket opened`);
        let message = {};
        message.user = user;
        message.text = " <b>Joined the chat </b>";
        ws.send(JSON.stringify(message));
        onlineusers.innerHTML += "<b>" + message.user + "</b>" + "<br>" ;

    };

   // window.location = "http://localhost:3030/chat-room?" + (Math.random() * 10);

    document.getElementById("name").value = '';
    document.getElementById("login").setAttribute("style", "display:none");
    document.getElementById("room").setAttribute("style", "");
}



function sendMessage() {
    let message = {};
    message.user = user;
    message.text = document.getElementById("usermsg").value;

    console.log(message);

    ws.send(JSON.stringify(message));
    document.getElementById("usermsg").value = "";

}


window.onload = function () {
     document.getElementById("room").setAttribute("style", "display:none");
}

