/**
 * 
 * @param {HTMLCanvasElement} canvas
 */
export function addKeyListener(canvas) {
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

// SUBSCRIBE ^ USE CALLBACK AS FUNCTION AND KEY AS PARAMETER