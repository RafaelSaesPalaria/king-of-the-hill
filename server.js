const ejs = require('ejs')
const express =  require('express')
const app = express()
const ws = require('ws')

let server_data = {
    server_port: 3010,
    socket_port: 3008
}

let Player = require('./public/assets/entities.js')

// WebSocket

let connections = []

let wss = new ws.Server(
    {port:server_data.socket_port})

wss.on('connection', (stream) => {
    console.log('Someone has entered')
    
    let player = (new Player(
        Math.floor(Math.random()*500),
        Math.floor(Math.random()*500),
         20))

    stream.on('message', (message) => {
        let body = JSON.parse(message.toString())
        if (body["todo"]==="key-update") {
            player.move(body["dx-axis"],body["dy-axis"])
        }
    })

    connections.push({
        "stream":stream,
        "player":player})
})

setInterval(updatePlayers,10)
function updatePlayers() {
    let players = []
    connections.forEach(con => {
        con.player.update()
        players.push(con.player)
    })

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