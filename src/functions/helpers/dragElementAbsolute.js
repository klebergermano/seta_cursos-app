
// Move o elemento em "position:absolute" quando esse é arrastado, o evento é inserido no elemento com a 
// classe ".window_bar" caso não haja uma o próprio elemento se torna arrastável.
export default function dragElementAbsolute(element) {
    let prevX = 0;
    let prevY = 0;
    let window_bar = element.querySelector(".window_bar");
    if (window_bar) {
      window_bar.addEventListener("mousedown", mousedown);
    } else {
      element.addEventListener("mousedown", mousedown);
    }
  
    function mousedown(e) {
      prevX = e.clientX;
      prevY = e.clientY;
      document.addEventListener("mousemove", mousemove);
    }
  
    document.addEventListener("mouseup", mouseup);
  
    function mousemove(e) {
      let posX = prevX - e.clientX;
      let posY = prevY - e.clientY;
  
      prevX = e.clientX;
      prevY = e.clientY;
  
      element.style.left = element.offsetLeft - posX + "px";
      element.style.top = element.offsetTop - posY + "px";

      // Seta o valor default de margin_left e margin_right, evitando problemas de margem caso esses estejam setados.
      element.style.marginLeft = 0;
      element.style.marginRight = 0;
    }
    // Cancela o evento mouse move.
    function mouseup(e) {
      document.removeEventListener("mousemove", mousemove, false);
    }
  }
  