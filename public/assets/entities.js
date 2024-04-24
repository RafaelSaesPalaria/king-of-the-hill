module.exports = class Player {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r

        this.dx = 0
        this.dy = 0
    }

    move(dx, dy) {
        this.dx+= dx*0.03
        this.dy+= dy*0.03
    }

    update() {
        this.y+=this.dy*3
        this.x+=this.dx*3
    }
}