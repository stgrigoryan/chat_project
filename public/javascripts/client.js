

const url = "ws://" + window.location.host;

let user;

console.log(url);


function enterClick() {

    ws = new WebSocket (url);

    user = document.getElementById("name").value;

    ws.onmessage = function (msg) {
        let chatBox = document.getElementById("chatbox");
        let message = JSON.parse(msg.data);

        //console.log(message);


        onlineusers.innerHTML += "<b>" + message.user + "</b>" + "<br>" ;
        chatBox.innerHTML = "<b>" + message.user + "</b>:" + message.text + "<br>" + chatBox.innerHTML;
    };

    let usermesg = document.getElementById("usermsg").value;
    console.log(usermesg);

    if (usermesg !== "" ) {
        console.log (user + "is typing");
        ws.send(JSON.stringify(user) + " is typing");
    }

    // usermsg.addEventListener("keypress", function () {
    //
    //     ws.send(JSON.stringify(user) + " is typing");
    //
    // });


    ws.onopen = function () {
        console.log(`Socket opened`);
        let message = {};
        message.user = user;
        message.text = " <b>Joined the chat </b>";
        ws.send(JSON.stringify(message));

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

