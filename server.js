'use strict'

/** Express
 *  Set up webserver
 */
const express = require('express')
const app = express()
const server = require('http').createServer(app)

const io = require('socket.io').listen(server)
server.listen(process.env.PORT || 3000)

app.use('/', express.static(__dirname + '/static'))

/** Arduino
 *  Initialize state variables and connection
 */
let stacks = {
  serialPort: '/dev/cu.usbmodem1411',
  connected: false,
  performingGlow: [false, false],
  upperLamp: 9,
  lowerLamp: 6
}
const board = new (require('firmata')).Board(stacks.serialPort, function () {
  stacks.connected = true
  board.pinMode(stacks.upperLamp, board.MODES.PWM)
  board.pinMode(stacks.lowerLamp, board.MODES.PWM)
})

/**
 *  Handle incoming connections
 */
io.on('connection', function (socket) {
  console.log('Client connected')

  socket.on('pwm', function (data) {
    if (data.value > 100) data.value = 100
    if (data.value < 0) data.value = 0

    let selectedLamp = data.lamp === 0 ? stacks.upperLamp : stacks.lowerLamp

    if (stacks.connected) {
      board.analogWrite(selectedLamp, 255 * (data.value / 100))
    }
  })

  socket.on('glow', function (data) {
    if (stacks.connected) {
      let stepCount = 1
      let selectedLamp = data.lamp === 0 ? stacks.upperLamp : stacks.lowerLamp
      if (!stacks.performingGlow[data.lamp]) {
        // Block more requests so we don't let the lamp flicker
        stacks.performingGlow[data.lamp] = true
        let glow = setInterval(function () {
          // Quadratic function for glowing
          let intensity = -1 * Math.pow(stepCount - Math.sqrt(255), 2) + 255
          if (intensity > 0) {
            board.analogWrite(selectedLamp, intensity)
            stepCount++
          } else {
            stacks.performingGlow[data.lamp] = false
            board.analogWrite(selectedLamp, 0)
            clearInterval(glow)
          }
        }, 10)
      }
    }
  })

  socket.on('disconnect', function () {
    if (stacks.connected) {
      board.analogWrite(stacks.upperLamp, 0)
      board.analogWrite(stacks.lowerLamp, 0)
    }
  })
})
