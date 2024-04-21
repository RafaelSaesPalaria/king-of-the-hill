export class Player {
    constructor(c, x, y, r) {
        this.c = c
        this.x = x
        this.y = y
        this.r = r
        this.f = 0.01

        this.dx = 0
        this.dy = 0



    }



    /**
     * @Called // @Do //
     * @param {CanvasRenderingContext2D} c 
     */
    draw(c) {
        c.beginPath()
        c.arc(this.x,this.y,this.r,0,Math.PI*2,true)
        c.fillStyle = "white"
        c.strokeStyle = "black"
        c.stroke()
        c.fill()
        c.closePath()
    }

    update(c) {



        this.y+=this.dy
        this.x+=this.dx
        this.draw(c)
    }
}