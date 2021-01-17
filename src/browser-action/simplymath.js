window.addEventListener('load', () => {
  const mathQuill = MathQuill.getInterface(2);
  const mathQuillSpan = document.getElementById('mathquill-span');
  const latexSpan = document.getElementById('latex-span');
  const pngImage = document.getElementById('png-image');
  const mathField = mathQuill.MathField(mathQuillSpan, {
    handlers: {
      edit: async () => {
        const enteredMath = mathField.latex();
        latexSpan.textContent = enteredMath;
        try {
          const dataUrl = await domtoimage.toPng(mathQuillSpan);
          pngImage.src = dataUrl;
        } catch (error) {
          console.error("An error occured while converting the equation to a PNG: " + e);
        }
      }
    }
  });
});
