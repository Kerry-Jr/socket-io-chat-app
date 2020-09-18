const socket = io();

// server (emit's the event) --> client (receive) --acknowledgement --> server
// client (emit's the event) --> server (receive) --acknowledgement --> client

socket.on("message", (message) => {
  console.log(message);
});

const inputField = document.getElementById("#sender-text");
const submitBtn = document.getElementById("#submitBtn");
const form = document.querySelector("#message-form");
const sendLocationBtn = document.querySelector("#send-location");

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    
    if(error) {
      return console.log(error)
    }
    console.log('Message delivered!')
    
    // console.log('The message was sent!', message)
  });

  })





sendLocationBtn.addEventListener('click', () => {
  if(!navigator.geolocation){
    return alert("Geolocation is not supported by your browser.")
  }

  navigator.geolocation.getCurrentPosition((position) => {
   socket.emit("sendLocation", {
     latitude: position.coords.latitude,
     longitude: position.coords.longitude
   }, () => {
    console.log('Location shared!')
   })
  })
})
