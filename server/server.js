const ejs = require('ejs')
const express =  require('express')
const app = express()
const ws = require('ws')

let server_data = {
    server_port: 3010,
    socket_port: 3008
}

let Player = require('./entities.js')

// WebSocket

let connections = []

let wss = new ws.Server(
    {port:server_data.socket_port})


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
            player.move(body["dx-axis"],body["dy-axis"])
        }
        sendPlayers()
    })

    /**
     * @Called When a connection is established
     * @Do set a listener in the stream to remove the stream when closed
     */
    con.stream.on('close', () => {
        connections = connections.filter(item => item.stream!==con.stream)
    })

    // Save Stream
    connections.push(con)
})

/**
 * @Called by itself
 * @Do Update is x,y based on its dx, dy
 */
setInterval(updatePlayers,10)
function updatePlayers() {
    connections.forEach(con => {
        con.player.update()
    })
}

/**
 * @Called When a player send a message to the server (player moves)
 * @Do Send the all players x,y,xd,yd to all connections 
 */
function sendPlayers() {
    let players = []
    connections.forEach(con => {
        players.push(con.player)
    })

    console.log(players)

    connections.forEach(con => {
        con.stream.send(JSON.stringify({
            "todo":"render-players",
            "players":players}))
    })
}

// Express

app.set('view engine','ejs')
app.use(express.static('./public'))
app.listen(server_data.server_port,() => {
    console.log('Listening in the port',server_data.server_port)
})

// Middleware

app.get('/', (req, res) => {
    res.render('./index.ejs',{data: {server_data}})
})

app.use((req, res) => {
    res.status(404).render('./index.ejs',{data: {server_data}})
})