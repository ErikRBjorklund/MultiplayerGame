const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var x = 0;
var y = 0

wss.on("connection", ws => {
  console.log("New client has connected!");


  ws.on("message", data => {
    
    console.log(`Client has sent us: ${data}`);

    if (data.includes("KEYDOWN:")){
      handle_input(data);
      ws.send(`${x} ${y}`);
    }
  })

  ws.on("close", () => {
    console.log("Client has disconnected!");
  })
})


function handle_input(input) {
  if (input.toString() ==="KEYDOWN: W") {
    y = y - 3;
  } else if (input.toString() ==="KEYDOWN: A") {
    x = x - 3;
  } else if (input.toString() ==="KEYDOWN: S") {
    y = y + 3;
  } else if (input.toString() ==="KEYDOWN: D") {
    x = x + 3;
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