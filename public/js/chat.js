const socket = io()

socket.on('message', (message) => {
  console.log(message)
})

const inputField = document.getElementById('#sender-text')
const submitBtn = document.getElementById('#submitBtn')
const form = document.getElementById('#message-form')

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const message = e.target.elements.message.value

  socket.emit('sendMessage', message)
  
})


