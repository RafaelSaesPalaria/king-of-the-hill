import { Player } from "./entities.js"
import { animate, resize } from "./screen.js"

var content = {
    level: {
        canvas : document.querySelector('canvas#level'),
        c : document.querySelector('canvas#level').getContext("2d")
    },
    entities: {
        players: [],
        platforms: []
    },
    settings: {
        fps: 24
    }
}

// SCREEN
resize(content.level.canvas)
window.addEventListener("resize",resize)

setInterval(() => {
    let entities = 
        [...content.entities.platforms,...content.entities.players]
    animate(entities, content.level.c)

},1000/content.entities.fps)

content.entities.players.push(new Player(content.level.c, 100, 100, 20))