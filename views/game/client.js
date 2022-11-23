// Server Stuff ---------------------------------
const socket = io("http://localhost:3000")

let clients = new Map()
let projectiles = new Map()

const player = new Image();
player.src = '../views/game/player.png';
const player_rev = new Image();
player_rev.src = '../views/game/player_reverse.png';
var eid;

socket.on('socket_id', (socket_id) => {
    eid = socket_id
    console.log(eid)
})

// Server receives positional data
// Formatted: id# x y
socket.on('position_data', (data) => {
    const data_formatted = data.split(' ')
    const eid = data_formatted[0]
    const x = data_formatted[1]
    const y = data_formatted[2]

    // If it is a new ID, initialize a sprite
    if (!clients.has(eid)) {
        const player_sprite = new Sprite({
            id: eid,
            position: {
                x: x,
                y: y
            },
            image: player,
            image_rev: player_rev
        })
        clients.set(eid, player_sprite)
    // If it is not a new ID, update.
    } else {
        // No Movement
        if (parseInt(clients.get(eid).position.x) === parseInt(x) && parseInt(clients.get(eid).position.y) === parseInt(y)) {
            clients.get(eid).movement = false
        // Movement
        } else {
            clients.get(eid).movement = true
            // Moving Left
            if (parseInt(clients.get(eid).position.x) > parseInt(x)) {
                clients.get(eid).right = false
            // Moving Right
            } else if (parseInt(clients.get(eid).position.x) < parseInt(x)) {
                clients.get(eid).right = true
            }
        }
        // Update Position
        clients.get(eid).position.x = x
        clients.get(eid).position.y = y
    }
})

// Chat Message Handler
socket.on('chat_msg', (data) => {
    console.log('message')
    console.log(data[1])
    clients.get(data[0]).text = data[1]
})

// Another User Disconnected
socket.on('remove', (data) => {
    clients.delete(data)
})

socket.on('proj_1', (data) => {
    projectiles.set(data[0], [data[1], data[2]])
})


// Game Stuff ---------------------------------



var canv = document.getElementById("main_canvas");
var ctx = canv.getContext("2d");

ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

var input = [false, false, false, false];
var mouse = [0, 0]

init();

function init() {
    canv.style.background = 'beige'
    canv.style.border = '1px solid black'
}

// Contains recurring events.
const game_interval = setInterval(game_state, 5);
function game_state() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    draw_background()
    draw()
    draw_projectiles()
    
    socket.emit('position', input)
}

function draw_background() {
    ctx.fillStyle = '#FFFFDC'
    for (let i = -40; i < 40; i += 2) {
        for (let k = -39; k < 40; k += 2) {
            ctx.fillRect(100 * i - clients.get(eid).position.x, 100 * k - clients.get(eid).position.y, 100, 100)
        }
    }
    for (let i = -39; i < 40; i += 2) {
        for (let k = -40; k < 40; k += 2) {
            ctx.fillRect(100 * i - clients.get(eid).position.x, 100 * k - clients.get(eid).position.y, 100, 100)
        }
    }
    
}

// Used in chat (toggle shows if it is enabled)
var chat_toggle = false
var chat_msg = ''

// Draws all sprites to board
function draw() {
    for (let [uid, data] of clients) {
        if (data.id == eid) {
            data.draw_user()
            
        } else {
            data.draw_sprite()
        }
        data.draw_typebox()
    }
    // If user is in typing mode
    if (chat_toggle) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, canv.height - 20, canv.width, 20)
        ctx.fillStyle = 'black'
        ctx.font = '15px arial'
        ctx.fillText(chat_msg, 5, canv.height - 5)
    }
}

const center_x = canv.width / 2 - 50
const center_y = canv.height / 2 - 100

function draw_projectiles() {
    for (let i of projectiles) {
        // console.log(`location: ${i} ${i}`)
        ctx.fillStyle = 'red'
        console.log("i: ", i[1])
        ctx.fillRect(parseFloat( i[1][0] - clients.get(eid).position.x) + center_x + 20,  i[1][1] - parseFloat(clients.get(eid).position.y) + center_y + 80, 20, 20)
        ctx.fillStyle = 'gray'
        ctx.fillRect(parseFloat( i[1][0] - clients.get(eid).position.x) + center_x + 20,  i[1][1] - parseFloat(clients.get(eid).position.y) + center_y + 140, 20, 20)
        // ctx.fillRect(i[1][0], i[1][1], 20, 20)
    }
}



