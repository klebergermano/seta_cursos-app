function ImportHtml(pathHtmlFile, target){
    fetch(`${pathHtmlFile}`)
    .then((res)=>res.text())
    .then((html)=> document.querySelector(target).innerHTML = html);
}

module.exports = ImportHtml;