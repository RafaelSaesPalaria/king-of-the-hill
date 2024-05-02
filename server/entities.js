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
    changeDir(dx, dy) {
        this.dx+= dx*0.03
        this.dy+= dy*0.03
    }

    distance(x,y,x2,y2) {
        let xDist = x2-x
        let yDist = y2-y

        return Math.sqrt(
            Math.pow(xDist,2) +
            Math.pow(yDist,2)
        )
    }

    /**
     * @param {*} a Another player 
     */
    checkCollision(a) {
        return (this.distance(this.x,this.y,a.x,a.y) - (this.r + a.r)<0)
    }

    /**
     * 
     * @param {*} a Another player 
     */
    collide(a) {
        this.dx = -this.dx
        this.dy = -this.dy

        a.dx = -a.dx
        a.dy = -a.dy
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