// Sprite class (contains internal sprite stuff)
class Sprite {
    constructor({id, position, image, image_rev}) {
        this.id = id
        this.position = position
        this.image = image
        this.image_rev = image_rev
        this.frame = 0
        this.timer = 0
        this.text_timer = 0
        this.movement = false
        this.right = true
        this.text = ''
    }
    draw_sprite() {
        // If it is not moving show static

        if (!this.movement) {
            if (this.right) {
                ctx.drawImage(this.image, 16, 16, 16, 32, center_x - parseFloat(clients.get(eid).position.x) + parseFloat(this.position.x), center_y - parseFloat(clients.get(eid).position.y) + parseFloat(this.position.y), 100, 200)
            } else {
                ctx.drawImage(this.image_rev, 16, 64, 16, 32, center_x - parseFloat(clients.get(eid).position.x) + parseFloat(this.position.x), center_y - parseFloat(clients.get(eid).position.y) + parseFloat(this.position.y), 100, 200)
            }
            // If it is moving show moving animation
        } else {
            if (this.right) {
                ctx.drawImage(this.image, 16 + 48 * this.frame, 64, 16, 32, center_x - parseFloat(clients.get(eid).position.x) + parseFloat(this.position.x), center_y - parseFloat(clients.get(eid).position.y) + parseFloat(this.position.y), 100, 200)
            } else {
                ctx.drawImage(this.image_rev, 16 + 48 * (5 - this.frame), 64, 16, 32, center_x - parseFloat(clients.get(eid).position.x) + parseFloat(this.position.x), center_y - parseFloat(clients.get(eid).position.y) + parseFloat(this.position.y), 100, 200)
            }
            
            // Timer for movement animation (20 * 5ms == .1s)
            if (this.timer === 20) {
                this.timer = 0
                this.frame = this.frame + 1
                // Reset frames
                if (this.frame >= 6) {
                    this.frame = 0
                }
            }
            this.timer = this.timer + 1
        }
    }
    draw_user() {
        console.log('test')
        if (!this.movement) {
            if (this.right) {
                ctx.drawImage(this.image, 16, 16, 16, 32, center_x, center_y, 100, 200)
            } else {
                ctx.drawImage(this.image_rev, 16, 64, 16, 32, center_x, center_y, 100, 200)
            }
            // If it is moving show moving animation
        } else {
            if (this.right) {
                ctx.drawImage(this.image, 16 + 48 * this.frame, 64, 16, 32, center_x, center_y, 100, 200)
            } else {
                ctx.drawImage(this.image_rev, 16 + 48 * (5 - this.frame), 64, 16, 32, center_x, center_y, 100, 200)
            }
            
            // Timer for movement animation (20 * 5ms == .1s)
            if (this.timer === 20) {
                this.timer = 0
                this.frame = this.frame + 1
                // Reset frames
                if (this.frame >= 6) {
                    this.frame = 0
                }
            }
            this.timer = this.timer + 1
        }
    }

    draw_typebox() {
        console.log('typebox')
        // Player message (holds timer for message too)
        if (this.text.length > 0 && this.text_timer < 800) {
            const wrappedText = wrapText(ctx, this.text, center_x - parseFloat(clients.get(eid).position.x) + parseFloat(this.position.x), center_y - parseFloat(clients.get(eid).position.y) + parseFloat(this.position.y) + 50, 240, 25)
            ctx.fillStyle = 'white'
            ctx.fillRect(center_x - parseFloat(clients.get(eid).position.x) + parseFloat(this.position.x), center_y - parseFloat(clients.get(eid).position.y) + parseFloat(this.position.y) - 25 * (wrappedText.length - 1), 240, 25 * (wrappedText.length) + 5)
            ctx.fillStyle = 'black'
            ctx.strokeStyle = 'black'
            ctx.strokeWidth = '3px'
            ctx.beginPath()
            ctx.rect(center_x - parseFloat(clients.get(eid).position.x) + parseFloat(this.position.x), center_y - parseFloat(clients.get(eid).position.y) + parseFloat(this.position.y) - 25 * (wrappedText.length - 1), 240, 25 * (wrappedText.length) + 5)
            ctx.stroke()
            ctx.font = '25px arial'
            wrappedText.forEach(function(item) {
                // item[0] is the text
                // item[1] is the x coordinate to fill the text at
                // item[2] is the y coordinate to fill the text at
                ctx.fillText(item[0], item[1], item[2] - 25 * wrappedText.length); 
            })
            
            this.text_timer = this.text_timer + 1
            if (this.text_timer >= 800) {
                this.text_timer = 0
                this.text = ''
            }
        }
    }
}



// EVENT LISTENERS --------------------------

window.addEventListener('mousemove', (e) => {
    mouse[0] = e.clientX
    mouse[1] = e.clientY
})

document.addEventListener('keydown', (e) => {
    const i = e.key.toUpperCase()    
    if (!chat_toggle) {
        if (i === 'W') {
            input[0] = true
        }
        if (i === 'A') {
            input[1] = true
        }
        if (i === 'S') {
            input[2] = true
        }
        if (i === 'D') {
            input[3] = true
        }
        if (i === ' ') {
            var bool = false //handles shot to left
            if (mouse[0] - center_x < parseFloat(clients.get(eid).position.x)) {
                console.log('left')
                bool = true
            }
            // socket.emit('proj_1', [mouse[0] - 750 + parseFloat(clients.get(eid).position.x), mouse[1] + parseFloat(clients.get(eid).position.y) - center_y, bool])
            socket.emit('proj_1', [mouse[0], mouse[1], bool])
        }
    } else {
        if (' ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~`!@#$%^&*()-_=+.,'.includes(i)) {
            chat_msg = chat_msg + i
        }
    }
    if (i === 'ENTER') {
        if (chat_toggle) {
            if (chat_msg.length != 0) {
                socket.emit('chat_msg', chat_msg)
                console.log(chat_msg)
                chat_msg = ''
            }
            chat_toggle = false
        } else {
            chat_toggle = true
        }
    }
    
})
document.addEventListener('keyup', (e) => {
    const i = e.key.toUpperCase()
    if (i === 'W') {
        input[0] = false
    }
    if (i === 'A') {
        input[1] = false
    }
    if (i === 'S') {
        input[2] = false
    }
    if (i === 'D') {
        input[3] = false
    }
})

// Helper Methods

const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for(var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if(n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}


