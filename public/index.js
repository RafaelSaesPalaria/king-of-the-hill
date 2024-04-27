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
function drawCircle(x,y,r,c="blue") {
    content.level.c.beginPath()
    content.level.c.arc(x,y,r,0,Math.PI*2,false)
    content.level.c.fillStyle = `${c}`
    content.level.c.fill()
    content.level.c.stroke()
    content.level.c.closePath()
}

let lastUpdate = Date.now()
setInterval(updatePlayers,10)
function updatePlayers() {
    content.level.c.clearRect(
        0,0,
        content.level.canvas.width,
        content.level.canvas.height)
    content.entities.players.forEach(player => {

        //Player Update
        let ms = (Date.now() - lastUpdate)/10
            player.y+=player.dy*3*ms
            player.x+=player.dx*3*ms

        drawCircle(player.x, player.y, player.r, player.color)
    });
    lastUpdate = Date.now()
}

wss.onopen = () => {

    wss.send(JSON.stringify({'todo':'render'}))

    wss.onmessage = function(message) {
        let data = JSON.parse(message.data)
        console.log(data)
        if (data["todo"]==="render-players") {

            data.me.color = "red"

            content.entities.players = data.players
            content.entities.players.push(data.me)

            lastUpdate = data.timestamp
            updatePlayers()
            lastUpdate = Date.now()
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