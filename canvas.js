const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 900;

const background = new Image();
background.src = './Map2.png';

const playerMap = new Map();
const player = new Image();
player.src = './player.png';

class Sprite {
    constructor({position, velocity, image}) {
        this.position = position
        this.image = image
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}


// const background_sprite = new Sprite({
//     position: {
//         x: -750,
//         y: -750
//     },
//     image: background
// })



function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);
    draw_users();
    // background_sprite.draw();
}

function update_pos(x, y, tid) {
    const player_sprite = new Sprite({
        position: {
            x: x,
            y: y
        },
        image: player
    })
    playerMap.set(tid, player_sprite)
}

function draw_users() {
    for (let x of playerMap) {
        x[1].draw();
    }
}

animate();