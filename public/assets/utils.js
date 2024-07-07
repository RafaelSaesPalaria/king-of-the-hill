/**
 * 
 * @param {CanvasRenderingContext2D} c 
 * @param {*} x 
 * @param {*} y 
 * @param {*} r 
 */
export function drawCircle(c,x,y,r,color="blue") {
    c.beginPath()
    c.arc(x,y,r,0,Math.PI*2,false)
    c.fillStyle = `${color}`
    c.fill()
    c.stroke()
    c.closePath()
}

/**
 * @Called by the check collision of the client
 * @Do Return the 2d distance between the players center
 * @param {Number} x position on the x-axis of the players 1
 * @param {Number} y position on the y-axis of the players 1
 * @param {Number} x2 position on the x-axis of the players 2
 * @param {Number} y2 position on the y-axis of the players 2
 * @returns the 2d distance between the players center
 */
export function distance(x,y,x2,y2) {
    let xDist = x2-x
    let yDist = y2-y

    return Math.sqrt(
        Math.pow(xDist,2) +
        Math.pow(yDist,2)
    )
}    

export function checkCollision(p1,p2) {
    if (p1!==p2) {
        return (distance(p1.x,p1.y,p2.x,p2.y) -
                 (p1.r + p2.r)<0)
    }
    return false
}