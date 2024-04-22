export function resize(canvas) {
    canvas.width = innerWidth
    canvas.height= innerHeight
}

/**
 * 
 * @param {*} entities 
 * @param {CanvasRenderingContext2D} c 
 */
export function animate(entities, c) {
    c.clearRect(0,0,c.canvas.width,c.canvas.height)
    entities.forEach(entity => {
        entity.update(c)
    })
}