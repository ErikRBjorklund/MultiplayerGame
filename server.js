const { render } = require('ejs')
const express = require('express')
const app = express()
app.use(express.static('./'));
app.set('view engine', 'ejs');
const cors = require('cors')
app.use(cors())

const server = app.listen(3000)
// All the homeys hate cors
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})

let clients = new Map()
let projectiles = new Map()

app.get('/', (req, res) => {
    console.log("User Connected")
    res.render("../views/index");
})

// Connection Initializer
io.on('connection', (socket) => {
    console.log(`io connection on ${socket.id}`)
    // initializes client
    clients.set(socket.id, [[50, 50], [false, false, false, false]])
    socket.emit('socket_id', socket.id)
    
   
    var json = ""
    const interval1 = setInterval(send_data, 5);
    function send_data() {
        for (let [id, data] of clients) {
            json = id + ' ' + data[0][0] + ' ' + data[0][1] + ' ' + data[2]
            socket.emit('position_data', json)
        }

        for (let [id, pos] of projectiles) {
            socket.emit('proj_1', [id, projectiles.get(id)[0][0], projectiles.get(id)[0][1]])
        }
        
    }
    // Socket Listeners ------

    // Position
    socket.on('position', (data) => {
        clients.set(socket.id, [[clients.get(socket.id)[0][0], clients.get(socket.id)[0][1]], data])
    })

    // Client Disconnect
    socket.on('disconnect', (data) => {
        clients.delete(socket.id)
        console.log("client disconnected")
        // Alert that client has disconnected
        socket.broadcast.emit('remove', socket.id)
    });

    // Handles chat messages
    socket.on('chat_msg', (data) => {
        console.log('message: ', data)
        socket.broadcast.emit('chat_msg', [socket.id, data])
        socket.emit('chat_msg', [socket.id, data])
    })

    socket.on('proj_1', (data) => {
        // console.log("projectile")
        // console.log('data: ', data)
        // console.log(clients.get(socket.id)[0])
        // Socket ID: [[startx, starty], [aim_x, aim_y]]
        let theta = Math.atan2(parseFloat(data[1]) - 400, parseFloat(data[0]) - 700)
        // let theta = Math.atan((parseFloat(parseFloat(data[1]) - 300)) / (parseFloat(data[0]) - 650))
        console.log(theta * (180/Math.PI))
        let ror = (parseFloat(data[1]) - parseFloat(clients.get(socket.id)[0][1])) / (parseFloat(data[0]) - clients.get(socket.id)[0][0])
        // console.log(ror)
        // console.log(Math.cos(theta))
        // console.log(Math.sin(theta))
        projectiles.set(socket.id, [[parseFloat(clients.get(socket.id)[0][0]), parseFloat(clients.get(socket.id)[0][1])], data, theta])
    })
})


//Game runs here. Handles recurring events.
setInterval(run_game, 5);
function run_game() {
    handle_io()
    update_projectiles()
}

// Handles input/output flags from clients
function handle_io() {
    // console.log(clients)
    for (let [uid, data] of clients) {
        if (data[1][0] || data[1][2]) {
            if (data[1][0]) {
                // handles up diagonals
                if (data[1][1] && !data[1][2] && !data[1][3]) {
                    data[0][1] -= 1.414
                    data[0][0] -= 1.414
                } else if (!data[1][1] && !data[1][2] && data[1][3]) {
                    data[0][1] -= 1.414
                    data[0][0] += 1.414
                } else {
                    data[0][1] -= 2;
                }
            }
            if (data[1][2] === true) {
                // handles down diagonals
                if (data[1][1] && !data[1][0] && !data[1][3]) {
                    data[0][1] += 1.414
                    data[0][0] -= 1.414
                } else if (!data[1][1] && !data[1][0] && data[1][3]) {
                    data[0][1] += 1.414
                    data[0][0] += 1.414
                } else {
                    data[0][1] += 2;
                }
            }
        } else {
            if (data[1][1] === true) {
                data[0][0] -= 2;
            }
            
            if (data[1][3] === true) {
                data[0][0] += 2;
            }
        }
    }
}

const proj_speed = 4
function update_projectiles() {
    for (let [id, pos] of projectiles) {
        // console.log(pos)
        // // console.log('theta: ', theta)
        // // console.log('cos: ', Math.cos(theta))

        // console.log(Math.cos(pos[2]))
        // console.log(Math.sin(pos[2]))
        let x_change = Math.cos(pos[2]) * proj_speed + pos[0][0]
        let y_change = Math.sin(pos[2]) * proj_speed + pos[0][1]
        projectiles.set(id, [[x_change, y_change], pos[1], pos[2]])

        // if (projectiles.get(id)[1][2]) {
        //     let x_change = -1 * Math.cos(pos[2]) * proj_speed + pos[0][0]
        //     let y_change = -1 * Math.sin(pos[2]) * proj_speed + pos[0][1]
        //     projectiles.set(id, [[x_change, y_change], pos[1], pos[2]])

        // } else {
        //     let x_change = Math.cos(pos[2]) * proj_speed + pos[0][0]
        //     let y_change = Math.sin(pos[2]) * proj_speed + pos[0][1]
        //     projectiles.set(id, [[x_change, y_change], pos[1], pos[2]])

        // }
        
        
        // // console.log(x_change)
        // // console.log(y_change)
        
        
        // console.log(pos)
    }
}