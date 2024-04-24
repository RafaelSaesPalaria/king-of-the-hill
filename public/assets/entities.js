module.exports = class Player {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.f = 0.03

        this.dx = 0
        this.dy = 0
    }

    move(dx, dy) {
        this.dx+= dx*this.f
        this.dy+= dy*this.f
    }

    update() {
        this.y+=this.dy*3
        this.x+=this.dx*3
    }
}