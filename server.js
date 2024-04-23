const ejs = require('ejs')
const express =  require('express')
const app = express()
const ws = require('ws')

let Player = require('./public/assets/entities.js')
// WebSocket

let connections = []

let wss = new ws.Server({port:3007})

wss.on('connection', (stream) => {
    let player = (new Player(
        Math.floor(Math.random()*500),
        Math.floor(Math.random()*500),
         20))

    stream.on('message', (message) => {
        let body = message.toString()
        console.log(body)
        if (body["todo"]==="key-update") {
            player.move(body["dx-axis"],body["dy-axis"])
            console.log(player)
        }
    })

    connections.push({
        "stream":stream,
        "player":player})
})

setInterval(updatePlayers,100)
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
app.listen('3009',() => {
    console.log('Listening in the port 3009')
})

// Middleware

app.get('/', (req, res) => {
    res.render('./index.ejs')
})

app.use((req, res) => {
    res.status(404).render('./index.ejs')
})