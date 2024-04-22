const ejs = require('ejs')
const express =  require('express')
const app = express()
const ws = require('ws')

// WebSocket

let wss = new ws.Server({port:3008})

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