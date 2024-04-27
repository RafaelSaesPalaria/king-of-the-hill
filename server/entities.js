module.exports = class Player {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r

        this.dx = 0
        this.dy = 0
    }

    /**
     * @Called When someone moves
     * @Do The the direction of the moviment
     * @param {Number} dx 
     * @param {Number} dy 
     */
    move(dx, dy) {
        this.dx+= dx*0.03
        this.dy+= dy*0.03
    }

    /**
     * @Called -----------------------------
     * @Do Change the position
     */
    update(ms) {
        this.y+=this.dy*3*ms
        this.x+=this.dx*3*ms
    }
}