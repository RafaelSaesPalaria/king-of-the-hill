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

wss.onopen = () => {

    addKeyListener(content.level.canvas).subscribe((e) => {
        addKey(controls.up, 'KeyW', (direction) => { controls.up = direction; });
        addKey(controls.left, 'KeyA', (direction) => { controls.left = direction; });
        addKey(controls.down, 'KeyS', (direction) => { controls.down = direction; });
        addKey(controls.right, 'KeyD', (direction) => { controls.right = direction; });

        wss.send(JSON.stringify(
            {'todo':'key-controls.update',
            "y-axis":(controls.down-controls.up),
            "x-axis":(controls.right-controls.left)}))
    })

    function addKey(direction,code, callback) {
        addKeyListener(content.level.canvas).subscribe((e) => {
            if (e.code === code) {
                callback(direction = e.type!=='keycontrols.up')
            }
        })
    }
}