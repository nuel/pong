/* global io, pong, ball, paddle1, paddle2 */
/**
 * Socket connection
 */
var socket = io()
var stacks = {
  connected: false,
  glow: function (lamp) {
    if (this.connected) socket.emit('glow', { lamp })
  }
}

socket.on('connect', function () {
  stacks.connected = true
  stacks.glow(0)
  stacks.glow(1)
})

socket.on('disconnect', function () {
  stacks.connected = false
})

/**
 * Pong game
 */
pong.onmousemove = function (event) {
  if (!pong.paused) paddle2.setAttribute('x', event.pageX - pong.getBoundingClientRect().left - 50)
}

pong.init = function () {
  pong.computerScore = 0
  pong.playerScore = 0
  pong.stageWidth = pong.width.baseVal.value
  pong.stageHeight = pong.height.baseVal.value
  ball.reset()
}

pong.update = function () {
  if (!pong.paused) {
    // Walls
    if (ball.x + ball.speedX >= pong.stageWidth || ball.x + ball.speedX <= 0) ball.speedX *= -1

    // Computer scores a point
    if (ball.y + ball.speedY >= pong.stageHeight + 10) {
      pong.computerScore++
      ball.reset()
    }

    // Player scores a point
    if (ball.y + ball.speedY <= -10) {
      pong.playerScore++
      ball.reset()
    }

    // Computer catches ball
    if (
        ball.y >= parseInt(paddle1.getAttribute('y'), 10) &&
        ball.y <= parseInt(paddle1.getAttribute('y'), 10) + 15 &&
        ball.x >= parseInt(paddle1.getAttribute('x'), 10) - 5 &&
        ball.x <= parseInt(paddle1.getAttribute('x'), 10) + 105
      ) {
      // Horizontal speed changes proportional to how far off-center the ball hit
      ball.speedX = (ball.x - (parseInt(paddle1.getAttribute('x'), 10) + 50)) / 15
      ball.speedY *= -1
      // Make the upper lamp glow
      stacks.glow(0)
    }

    // Player catches ball
    if (
        ball.y >= parseInt(paddle2.getAttribute('y'), 10) &&
        ball.y <= parseInt(paddle2.getAttribute('y'), 10) + 5 &&
        ball.x >= parseInt(paddle2.getAttribute('x'), 10) - 5 &&
        ball.x <= parseInt(paddle2.getAttribute('x'), 10) + 105
      ) {
      // Horizontal speed changes proportional to how far off-center the ball hit
      ball.speedX = (ball.x - (parseInt(paddle2.getAttribute('x'), 10) + 50)) / 15
      ball.speedY *= -1
      // Make the lower lamp glow
      stacks.glow(1)
    }

    ball.x += ball.speedX
    ball.y += ball.speedY
    ball.setAttribute('cx', ball.x)
    ball.setAttribute('cy', ball.y)

    var ballX = ball.x
    setTimeout(function () {
      paddle1.setAttribute('x', ballX - 50)
    }, 200)
  }
}

pong.toggle = function () {
  pong.paused = !pong.paused
}

ball.reset = function () {
  document.getElementById('computerScore').innerHTML = pong.computerScore
  document.getElementById('playerScore').innerHTML = pong.playerScore
  stacks.glow(0)
  stacks.glow(1)
  setTimeout(function () {
    stacks.glow(0)
    stacks.glow(1)
  }, 400)
  ball.speedX = 0
  ball.speedY = 0
  ball.x = 195
  ball.y = 295
  setTimeout(function () {
    ball.speedY = 3
  }, 800)
}

/**
 * Initialize game
 */
document.addEventListener('DOMContentLoaded', function () {
  pong.init()
  window.setInterval(pong.update, 10)
})
document.addEventListener('keyup', function (event) {
  if (event.which === 27 || event.keyCode === 27) pong.toggle()
})
