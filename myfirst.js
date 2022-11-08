const { waitForDebugger } = require('inspector');
var net = require('net');
const port = 8080;
const server = net.createServer(onClientConnection);

server.listen(port, '192.168.0.117', function(){
  console.log(`server starting on port ${port}`);
});

function onClientConnection(sock) {
  console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`)

  sock.on('data', function(data) {
    console.log(`>> data received : ${data}`);
    sock.write("Hello from the server");

    sock.end();
  })

  

  sock.on('close',function(){
    console.log(`${sock.remoteAddress}:${sock.remotePort} Connection closed`);
  });

  //Handle Client connection error.
  sock.on('error',function(error){
      console.error(`${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`);
  });

};