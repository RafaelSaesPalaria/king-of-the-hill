module.exports = class Player {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.f = 0.01

        this.dx = 0
        this.dy = 0
    }

    move(dx, dy) {
        this.dx = dx
        this.dy= dy
    }

    update() {
        this.y+=this.dy
        this.x+=this.dx
    }
}