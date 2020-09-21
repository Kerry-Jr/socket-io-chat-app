const socket = io();
const $inputField = document.querySelector("#sender-text");
const $submitBtn = document.querySelector("#submitBtn");
const $messageForm = document.querySelector("#message-form");
const $sendLocationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

// Templates

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//options ------
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// server (emits the event) --> client (receive) --acknowledgement --> server
// client (emits the event) --> server (receive) --acknowledgement --> client

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("LTS"),
    // createdAt: message.createdAt,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("LTS"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

//this event is for room-data to display in the sidebar ( all the users in the room as they come and go and then the room name at the top of the side bar)

socket.on('roomData', ({room, users}) => {
 const html = Mustache.render(sidebarTemplate, {
   room,
   users
 })
 
 $sidebar.innerHTML = html
  // console.log(room)
  // console.log(users)
})




$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $submitBtn.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    $submitBtn.removeAttribute("disabled");
    $inputField.value = "";
    $inputField.focus();
    //above code enables button by removing attribute so it's enabled, input field is cleared and focus is maintained for fast message

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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
