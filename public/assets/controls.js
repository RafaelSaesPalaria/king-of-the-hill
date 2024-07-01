let controls = {
    up : false,
    left : false,
    down : false,
    right : false
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
function addKeyListener(canvas) {
    let observers = []
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
    addKey(controls.up, 'KeyW', (direction) => { controls.up = direction; });
    addKey(controls.left, 'KeyA', (direction) => { controls.left = direction; });
    addKey(controls.down, 'KeyS', (direction) => { controls.down = direction; });
    addKey(controls.right, 'KeyD', (direction) => { controls.right = direction; });

    function addKey(direction,code, callback) {
        addKeyListener(canvas).subscribe((e) => {
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

// SUBSCRIBE ^ USE CALLBACK AS FUNCTION AND KEY AS PARAMETER