window.addEventListener('load', () => {
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

  const insertButton = document.getElementById('insert-button');
  insertButton.addEventListener('click', async () => {
    try {
      const equationElement = mathQuillInput.querySelector('.mq-root-block');
      const dataUrl = await domtoimage.toPng(equationElement);
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'insertImage', imageUrl: dataUrl }, response => {
          console.log(response);
        })
      });
    } catch (error) {
      console.error('An error occured while converting the equation to a PNG: ' + error);
    }
  });
});
