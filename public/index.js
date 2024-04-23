let wss = new WebSocket('ws://localhost:3008')

import { addKeyListener } from "./assets/controls.js"

var content = {
    level: {
        canvas : document.querySelector('canvas#level'),
        c : document.querySelector('canvas#level').getContext("2d")
    }
}

let controls = {
    up : false,
    left : false,
    down : false,
    right : false
}

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

wss.onopen = () => {

    wss.onmessage = function(message) {
        let data = JSON.parse(message.data)
        if (data["todo"]==="render-player") {
            drawCircle(data.player.x, data.player.y, data.player.r)
        }
    }

    addKeyListener(content.level.canvas).subscribe((e) => {
        addKey(controls.up, 'KeyW', (direction) => { controls.up = direction; });
        addKey(controls.left, 'KeyA', (direction) => { controls.left = direction; });
        addKey(controls.down, 'KeyS', (direction) => { controls.down = direction; });
        addKey(controls.right, 'KeyD', (direction) => { controls.right = direction; });

        wss.send(JSON.stringify(
            {'todo':'key-update',
            "dy-axis":(controls.down-controls.up),
            "dx-axis":(controls.right-controls.left)}))
    })

    function addKey(direction,code, callback) {
        addKeyListener(content.level.canvas).subscribe((e) => {
            if (e.code === code) {
                callback(direction = e.type!=='keycontrols.up')
            }
        })
    }
}