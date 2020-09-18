const socket = io();

const $inputField = document.querySelector("#sender-text");
const $submitBtn = document.querySelector("#submitBtn");
const $messageForm = document.querySelector("#message-form");
const $sendLocationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates

const messageTemplate = document.querySelector("#message-template").innerHTML;











// server (emit's the event) --> client (receive) --acknowledgement --> server
// client (emit's the event) --> server (receive) --acknowledgement --> client

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $submitBtn.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    $submitBtn.removeAttribute("disabled");
    $inputField.value = "";
    $inputField.focus();
    //above code enables button by removing attribute from above so it's enabled, input field is cleared and focus is maintained for fast message

    if (error) {
      return console.log(error);
    }
    console.log("Message delivered!");

    // console.log('The message was sent!', message)
  });
});

$sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  $sendLocationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $sendLocationBtn.removeAttribute("disabled");
        console.log("Location shared!");
      }
    );
  });
});
