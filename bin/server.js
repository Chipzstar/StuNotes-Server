#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')
const path = require('path')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8080

const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'private_key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen({ host, port })

console.log(`running at '${host}' on port ${port}`)
