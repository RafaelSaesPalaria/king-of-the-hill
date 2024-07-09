module.exports = class Player {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r

        this.dx = 0
        this.dy = 0
        this.m = 1    /* Mass */
        this.f = 0.03 /* Friction */
    }

    /**
     * @Called When someone moves
     * @Do The the direction of the moviment
     * @param {Number} dx 
     * @param {Number} dy 
     */
    changeDir(dx, dy) {
        this.dx+= dx*this.f
        this.dy+= dy*this.f
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
     * @Called At every gametick (10ms) when the client check collisions
     * @Do Return if they are colliding
     * @param {Player} a Another player 
     */
    checkCollision(a) {
        return (this.distance(this.x,this.y,a.x,a.y) - (this.r + a.r)<0)
    }

    /**
     * @Called When a player collide
     * @Do Calculate the collision rotation
     * @param {Number} x position/velocity of the circle in the x axis
     * @param {Number} y position/velocity of the circle in the y axis
     * @param {Number} angle angle of collision
     * @returns rotated velocities
     */
   rotate(x, y, angle) {
        let rotatedVelocities = {
            x:x * Math.cos(angle) -y * Math.sin(angle),
            y:y * Math.sin(angle) -y * Math.cos(angle)
        }
        return rotatedVelocities
    }

    /**
     * @called when the server detect a collision
     * @do change the directions of the balls
     * @param {Player} a Another player 
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

    /**
     * @Called When the server update the players
     * @Do Change the position
     * @param {Number} ms milliseconds
     */
    update(ms) {
        this.y+=this.dy*3*ms
        this.x+=this.dx*3*ms
    }
}