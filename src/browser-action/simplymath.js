window.addEventListener('load', () => {
  /**
   * Configurable options.
   * TODO: Obtain from the options page.
   */
  const config = {
    scale: 4
  };

  const mathQuill = MathQuill.getInterface(2);
  const mathQuillInput = document.getElementById('mathquill-input');
  const latexOutput = document.getElementById('latex-output');
  const mathField = mathQuill.MathField(mathQuillInput, {
    handlers: {
      edit: () => {
        const enteredMath = mathField.latex();
        latexOutput.textContent = enteredMath;
      }
    }
  });

  const getImageAsDataUrl = async () => {
    try {
      const equationElement = mathQuillInput.querySelector('.mq-root-block');
      const dataUrl = await domtoimage.toPng(equationElement, {
        width: equationElement.offsetWidth * config.scale,
        height: equationElement.offsetHeight * config.scale,
        style: {
          'transform': `scale(${config.scale})`,
          'transform-origin': 'top left'
        }
      });
      return dataUrl;
    } catch (error) {
      console.error('An error occured while converting the equation to a PNG: ' + error);
      return null;
    }
  }

  const insertButton = document.getElementById('insert-button');
  insertButton.addEventListener('click', async () => {
    const dataUrl = await getImageAsDataUrl();
    if (dataUrl === null) {
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'insertImage', imageUrl: dataUrl }, response => {
        console.log(response);
      })
    });
  });

  const saveButton = document.getElementById('save-button');
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
