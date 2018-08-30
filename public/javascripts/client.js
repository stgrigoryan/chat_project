/**
 * Created by stepangrigoryan on 8/30/18.
 */

const  ws = new WebSocket('ws://localhost:3030');


ws.onopen = () => {
    console.log(`Socket opened`);
};



function  enterClick() {
    var nickname = document.getElementById("nickname").value;


    console.log(nickname);

    ws.send(nickname);

    window.location = "http://localhost:3030/chat-room?nickname=" + nickname;

    document.getElementById("nickname").value = ' ';

};


