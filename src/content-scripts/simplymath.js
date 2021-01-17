async function writeImageToClipboard(url) {
  try {
    // How to copy image to clipboard
    // https://gist.github.com/dvreed77/c37759991b0723eebef3647015495253
    //const image = new Image();
    //image.src = url;
    const image = document.createElement('p');
    image.innerHTML = 'hilo';
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

let currentEditableElement = null;
let currentIframe = null;

function pasteImageFromClipboard() {
  console.log("pasteImageFromClipboard")
  console.log(currentEditableElement);
  if (currentEditableElement === null) {
    return;
  }
  if (currentIframe !== null) {
    let win = currentIframe.contentWindow;
    let range = win.document.createRange();
    range.setStart(win.document.body, 0);
    range.setEnd(win.document.body, 0);
    win.document.body.focus();
    win.getSelection().addRange(range);
  }
  currentEditableElement.focus();
  document.execCommand("paste");
}

window.addEventListener('load', () => {
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log(request);
    if (request.message === 'insertImage') {
      await writeImageToClipboard(request.imageUrl);
      pasteImageFromClipboard();
    }
  });
});

window.addEventListener('focusin', () => {
  const activeElement = document.activeElement;
  console.log("activeElement:");
  console.log(activeElement);
  if (activeElement.tagName === "IFRAME") {
    console.log("iframe");
    const editableElement = activeElement.contentWindow.document.querySelector('div[contenteditable="true"]');
    if (editableElement === undefined || editableElement === null) {
      return;
    }
    console.log("editableElement:");
    console.log(editableElement);
    currentEditableElement = editableElement;
    currentIframe = activeElement;
  } else {
    currentEditableElement = activeElement;
    currentIframe = null;
  }
})
