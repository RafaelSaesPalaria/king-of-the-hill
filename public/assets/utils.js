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