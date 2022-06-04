export default function insertElementHTML(target, pathElementHTML, callback, event, cleanTargetElement = false) {
    let targetElement = document.querySelector(target);
    let insertedElement = fetch(pathElementHTML)
      .then((res) => res.text())
      .then((htmlString) => {
        return new DOMParser().parseFromString(htmlString, 'text/html').body.firstElementChild;
      })
      .then((htmlElement) => {
        if (cleanTargetElement) {
          targetElement.innerHTML = '';
        }
        targetElement.appendChild(htmlElement);
        return htmlElement;
      }).then((htmlElement) => {
        if (callback) callback(htmlElement, event);
        return htmlElement;
      })
      .catch((err) => console.log(err));
    return insertedElement;
  }


