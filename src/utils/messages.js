//this func is for generating time stamp in chat room
const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime()
  };
};


// this function is for generating timestamp for location
const generateLocationMessage = (url) => {
  return {
    url,
    createdAt: new Date().getTime()
  }
}




module.exports = {
  generateMessage,
  generateLocationMessage
}
