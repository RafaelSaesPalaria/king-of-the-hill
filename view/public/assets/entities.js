import { addKeyListener } from "./controls.js"

export class Player {
    constructor(c, x, y, r) {
        this.c = c
        this.x = x
        this.y = y
        this.r = r
        this.f = 0.01

        this.dx = 0
        this.dy = 0

        this.up = false
        this.left= false
        this.down=false
        this.right=false

        this.addKey(this.up, 'KeyW', (direction) => { this.up = direction; });
        this.addKey(this.left, 'KeyA', (direction) => { this.left = direction; });
        this.addKey(this.down, 'KeyS', (direction) => { this.down = direction; });
        this.addKey(this.right, 'KeyD', (direction) => { this.right = direction; });

    }

    addKey(direction,code, callback) {
        addKeyListener(this.c.canvas).subscribe((e) => {
            if (e.code === code) {
                callback(direction = e.type!=='keyup')
            }
        })
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

        this.dy += (this.down - this.up)*this.f
        this.dx += (this.right - this.left)*this.f

        this.y+=this.dy
        this.x+=this.dx
        this.draw(c)
    }
}