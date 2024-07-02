let controls = {
    direction: {
        up : false,
        left : false,
        down : false,
        right : false
    },
    keys: {
        up: 'KeyW',
        left: 'KeyA',
        down: 'KeyS',
        right: 'KeyD'
    }
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
let observers = []
function addKeyListener(canvas) {
    
    canvas.addEventListener("keydown",notifyAll)
    canvas.addEventListener("keypress",notifyAll)
    canvas.addEventListener("keyup",notifyAll)

    function subscribe(func) {
        observers.push(func)
    }

    function notifyAll(event) {
        observers.forEach(observe => {
            observe(event)
        })
    }
    return {subscribe,notifyAll};
}

export function moviment(canvas,wss) {
    for (let dir in controls.direction) {
        addKey(controls.direction[dir], controls.keys[dir], (direction) => { controls.direction[dir] = direction; });
    }

    function addKey(direction, code, callback) {
        addKeyListener(canvas).subscribe((e) => {
            if (e.code === code) {
                callback(direction = e.type!=='keyup')
                if (wss.readyState === WebSocket.OPEN) {
                    wss.send(JSON.stringify(
                        {'todo':'key-update',
                        "dy-axis":(Number(controls.direction.down) - Number(controls.direction.up)),
                        "dx-axis":(Number(controls.direction.right) - Number(controls.direction.left))}))
                    }
            }
        })
    }
}

// SUBSCRIBE ^ USE CALLBACK AS FUNCTION AND KEY AS PARAMETER