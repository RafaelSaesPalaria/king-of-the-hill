let ip = window.location.href.replace('http://','').split(':')[0]
let wss = new WebSocket('ws://'+ip+':'+socket_port)

import { moviment } from "./assets/controls.js"
import { drawCircle, checkCollision } from "./assets/utils.js"

var content = {
    level: {
        end_panel: document.querySelector('div#end-panel'),
        canvas : document.querySelector('canvas#level'),
        c : document.querySelector('canvas#level').getContext("2d")
    },
    entities: {
        players: []
    }
}

content.level.canvas.focus()

let lastUpdate = Date.now()
/**
 * @Called At the start of the page
 * @Do Update and redraw the positions of the players
 */
setInterval(updatePlayers,10)
function updatePlayers() {
    
    clearScreen()
    checkCollisions()
    redrawPlayers()
    
    lastUpdate = Date.now()
}

/**
 * @Called when the player update
 * @Do clear the canvas
 */
function clearScreen() {
    content.level.c.clearRect(
        0,0,
        content.level.canvas.width,
        content.level.canvas.height)
}

/**
 * @Called at the updatePlayers (every 10ms)
 * @Do see if the another player is colliding with this player and send a message to the server
 */
function checkCollisions() {
    content.entities.players.forEach(player => {
        if (checkCollision(content.entities.players[0], player)) {
            if (wss) {
                wss.send(JSON.stringify({'todo':'render'}))
            }
        }
    })
}

/**
 * @Called at the updatePlayers (every 10ms)
 * @Do Update the position of every player and redraw them
 */
function redrawPlayers() {
    content.entities.players.forEach(player => {

        //Player Update
        let ms = (Date.now() - lastUpdate)/10
            player.y+=player.dy*3*(ms)
            player.x+=player.dx*3*(ms)

        drawCircle(content.level.c ,player.x, player.y, player.r, player.color)
    });
}

wss.onopen = () => {

    wss.send(JSON.stringify({'todo':'render'}))

    wss.onmessage = function(message) {
        let data = JSON.parse(message.data)
        if (data["todo"]==="render-players") {

            data.me.color = "red"

            content.entities.players = []
            content.entities.players.push(data.me)
            content.entities.players.push(...data.players)

            lastUpdate = data.timestamp 
            updatePlayers()
            lastUpdate = Date.now()

        
        } else if (data["todo"]==="die") {
            console.log('Death')
            content.level.end_panel.style.display = 'block'
        }
    }
    moviment(content.level.canvas,wss)
}