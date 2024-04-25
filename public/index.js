let ip = window.location.href.replace('http://','').split(':')
let wss = new WebSocket('ws://'+ip[0]+':3008')

import { addKeyListener } from "./assets/controls.js"

var content = {
    level: {
        canvas : document.querySelector('canvas#level'),
        c : document.querySelector('canvas#level').getContext("2d")
    },
    entities: {
        players: []
    }
}

let controls = {
    up : false,
    left : false,
    down : false,
    right : false
}

content.level.canvas.focus()

/**
 * 
 * @param {CanvasRenderingContext2D} c 
 * @param {*} x 
 * @param {*} y 
 * @param {*} r 
 */
function drawCircle(x,y,r) {
    content.level.c.beginPath()
    content.level.c.arc(x,y,r,0,Math.PI*2,false)
    content.level.c.fillStyle = "red"
    content.level.c.fill()
    content.level.c.stroke()
    content.level.c.closePath()
}

setInterval(updatePlayers, 10)
function updatePlayers() {
    content.level.c.clearRect(
        0,0,
        content.level.canvas.width,
        content.level.canvas.height)
    content.entities.players.forEach(player => {

        //Player Update
        player.y+=player.dy*3
        player.x+=player.dx*3

        drawCircle(player.x, player.y, player.r)
    });
}

wss.onopen = () => {

    wss.onmessage = function(message) {
        let data = JSON.parse(message.data)
        console.log(data["players"][0])
        if (data["todo"]==="render-players") {
            content.entities.players = data.players
        }
    }
    addKey(controls.up, 'KeyW', (direction) => { controls.up = direction; });
    addKey(controls.left, 'KeyA', (direction) => { controls.left = direction; });
    addKey(controls.down, 'KeyS', (direction) => { controls.down = direction; });
    addKey(controls.right, 'KeyD', (direction) => { controls.right = direction; });

    function addKey(direction,code, callback) {
        addKeyListener(content.level.canvas).subscribe((e) => {
            if (e.code === code) {
                callback(direction = e.type!=='keyup')
                if (wss.readyState === WebSocket.OPEN) {
                    console.log('Sending')
                    wss.send(JSON.stringify(
                        {'todo':'key-update',
                        "dy-axis":(Number(controls.down) - Number(controls.up)),
                        "dx-axis":(Number(controls.right) - Number(controls.left))}))
                    }
            }
        })
    }
}