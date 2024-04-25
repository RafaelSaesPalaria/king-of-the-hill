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
    
    // Receive message from client
    stream.on('message', (message) => {
        let body = JSON.parse(message.toString())
        if (body["todo"]==="key-update") {
            player.move(body["dx-axis"],body["dy-axis"])
        }
        sendPlayers()
    })

    // End Stream when close
    con.stream.on('close', () => {
        connections.splice(con)
    })

    // Save Stream
    connections.push(con)
})

setInterval(updatePlayers,10)
function updatePlayers() {
    connections.forEach(con => {
        con.player.update()
    })
}

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
    res.status(404).render('./index.ejs')
})