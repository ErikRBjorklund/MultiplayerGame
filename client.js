const net = require('net');
const port= 8080;
const client = new net.Socket();

client.connect(port, function(){
    console.log(`client connected to server on port ${port}`)
    client.write(`Hello from client`);
});

client.on('data', function(data){
    console.log(`client received from server : ${data}`)
});

client.on('close', function(){
    console.log(`client connection closed`)
});

client.on('error', function(error){
    console.error(`client error ${error}`)
});

function con() {
    client.connect(port, '192.168.0.117', function(){
        console.log(`client connected to server on port ${port}`)
        client.write(`Hello from client`);
    });
    setTimeout(function() {
        con()}, 500);
}

setTimeout(function() {
    con()}, 500);