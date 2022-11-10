const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 900;

const background = new Image();
background.src = './Map2.png';

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


const player_sprite = new Sprite({
    position: {
        x: 50,
        y: 50
    },
    image: player
})

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);
    player_sprite.draw();
    // background_sprite.draw();
}

function update_x(x) {
    player_sprite.position.x = x;
}

function update_y(y) {
    player_sprite.position.y = y;
}

animate();