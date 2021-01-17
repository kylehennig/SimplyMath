// untested
function getElementCursorIsIn() {
  const selection = window.getSelection();
  if (selection === undefined || selection === null) {
    console.log("selection null");
    return null;
  }
  return selection.anchorNode;
}

async function writeClipImg(url) {
  try {
    // How to copy image to clipboard
    // https://gist.github.com/dvreed77/c37759991b0723eebef3647015495253
    const image = new Image();
    image.src = url;
    document.body.appendChild(image);
    const r = document.createRange();
    r.setStartBefore(image);
    r.setEndAfter(image);
    r.selectNode(image);
    const selection = window.getSelection();
    selection.addRange(r);
    document.execCommand("copy");
    console.log('Fetched image copied.');
  } catch(err) {
    console.error(err.name, err.message);
  }
}

window.addEventListener('load', () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.message === 'insertImage') {
      writeClipImg(request.imageUrl);
    }
  });
});
