const defaultConfig = {
  'fontSize': 4,
  'maxDepth': 10,
  'spaceBehavesLikeTab': true,
  'restrictMismatchedBrackets': true,
  'sumStartsWithNEquals': true,
  'supSubsRequireOperand': true,
  'autoSubscriptNumerals': true,
}

window.addEventListener('load', () => {
  // set config
  let config = {};
  chrome.storage.sync.get(['config'], (result) => {
    if (Object.keys(result).length === 0) { // first time user opened options
      console.log("No Saved config found! Loading default")
      config = defaultConfig;
    } else { // load saved options
      console.log("Loading fetched config!");
      config = result.config;
    }
  });

  const mathQuill = MathQuill.getInterface(2);
  const mathQuillInput = document.getElementById('mathquill-input');
  const latexOutput = document.getElementById('latex-output');
  const mathField = mathQuill.MathField(mathQuillInput, {
    handlers: {
      edit: () => {
        latexOutput.textContent = mathField.latex();
      }
    }
  });

  const getImageAsDataUrl = async () => {
    try {
      const equationElement = mathQuillInput.querySelector('.mq-root-block');
      const dataUrl = await domtoimage.toPng(equationElement, {
        width: equationElement.offsetWidth * config.fontSize,
        height: equationElement.offsetHeight * config.fontSize,
        style: {
          'transform': `scale(${config.fontSize})`,
          'transform-origin': 'top left'
        }
      });
      return dataUrl;
    } catch (error) {
      console.error('An error occured while converting the equation to a PNG: ' + error);
      return null;
    }
  }

  const actionStatus = document.getElementById('action-status');
  const copyButton = document.getElementById('copy-button');
  copyButton.addEventListener('click', async () => {
    const dataUrl = await getImageAsDataUrl();
    if (dataUrl === null) {
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'copyImage',
        imageUrl: dataUrl,
        latex: mathField.latex()
      }, response => {
        switch (response.message) {
          case 'success':
            actionStatus.textContent = 'Copied successfully!';
            break;
          case 'failure':
            actionStatus.textContent = response.description;
            break;
          default:
            actionStatus.textContent = 'Unexpected communication error.';
            break;
        }
      })
    });
  });

  const insertButton = document.getElementById('insert-button');
  insertButton.addEventListener('click', async () => {
    const dataUrl = await getImageAsDataUrl();
    if (dataUrl === null) {
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'insertImage',
        imageUrl: dataUrl,
        latex: mathField.latex()
      }, response => {
        console.log(response);
      })
    });
  });

  const saveButton = document.getElementById('download-button');
  saveButton.addEventListener('click', async () => {
    const dataUrl = await getImageAsDataUrl();
    if (dataUrl === null) {
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = "equation.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  })
});
