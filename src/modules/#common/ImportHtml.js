function ImportHtml(pathHtmlFile, target, scriptSRC = false){
    let element = document.querySelector(target);
    fetch(`${pathHtmlFile}`)
    .then((res)=>res.text())
    .then((html)=> element.innerHTML = html)
    .then(()=>{
        if(scriptSRC){
            let script = document.createElement('script');
            script.src = scriptSRC; 
            element.appendChild(script);
        }
    });
}

module.exports = ImportHtml;