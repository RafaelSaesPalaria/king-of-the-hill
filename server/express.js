const ejs = require('ejs')
const express =  require('express')
const app = express()
const fs = require('fs')

let server_data = fs.readFileSync('server/server_config.json','utf-8')
server_data = JSON.parse(server_data)
module.exports = server_data

app.set('view engine','ejs')
app.use(express.static('./public'))
app.listen(server_data.server_port,() => {
    console.log('Listening in the port',server_data.server_port)
    console.log('http://localhost:'+server_data.server_port)
})

// Middleware

app.get('/', (req, res) => {
    res.render('./index.ejs',{data: {server_data}})
})

app.use((req, res) => {
    res.status(404).render('./index.ejs',{data: {server_data}})
})