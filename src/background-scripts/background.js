chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
  window.open("https://www.google.com");
});