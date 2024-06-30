const fs = require('fs')
let server_data = fs.readFileSync('server/server_config.json','utf-8')
server_data = JSON.parse(server_data)

let ws = require('./web_socket')
ws.setData(server_data)
ws.load()

require('./express')