class SimplyMathEditor {
  create = latex => {
    const div = document.createElement('div');
    div.innerHTML = `<div id="simplymath-editor" class="simplymath-modal">
  <div class="simplymath-modal-content">
    <p>${latex}</p>
    <button class="simplymath-close">Close</span>
    <button class="simplymath-save">Save</span>
  </div>
</div>`;
    div.querySelector('.simplymath-close').addEventListener('click', () => this.destroy())
    document.body.appendChild(div);
    this.element = div;
  }

  destroy = () => {
    document.body.removeChild(this.element);
  }
}
