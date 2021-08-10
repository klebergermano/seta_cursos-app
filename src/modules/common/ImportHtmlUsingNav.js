//Dependecies
const ImportHtml = require("./ImportHtml");
//Importa o index.html de cada component dentro do folder "components".
//usa pra isso o atributo 'data-path' como nome de cada component.
//'data-path' pode ser usado em qualquer elemento filho de um menu.
async function ImportHtmlUsingNav(navName, target) {
  let childs = document.querySelector(navName).querySelectorAll("[data-path]");
  childs.forEach((item) => {
    item.addEventListener("click", (e) => {
      function ImportHtml2(pathHtmlFile, target, scriptSRC = false) {
        let element = document.querySelector(target);
        fetch(`${pathHtmlFile}`)
          .then((res) => res.text())
          .then((html) => (element.innerHTML = html))
          .then(() => {
            if (scriptSRC) {
              let script = document.createElement("script");
              script.src = scriptSRC;
              script.setAttribute('type', 'module')
              element.appendChild(script);
            }
          });
      }
      
      ImportHtml2(
        `./components/${e.target.dataset.path}/index.html`,
        target,
        `./modules/${e.target.dataset.script_src}/index.js`
      );
    });
  });
}

module.exports = ImportHtmlUsingNav;
