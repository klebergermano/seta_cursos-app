
export default function importHTMLWithScript(target, htmlSRC, scriptSRC, callback) {
    let element = document.querySelector(target);
    fetch(htmlSRC)
      .then((res) => res.text())
      .then((html) => {
        element.innerHTML = html;
        import(scriptSRC)
          .then((module) => {
            module.onload();
          });
      }).then(() => {
        if (callback) callback();
      })
  }
  