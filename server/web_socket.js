const ws = require('ws')

let server_data = undefined

/**
 * @Called by the server init
 * @Do Set the data of the server config into the code
 * @param {*} data 
 */
function setData(data) {
    server_data = data
}

/**
 * @Called by the server init
 * @Do Load the websocket to hold the server
 */
function load() {

    let Player = require('../public/assets/entities.js')

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
            Math.floor(50+(Math.random()*(server_data.canvas_width-100))),
            Math.floor(50+(Math.random()*(server_data.canvas_height-100))),
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

    /**
     * @Called when the server receive a message from one of the players
     * @Do check the collision of all the players, or if they are out of the map and then update their positions
     */
    function updatePlayers() {
        let ms = Date.now() - lastUpdate

        let playersC = Object.assign([],players)

        playersC.forEach(pi => {
            playersC.forEach(pe => {
                if (pi!==pe) {
                    if (pi.checkCollision(pe)) {
                        pi.collide(pe)
                        console.log(pi+' is colliding with '+pe)
                    }
                }
            })
            playersC.shift()
        })

        connections.forEach(con => {
            if (isOutOfBorders(con.player)) {
                con.stream.send(JSON.stringify({
                    "todo":"die",
                    "timestamp":Date.now(),
                }))
            }
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

    /**
     * @called at every gametick
     * @do check if the player is out of border
     * @param {Player} player the player that will be checked
     * @returns if the player is out of border 
     */
    function isOutOfBorders(player) {
        return (
            (player.x + player.r > server_data.canvas_width|| player.x + player.r < 0) ||
            (player.y + player.r > server_data.canvas_height  || player.y + player.r < 0))
    }
}


module.exports = {load, setData}