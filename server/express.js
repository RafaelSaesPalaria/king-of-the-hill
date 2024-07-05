const express =  require('express')
const app = express()

let server_data = undefined


function setData(data) {
    server_data = data
}

/**
 * @Called by the server init
 * @Do Load the websocket to hold the server
 */
function load() {
    app.set('view engine','ejs')
    app.use(express.static('./public'))
    app.listen(server_data.server_port,() => {
        console.log('Listening in the port',server_data.server_port)
        console.log('http://localhost:'+server_data.server_port)
    })

    // Middleware

    app.get('/', (req, res) => {
        res.render('../public/views/index.ejs',{data: {server_data}})
    })

    app.use((req, res) => {
        res.status(404).render('../public/views/index.ejs',{data: {server_data}})
    })
}

module.exports = {load, setData}