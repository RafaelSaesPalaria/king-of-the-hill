const http = require('http')
const ejs = require('ejs')
const express =  require('express')
const app = express()

http.createServer({port:'3000'}, () => {
    console.log('Server Opened')
})

app.set('view engine','ejs')
app.use(express.static('./public'))
app.listen('3000',() => {
    console.log('Listening in the port 3000')
})

// Middleware

app.get('/', (req, res) => {
    res.render('./index.ejs')
})

app.use((req, res) => {
    res.status(404).render('./index.ejs')
})