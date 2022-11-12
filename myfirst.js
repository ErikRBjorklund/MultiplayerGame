const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const user = new Map();

var uid = 1;

wss.on("connection", ws => {
  console.log("New client has connected!");

  user.set(uid, [0, 0, "", ""]) //x y U/D(keyup/keydown) K(previous key)
  
  ws.send(`PUID ${uid}`);
  uid++;
  ws.on("message", data => {
    hold = data.toString().split(" ");
    console.log(`Client has sent us: ${data}`);

    if (!data.includes("CONNECTED")) {
      console.log(hold[0]);
      console.log(user.get(parseInt(hold[0])));
      
      handle_input(hold);
      
    }
  })

  ws.on("close", () => {
    console.log("Client has disconnected!");
  })
  const interval2 = setInterval(do_movement, 20);
  const interval1 = setInterval(send_data, 20);
  function send_data() {
    for (let [id, pos] of user) {
      ws.send(`UID ${id} X ${pos[0]} Y ${pos[1]}`);
    }
  }
})



function handle_input(input) {
  const tid = parseInt(input[0]);
  user.set(tid, [user.get(tid)[0], user.get(tid)[1], input[1], input[2]]);
}

// function handle_input(tid, input) {
//   if (input.toString() === "W") {
//     user.get(tid)[1] = user.get(tid)[1] - 5;
//   } else if (input.toString() === "A") {
//     user.get(tid)[0] = user.get(tid)[0] - 5;
//   } else if (input.toString() === "S") {
//     user.get(tid)[1] = user.get(tid)[1] + 5;
//   } else if (input.toString() === "D") {
//     user.get(tid)[0] = user.get(tid)[0] + 5;
//   }
// }

function do_movement() {
  for (let [id, pos] of user) {
    if (pos[2] === "D") {
      if (pos[3] == "W") {
        user.set(id, [pos[0], pos[1] - 5, pos[2], pos[3]])
      }
      else if (pos[3] == "A") {
        user.set(id, [pos[0] - 5, pos[1], pos[2], pos[3]])
      }
      else if (pos[3] == "S") {
        user.set(id, [pos[0], pos[1] + 5, pos[2], pos[3]])
      }
      else if (pos[3] == "D") {
        user.set(id, [pos[0] + 5, pos[1], pos[2], pos[3]])
      }
    }
  }
}






// const express=require('express');
// const app=express();
// const PORT=8080;
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.get('/',(req,res)=>{
//   res.write('Welcome to NodeJS + Express CORS Server!')
// })

// app.listen(PORT,()=>{
//     console.log(`Server running on port ${PORT}`)
// })