window.addEventListener('load', () => {
  const writeImageToClipboard = async url => {
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
      document.execCommand('copy');
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

  let currentEditableElement = null;
  let currentIframe = null;

  const pasteImageFromClipboard = () => {
    if (currentEditableElement === null) {
      return;
    }
    if (currentIframe !== null) {
      const win = currentIframe.contentWindow;
      const range = win.document.createRange();
      range.setStart(win.document.body, 0);
      range.setEnd(win.document.body, 0);
      win.document.body.focus();
      win.getSelection().addRange(range);
      win.document.execCommand('paste');
    } else {
      currentEditableElement.focus();
      document.execCommand('paste');
    }
  }

  window.addEventListener('focusin', () => {
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'IFRAME') {
      const editableElement = activeElement.contentWindow.document.querySelector('div[contenteditable="true"]');
      if (editableElement === undefined || editableElement === null) {
        return;
      }
      currentEditableElement = editableElement;
      currentIframe = activeElement;
    } else {
      currentEditableElement = activeElement;
      currentIframe = null;
    }
  });

  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.message === 'insertImage') {
      await writeImageToClipboard(request.imageUrl);
      pasteImageFromClipboard();
    }
  });
});
