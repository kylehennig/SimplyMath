window.addEventListener('load', () => {
  const mathQuill = MathQuill.getInterface(2);
  const mathQuillInput = document.getElementById('mathquill-input');
  const latexOutput = document.getElementById('latex-output');
  const imageOutput = document.getElementById('image-output');
  const mathField = mathQuill.MathField(mathQuillInput, {
    handlers: {
      edit: async () => {
        const enteredMath = mathField.latex();
        latexOutput.textContent = enteredMath;
        try {
          const equationElement = mathQuillInput.querySelector('.mq-root-block');
          const cursorElement = equationElement.querySelector('.mq-cursor');
          cursorElement.style.visibility = 'hidden';
          const dataUrl = await domtoimage.toPng(equationElement);
          cursorElement.style.visibility = 'visible';
          imageOutput.src = dataUrl;
        } catch (error) {
          console.error("An error occured while converting the equation to a PNG: " + e);
        }

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { message: "Hello!" }, response => {
            console.log(response);
          })
        });
      }
    }
  });
});
