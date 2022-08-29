#!/usr/bin/env node

/**
 * @type {any}
 */
require('newrelic')
const WebSocket = require('ws')
const http = require('http')
const wss = new WebSocket.Server({ noServer: true })
const serverless = require('serverless-http');
const app = express();
const setupWSConnection = require('./utils.js').setupWSConnection

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234

const server = http.createServer((request, response) => {
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

server.on('request', (req, res) => {
  console.log('Pinging...')
  res.statusCode = 200
  res.end()
})

server.listen({ host, port })


console.log(`running at '${host}' on port ${port}`)

app.use("./netlify/functions/server")

module.exports.handler = serverless(app);
