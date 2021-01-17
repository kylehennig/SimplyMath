chrome.commands.onCommand.addListener(command => {
  console.log('onCommand event received for message: ', command);
  window.open("https://www.google.com");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const writeImageToClipboard = (imageUrl, latex) => {
    // Based on https://gist.github.com/dvreed77/c37759991b0723eebef3647015495253
    const image = new Image();
    image.src = imageUrl;
    const altTextPrefix = '$latex$';
    image.alt = altTextPrefix + latex;
    document.body.appendChild(image);
    const r = document.createRange();
    r.setStartBefore(image);
    r.setEndAfter(image);
    r.selectNode(image);
    const selection = window.getSelection();
    selection.addRange(r);
    document.execCommand('copy');
    document.body.removeChild(image);
  }

  switch (request.message) {
    case 'copyImage':
      writeImageToClipboard(request.imageUrl, request.latex)
      sendResponse({ message: 'success' });
      break;
    default:
      sendResponse({ message: 'failure', description: `Unrecognized message type ${request.message}.` });
      break;
  }
});
