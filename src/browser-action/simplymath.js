window.addEventListener('load', () => {
  const mathQuill = MathQuill.getInterface(2);
  const mathQuillSpan = document.getElementById('mathquill-span');
  const mathField = mathQuill.MathField(mathQuillSpan, {
    handlers: {
      edit: function () {
        const enteredMath = mathField.latex();
        console.log(enteredMath);
      }
    }
  });
});
