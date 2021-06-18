//Funções Globais
const ImportHtml = require("./modules/#common/ImportHtml.js");
const ImportHtmlUsingNav = require("./modules/#common/ImportHtmlUsingNav.js");


//Load Homepage
ImportHtml("./components/home/index.html", "#app");

//Carrega navegação do menu
ImportHtmlUsingNav("#nav_header", "#app");

/*
//Firerbase
db.collection('aluno_historico').onSnapshot((snap)=>{

    let changes = snap.docChanges();
    changes.forEach((item)=>{
       if(item.doc.id === "RA01") {

        console.log(item);
       
    }
    });
   
});


*/