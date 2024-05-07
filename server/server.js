const ws = require('ws')

let server_data = require('./express.js')

let Player = require('./entities.js')

// WebSocket

let connections = []
let players = []

let wss = new ws.Server(
    {port:server_data.socket_port})

let lastUpdate = Date.now()


wss.on('connection', (stream) => {
    console.log('Someone has entered')
    
    
    // Create Player
    let player = (new Player(
        Math.floor(50+(Math.random()*(1366-100))),
        Math.floor(50+(Math.random()*(645-100))),
        50))

    // Join Player and Stream
    let con = {
        "stream":stream,
        "player":player}

    /**
     * @Called When a connection is established
     * @Do set a listener to the stream to update the player moviment and update the other streams
     */
    stream.on('message', (message) => {
        let body = JSON.parse(message.toString())
        if (body["todo"]==="key-update") {
            con.player.changeDir(body["dx-axis"],body["dy-axis"])
        }

        updatePlayers()
        sendPlayers()
        lastUpdate = Date.now()
    })

    /**
     * @Called When a connection is established
     * @Do set a listener in the stream to remove the stream when closed
     */
    con.stream.on('close', () => {
        connections = connections.filter(item => item.stream!==con.stream)
        players = []
        connections.forEach(con => {
            players.push(con.player)
        })
    })

    // Save Stream
    connections.push(con)

    players = []
    connections.forEach(con => {
        players.push(con.player)
    })

})

function updatePlayers() {
    let ms = Date.now() - lastUpdate

    let playersC = Object.assign([],players)

    playersC.forEach(pi => {
        playersC.forEach(pe => {
            if (pi!==pe) {
                if (pi.checkCollision(pe)) {
                    pi.collide(pe)
                }
            }
        })
        playersC.shift()
    })

    connections.forEach(con => {
        con.player.update(ms/10)
    })
}

/**
 * @Called When a player send a message to the server (player changeDirs)
 * @Do Send the all players x,y,xd,yd to all connections 
 */
function sendPlayers() {
    connections.forEach(con => {
        con.stream.send(JSON.stringify({
            "todo":"render-players",
            "timestamp":Date.now(),
            "me":con.player,
            "players":players.filter(player => player!==con.player)}))
    })
}

