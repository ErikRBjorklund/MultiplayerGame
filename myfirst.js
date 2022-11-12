const WebSocket = require('ws');
const MS_WAIT = 20;

const wss = new WebSocket.Server({ port: 8080 });
const user = new Map();

var uid = 1;
const interval2 = setInterval(do_movement, MS_WAIT);
const interval1 = setInterval(send_data, MS_WAIT);

wss.on("connection", ws => {
  console.log("New client has connected!");

  user.set(uid, [0, 0, [false, false, false, false]]) //x y  Move_Direction([W, A, S, D])
  
  ws.send(`PUID ${uid}`);
  uid++;
  ws.on("message", data => {
    hold = data.toString().split(" ");
    // console.log(`Client has sent us: ${data}`);

    if (!data.includes("CONNECTED")) {
      handle_input(hold);
      
    }
  })

  ws.on("close", () => {
    console.log("Client has disconnected!");
  })
  
  
})

function send_data() {
  wss.clients.forEach(function each(client) {
    for (let [id, pos] of user) {
      client.send(`UID ${id} X ${pos[0]} Y ${pos[1]}`);
    }
  });
}


function handle_input(input) {
  const tid = parseInt(input[0]);
  // console.log(input);
  list = user.get(tid)[2];
  if (input[1] === 'D') {
    if (input[2] === 'W') {
      list[0] = true;
    } else if (input[2] === 'A') {
      list[1] = true;
    } else if (input[2] === 'S') {
      list[2] = true;
    } else if (input[2] === 'D') {
      list[3] = true;
    }
  } else if (input[1] === 'U') {
    if (input[2] === 'W') {
      list[0] = false;
    } else if (input[2] === 'A') {
      list[1] = false;
    } else if (input[2] === 'S') {
      list[2] = false;
    } else if (input[2] === 'D') {
      list[3] = false;
    }
  }
  
  user.set(tid, [user.get(tid)[0], user.get(tid)[1], list]);
  // console.log(`logging: ${user.get(tid)}`);
}

function do_movement() {
  for (let [id, pos] of user) {
    var b = false;
    var newx = pos[0];
    var newy = pos[1];
    if (pos[2][0] === true) {
      newy = newy - 5;
      b = true;
    }
    if (pos[2][1] === true) {
      newx = newx - 5;
      b = true;
    }
    if (pos[2][2] === true) {
      newy = newy + 5;
      b = true;
    }
    if (pos[2][3] === true) {
      newx = newx + 5;
      b = true;
    }
    if (b) {
      user.set(id, [newx, newy, pos[2]])
    }
    if (id === 1) {
      console.log(`ID:${id} POS:${pos[0]}`);
    }
    
  }
  
}
