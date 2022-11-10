
function connect_to_server() {
    // navigator.tcpPermission.requestPermission({remoteAddress:"127.0.0.1", remotePort:6789}).then(
    //     () => {
    //       // Permission was granted
    //       // Create a new TCP client socket and connect to remote host
    //       var mySocket = new TCPSocket("192.168.0.117", 8080);
      
    //       // Send data to server
    //       mySocket.writeable.write("Hello World").then(
    //           () => {
      
    //               // Data sent sucessfully, wait for response
    //               console.log("Data has been sent to server");
    //               mySocket.readable.getReader().read().then(
    //                   ({ value, done }) => {
    //                       if (!done) {
    //                           // Response received, log it:
    //                           console.log("Data received from server:" + value);
    //                       }
      
    //                       // Close the TCP connection
    //                       mySocket.close();
    //                   }
    //               );
    //           },
    //           e => console.error("Sending error: ", e)
    //       );
    //     }
    //   );
}

// function connect_to_server() {
//     const net = require('net');
//     const port= 8080;
//     const client = new net.Socket();

//     client.connect(port, '192.168.0.117', function(){
//         console.log(`client connected to server on port ${port}`)
//         client.write(`Hello from client`);
//     });

//     client.on('data', function(data){
//         console.log(`client received from server : ${data}`)
//     });

//     client.on('close', function(){
//         console.log(`client connection closed`)
//     });

//     client.on('error', function(error){
//         console.error(`client error ${error}`)
//     });

//     function con() {
//         client.connect(port, '192.168.0.117', function(){
//             console.log(`client connected to server on port ${port}`)
//             client.write(`Hello from client`);
//         });
//         setTimeout(function() {
//             con()}, 500);
//     }

//     setTimeout(function() {
//         con()}, 500);
// }