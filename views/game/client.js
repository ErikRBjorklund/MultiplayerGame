// Server Stuff ---------------------------------
const socket = io("http://192.168.0.112:3000")
console.log("client")
// socket.emit('data', 'words');
var clients = new Map()
const player = new Image();
player.src = '../views/game/player.png';
const player_rev = new Image();
player_rev.src = '../views/game/player_reverse.png';

socket.on('data', (welcome) => {
    console.log('data received');
    console.log(welcome)
})



socket.on('position_data', (data) => {
    const data_formatted = data.split(' ')
    // console.log(data_formatted)
    const eid = data_formatted[0]
    const x = data_formatted[1]
    const y = data_formatted[2]
    if (!clients.has(eid)) {
        const player_sprite = new Sprite({
            position: {
                x: x,
                y: y
            },
            image: player,
            image_rev: player_rev
        })
        clients.set(eid, player_sprite)
    } else {
        if (parseInt(clients.get(eid).position.x) === parseInt(x) && parseInt(clients.get(eid).position.y) === parseInt(y)) {
            clients.get(eid).movement = false
        } else {
            clients.get(eid).movement = true
            if (parseInt(clients.get(eid).position.x) > parseInt(x)) {
                clients.get(eid).right = false
            } else if (parseInt(clients.get(eid).position.x) < parseInt(x)) {
                clients.get(eid).right = true
            }
        }
        clients.get(eid).position.x = x
        clients.get(eid).position.y = y
    }
})

socket.on('chat_msg', (data) => {
    clients.get(data[0]).text = data[1]
    // console.log("D: ", data)
})

socket.on('remove', (data) => {
    // console.log(data)
    clients.delete(data)
})

socket.emit('data', "Hello Server")

// Game Stuff ---------------------------------

var mouse = [0, 0]

var canv = document.getElementById("main_canvas");
var ctx = canv.getContext("2d");
var input = [false, false, false, false];


ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function init() {
    canv.style.background = 'beige'
    canv.style.border = '1px solid black'
}

init();


setTimeout(draw, 5);
function draw() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    for (let [uid, data] of clients) {
        data.draw_sprite()
    }

    if (chat_toggle) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, canv.height - 20, canv.width, 20)
        ctx.fillStyle = 'black'
        ctx.font = '15px arial'
        ctx.fillText(chat_msg, 5, canv.height - 5)
    }
    setTimeout(draw, 5);
}


setTimeout(update_server, 5)
function update_server() {
    socket.emit('position', input)
    setTimeout(update_server, 5)
}

var chat_toggle = false
var chat_msg = ''

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

class Sprite {
    constructor({position, image, image_rev}) {
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
        // ctx.fillRect(this.position.x, this.position.y, 100, 200)
        if (!this.movement) {
            if (this.right) {
                ctx.drawImage(this.image, 16, 16, 16, 32, this.position.x, this.position.y, 100, 200)
            } else {
                ctx.drawImage(this.image_rev, 16, 64, 16, 32, this.position.x, this.position.y, 100, 200)
            }
        } else {
            if (this.right) {
                ctx.drawImage(this.image, 16 + 48 * this.frame, 64, 16, 32, this.position.x, this.position.y, 100, 200)
            } else {
                ctx.drawImage(this.image_rev, 16 + 48 * this.frame, 64, 16, 32, this.position.x, this.position.y, 100, 200)
            }
            
            if (this.timer === 20) {
                this.timer = 0
                this.frame = this.frame + 1
                if (this.frame >= 6) {
                    this.frame = 0
                }
            }
            this.timer = this.timer + 1
        }

        if (this.text.length > 0 && this.text_timer < 800) {
            
            
            const wrappedText = wrapText(ctx, this.text, parseInt(this.position.x), parseInt(this.position.y) + 50, 240, 25)
            ctx.fillStyle = 'white'
            ctx.fillRect(this.position.x, this.position.y - 25 * (wrappedText.length - 1), 240, 25 * (wrappedText.length) + 5)
            ctx.fillStyle = 'black'
            ctx.strokeStyle = 'black'
            ctx.strokeWidth = '3px'
            ctx.beginPath()
            ctx.rect(this.position.x, this.position.y - 25 * (wrappedText.length - 1), 240, 25 * (wrappedText.length) + 5)
            ctx.stroke()
            ctx.font = '25px arial'
            wrappedText.forEach(function(item) {
                console.log(`${item[0]}: ${item[1]} ${item[2]}`)
                // item[0] is the text
                // item[1] is the x coordinate to fill the text at
                // item[2] is the y coordinate to fill the text at
                ctx.fillText(item[0], item[1], item[2] - 25 * wrappedText.length); 
            })
            
            // ctx.fillText(txt, this.position.x, this.position.y)
            this.text_timer = this.text_timer + 1
            if (this.text_timer >= 800) {
                this.text_timer = 0
                this.text = ''
            }
        }
        
    }
}

// window.addEventListener('mousemove', (e) => {
//     mouse[0] = e.clientX
//     mouse[1] = e.clientY
// })

// window.addEventListener

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
