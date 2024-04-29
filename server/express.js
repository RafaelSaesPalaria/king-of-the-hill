const ejs = require('ejs')
const express =  require('express')
const app = express()

module.exports = server_data = {
    server_port: 3000,
    socket_port: 3009
}

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