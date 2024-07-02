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
        let xVelocityDiff = this.dx - a.dx
        let yVelocityDiff = this.dy - a.dy
    
        let xDist = a.x - this.x
        let yDist = a.y - this.y
    
        if (((xVelocityDiff * xDist) + (yVelocityDiff * yDist)) >0) {
            //Grab the angle between the two colliding thiss
            let angle = -Math.atan2(a.y - this.y, a.x - this.x)
    
            let m1= this.m
            let m2= a.m
    
            let u1 = this.rotate(this.dx, this.dy,angle)
            let u2 = this.rotate(a.dx, a.dy,angle)
    

            let v1 = {x: (m1-m2)*u1.x/(m1+m2) + (2*m2*u2.x)/(m1+m2),y:u1.y}
            let v2 = {x: (m1-m2)*u2.x/(m1+m2) + (2*m2*u1.x)/(m1+m2),y:u2.y}
    
            let vfinal1 = this.rotate(v1.x, v1.y, -angle)
            let vfinal2 = this.rotate(v2.x, v2.y, -angle)
    
            this.dx = vfinal1.x
            this.dy = vfinal1.y
    
            a.dx = vfinal2.x
            a.dy = vfinal2.y

        }
    }

    isOutOfBorders() {
        return (
            (this.x + this.r > 1366|| this.x + this.r < 0) ||
            (this.y + this.r > 645  || this.y + this.r < 0))
    }

    /**
     * @Called -----------------------------
     * @Do Change the position
     */
    update(ms) {
        this.y+=this.dy*3*ms
        this.x+=this.dx*3*ms

        if (this.isOutOfBorders()) {
            console.log(this+'is out of borders')
        }

    }
}