const { render } = require('ejs')
const express = require('express')
const app = express()
app.use(express.static('./'));
app.set('view engine', 'ejs');
const cors = require('cors')
app.use(cors())

const server = app.listen(3000)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})


clients = new Map()


app.get('/', (req, res) => {
    console.log("User Connected")
    res.render("index");
    // init_client();
})

io.on('connection', (socket) => {
    console.log("io connection")
    // initializes client
    clients.set(socket.id, [[50, 50], [false, false, false, false]])
    socket.emit('data', "Hello client!")
    
    socket.on('position', (data) => {
        clients.set(socket.id, [[clients.get(socket.id)[0][0], clients.get(socket.id)[0][1]], data])
        // console.log(clients.get(socket.id))
    })
    var json = ""
    const interval1 = setInterval(send_data, 5);
    function send_data() {
        for (let [eid, data] of clients) {
            json = eid + ' ' + data[0][0] + ' ' + data[0][1] + ' ' + data[2]
            socket.emit('position_data', json)
        }
        
    }
    socket.on('disconnect', (data) => {
        clients.delete(socket.id)
        console.log("client disconnected")
        socket.broadcast.emit('remove', socket.id)
    });

    socket.on('chat_msg', (data) => {
        socket.broadcast.emit('chat_msg', [socket.id, data])
        socket.emit('chat_msg', [socket.id, data])
    })
})


function fetch_data(socket) {
    socket.on('data', (data) => {
        return(data)
    })
}

run_game();


//Game runs here. Client can request game info.
function run_game() {
    
    handle_io()
    // send_pos()
    setTimeout(run_game, 5)
}

function handle_io() {
    // console.log(clients)
    for (let [uid, data] of clients) {
        if (data[1][0] === true) {
            data[0][1] -= 2;
        }
        if (data[1][1] === true) {
            data[0][0] -= 2;
        }
        if (data[1][2] === true) {
            data[0][1] += 2;
        }
        if (data[1][3] === true) {
            data[0][0] += 2;
        }
    }
}

function send_pos(socket) {
    
    setTimeout(() => {
        send_pos(socket)
    }, 5)
}