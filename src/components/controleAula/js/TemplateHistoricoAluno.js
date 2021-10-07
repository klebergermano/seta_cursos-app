const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const document = new JSDOM('...').window.document;

function getReverseObjectKeys(obj) {
    let objKeys = Object.keys(obj);
    let sortedObjKeys = objKeys.sort();
   // sortedObjKeys.reverse();
    return sortedObjKeys;
  }

  function createTable(aluno, bimestresKeys, index){
    let bgTables = document.createElement('div');

    let tableAulas = document.createElement('table');
    tableAulas.className = 'table_aulas';
    tableAulas.setAttribute('border', '1');
    tableAulas.innerHTML = "<thead></thead><tbody></tbody>";
    let thAulas = `<th colspan="4">${bimestresKeys[index]} </th>`;
    tableAulas.querySelector('thead').innerHTML= thAulas;

    let bimestreContent = aluno.bimestres[bimestresKeys[index]];
    let aulasKeys = getReverseObjectKeys(bimestreContent);
    let rowReposicaoAula = document.createElement('tr');

    let tableReposicao = document.createElement('table');
    tableReposicao.className='table_reposicao';
    tableReposicao.setAttribute('border', '1');
    tableReposicao.innerHTML = "<thead></thead><tbody></tbody>";
    let thRepo = `<th colspan="4">${bimestresKeys[index]} - Reposições</th>`;
    tableReposicao.querySelector('thead').innerHTML= thRepo;

    let tdPontoExtra = document.createElement('td');
tdPontoExtra.style.opacity = '0';
        let tr = document.createElement('tr');
        let count = 1;
        let countRepo = 1;
        let countAulas = 0;
        let aulaRepoExiste = false;  
        for(let k = 0; k < aulasKeys.length; k++){
            let aula = bimestreContent[aulasKeys[k]];
            let td = document.createElement('td'); 
            td.className = 'aula_'+aula.status;

            if(aulasKeys[k].includes('aula') && !aulasKeys[k].includes('reposição')){
                countAulas ++; 
               // td.className = 'aula_'+aula?.status; 
               td.innerHTML = 
               `<span>
                ${aulasKeys[k]} - ${aula.status}
                </span>
                <p>
                    ${aula.tema}
                </p>
                <p>
                ${aula.data} - ${aula.horario}
                </p>
                <p>

                ${aula.detalhes}
                </p>
                `;
                tr.appendChild(td);
                if(count === 4){
                    tableAulas.querySelector('tbody').appendChild(tr);
                tr = document.createElement('tr');
                count = 1;
                }else{
                    count ++;
                }
            }else if(aulasKeys[k].includes('feedback')){
                    let rowFeedback =  document.createElement('tr');
                    let tdFeedback = document.createElement('td');
                    tdFeedback.className="Desempenho geral: "
                    tdFeedback.setAttribute('colspan', '4');
                    tdFeedback.innerHTML = `Feedback: ${aula.observacao}`;
                    rowFeedback.appendChild(tdFeedback)
                    tableAulas.querySelector('tbody').insertAdjacentElement('afterbegin', rowFeedback);
            }else if(aulasKeys[k].includes('reposição')){
                aulaRepoExiste = true; 
                    let tdRepoAula = document.createElement('td');
                    tdRepoAula.className="aula_reposicao"
                    tdRepoAula.innerHTML = 
                    `<span>
                    ${aulasKeys[k]}
                    </span>
                    <p>${aula.data} - ${aula.horario}</p>

                    <p>${aula.detalhes}</p>
                    `
                   // rowReposicaoAula.appendChild(tdRepoAula);
                    rowReposicaoAula.insertAdjacentElement('afterbegin', tdRepoAula);
                    if(countRepo === 4){
                        tableReposicao.querySelector('tbody').appendChild(rowReposicaoAula);
                        rowReposicaoAula = document.createElement('tr');
                        countRepo = 1;
                    }else{
                        countRepo ++;
                    }
            }else if(aulasKeys[k].includes('ponto')){
                aulaRepoExiste = true; 
                tdPontoExtra.style.opacity = '1';
                tableReposicao.querySelector('thead').innerHTML = `<th colspan='4'>${bimestresKeys[index]} - Reposições e Pontos Extras </th>`
                    let spanPonto = document.createElement('span');
                     spanPonto.className = 'ponto_extra'; 
                     spanPonto.innerHTML = `
                    <span>+ 1 Ponto Extra - ${aula.data} </span>
                    <p>
                    ${aula.descricao}
                    </p>
                    `;
                    tdPontoExtra.appendChild(spanPonto);
    
            }
        }
       let aulasPendentes = 16 - countAulas;
       let aulaNumero = countAulas;

       for(let i = 0; i < aulasPendentes; i++){
        aulaNumero ++; 
        let td = document.createElement('td');
        td.className='aula_pendente'
        td.innerHTML = "Aula Pendente " + aulaNumero;
        tr.appendChild(td)
        if(count === 4){
            tableAulas.querySelector('tbody').appendChild(tr);
            tr = document.createElement('tr');
            count = 1;
        }else{
            count ++;
        }
       }
       
       if(aulaRepoExiste){tableReposicao.style.display='block'}else{
        tableReposicao.style.display='none'
       }
       
       tableReposicao.querySelector('tbody').appendChild(rowReposicaoAula);
       tableReposicao.querySelector('tbody').lastChild.appendChild(tdPontoExtra);

      bgTables.appendChild(tableAulas);
      bgTables.appendChild(tableReposicao);
        return bgTables;
}

function createContentAulaHTML(aluno){

    let bgPages = document.createElement('div');
    bgPages.className = "bg_pages";

    let bimestresKeys = getReverseObjectKeys(aluno.bimestres);
    for(let index = 0; index < bimestresKeys.length; index++){
        let pages = document.createElement('div');
        pages.className="pages page_content";
        let table = createTable(aluno, bimestresKeys, index)
        //Adiciona "table" em "pages"
        pages.appendChild(table);
        //Adiciona "pages" em "bgPages"
        bgPages.appendChild(pages);
    }
        console.log('-------------------------------------------------'); 
        console.log('-------------------------------------------------'); 
      //  console.log('bgPages:', bgPages.innerHTML); 
        console.log('-------------------------------------------------'); 
        console.log('-------------------------------------------------'); 


    return bgPages; 
}


function TemplateHistoricoAluno(aluno) {
    let contentPages = createContentAulaHTML(aluno);

    let templateHistorico = `
    <!DOCTYPE html>
    <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Template Aluno</title>
            <style>
                * {box-sizing: border-box;
                    margin: 0;
                    padding: 0; }
                body {
                    background: #333;
                    font-size: 14px;
                    line-height: 14px;
                    font-family: Arial, Helvetica, sans-serif;
                }
                #bg_logo {
                    width: 300px;
                    height: auto;
                    overflow: hidden;
                    margin: 20px auto 0;
                }
                #logo {
                    width: 100%;
                    max-height: 200px;
                    margin: 0;
                }
                .pages {
                    position: relative;
                    width: 21cm;
                    min-height: 29.6cm;
                    background: #ccc;
                    padding: 30px;
                    margin: 0 auto;
                    background: #fff;
                }
                .page_cover {
                    background: #ffe;
                    overflow: hidden;
                    padding:40px;
                }
                h1 {
                    margin-top: 20px;
                    font-size: 36px;
                    text-align: center;
                    padding-top: 40px;
                    padding-bottom: 40px;
                }
                h2 {
                    font-size: 18px;
                }
                .aluno_info span {
                    font-weight: bold;
                }
                h3 {
                    font-size: 15px;
                }
                table {
                    margin-top:20px;
                    min-height:auto;
                    width:100%;
                    border-spacing: 5px;
                    border-radius: 5px; 
                }
                .table_aulas{
                min-height:18cm
                }
               
                table, td, th {
                  border-style: solid solid solid solid;
                  border-color:#999;
                    
                }
                .table_reposicao{}
           
                td span {
                    font-weight: bold;
                    text-align: center;
                    width: 100%;
                    padding: 6px 0;
                    display: block;
                }
         
                th {
                    text-transform: uppercase;
                    font-size:18px;
                    border: 0;
                    padding: 5px;
                    padding-top:10px;
                }
                td {
                    height:auto;
                    font-size: 11px;
                    width: 25%;
                    min-width: 25%;
                    vertical-align: top;
                    padding: 5px;
                }
                td p{
                    padding:3px 0px;
                    border-bottom:1px solid #ddd;
                }
                .feedback{
                    height:auto;
                    min-height:200px;
                }
                .aula_reposicao{
                    background:#F6E0F7;
                }
                .aula_pendente{
                    vertical-align: middle;
                    text-align:center;
                    background:#dff0ef;
                }
                .ponto_extra{background:#dfd;}
                .aula_prova {
                    background: #d5e6fc;
                }
                .aula_concluida {
                   // border-color: #4269d4;
                }
                .aula_concluida span {
                    background: rgb(66, 105, 212);
                    color: #fff;
                }
                .aula_falta {
                   // border-color: #fa5656;
                    background: #fee;
    
                }
                .aula_falta span {
                    background: #ff6c84;
                    color: #fff;
                }
                .aula_remarcada {
                 // border-color: #ccc;
                    background: #f0f0f0;
    
                }
                .aula_remarcada span {
                    background: #ccc;
                    color: #444;
                }
                .aluno_info {
                    margin-top: 40px;
                    line-height: 50px;
                    font-size: 18px;
                    border-radius: 5px;
                    overflow: hidden;
                }
                .aluno_info p{ 
                    border-bottom:1px solid #ccc; 
                    padding: 20px 20px 0px 20px !important;
                    }
                .aluno_info span{ text-transform: uppercase; }
                .cursos_info {
                    left:0px;
                    width:100%;
                    position: absolute;
                    bottom: 0px;
                    font-weight: bold;
                    text-align: center;
                    padding: 0px 0px 80px 0px;
                    border-radius: 5px;
                    line-height: 40px;
                    font-size: 18px;
                }
                .seta_info {
                    font-size: 18px;
                    line-height: 32px;
                    margin-top: 80px;
                }
                .seta_info svg{ margin-bottom:-3px; margin-right:5px;}
            </style>
            <script src='./scirpt.js' defer></script>
        </head>
        <body>
            <div class='pages page_cover'>
                <div id='bg_logo'>
                    <svg id="logo" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 583.68 230.4">
                        <defs>
                            <style>.cls-1 {fill: transparent; } .cls-2 { fill: #0a4e87;}
                                .cls-3 { fill: #ec1860; } .cls-4 { fill: #0c0c0c; } .cls-5 { fill: transparent; }
                                .cls-6 { fill: transparent; } .cls-7 {fill: #555; } .cls-8 { fill: #fff;}
                            </style>
                        </defs>
                        <title>Logo Atual - 2600x900px</title><path class="cls-1" d="M959.72,655.38q-145.31,0-290.62,0c-.9,0-1.1-.2-1.1-1.1q0-114.1,0-228.2c0-.9.2-1.1,1.1-1.1q290.74,0,581.48,0c.9,0,1.1.2,1.1,1.1q0,114.11,0,228.2c0,.9-.2,1.1-1.1,1.1Q1105.16,655.37,959.72,655.38Z" transform="translate(-668 -425)"/><path class="cls-2" d="M887.27,536.48q0,44.82,0,89.64c0,7.77-5,13.58-12.61,14.75a14.33,14.33,0,0,1-2.27.12c-9,0-17.91,0-26.86,0-1.13,0-1.45-.22-1.45-1.4q.06-80.48,0-160.94a13.8,13.8,0,0,0,0-1.44,2.33,2.33,0,0,0-2.22-2.12c-.4,0-.8,0-1.2,0q-80.53,0-161.06,0c-1.25,0-1.55-.31-1.54-1.55,0-8.9,0-17.81,0-26.72,0-8.66,6.22-14.89,14.87-14.89H872.38c8.66,0,14.89,6.22,14.89,14.86Q887.29,491.66,887.27,536.48Z" transform="translate(-668 -425)"/><path class="cls-3" d="M678.1,615.14v-1.5q0-52.18,0-104.37c0-1.19.21-1.58,1.51-1.58q52.77.06,105.53,0h1.65Z" transform="translate(-668 -425)"/><path class="cls-3" d="M811.47,534.55V536q0,51.76,0,103.54c0,1.11-.19,1.46-1.4,1.46q-52.41-.06-104.82,0H703.8Z" transform="translate(-668 -425)"/><path class="cls-2" d="M1003.87,491.25V436.73c0-2.51.6-3.11,3.1-3.11h58.89c1,0,2.07,0,3.11,0a2.35,2.35,0,0,1,2.52,2.46q0,8.08,0,16.17a2.36,2.36,0,0,1-2.65,2.45c-3.19,0-6.39,0-9.59,0-11,0-22,0-33,0-1,0-1.28.18-1.28,1.22q.08,11.15,0,22.29c0,1,.29,1.23,1.26,1.23q21,0,42,0c2.55,0,3.27.73,3.27,3.28q0,7.42,0,14.86c0,2.12-.84,2.95-3,2.95q-21.11,0-42.21,0c-1.09,0-1.3.3-1.29,1.32q.06,12.46,0,24.93c0,1,.17,1.32,1.27,1.32q21.06-.06,42.1,0c2.57,0,3.13.58,3.13,3.19q0,7.42,0,14.86c0,2.22-.64,2.87-2.84,2.87h-61.89c-2.25,0-2.9-.66-2.9-2.94Z" transform="translate(-668 -425)"/><path class="cls-4" d="M1065.75,625.42a156.29,156.29,0,0,1,27-22.94,19.73,19.73,0,0,1,6.61-3.26,1.88,1.88,0,0,1,1.68.31,14.24,14.24,0,0,1,3.7,3.88,1.19,1.19,0,0,1-.25,1.75,89.27,89.27,0,0,0-10.84,12,33,33,0,0,0-3.82,6.6,11.33,11.33,0,0,0,4.11-1,47.09,47.09,0,0,0,11.22-6.8.94.94,0,0,0,.46-.77,9.59,9.59,0,0,1,2.68-6c4.14-4.84,9.56-7.74,15.44-9.89a32.88,32.88,0,0,1,8.27-1.82,3.79,3.79,0,0,1,4.11,2.22,11.16,11.16,0,0,1,1.17,5.79,2.23,2.23,0,0,1-.53,1.3,24.39,24.39,0,0,1-7.67,6.58,4.8,4.8,0,0,1-.89.34c-.37.11-.83.44-1.09,0s.31-.56.53-.78a56.1,56.1,0,0,0,6.18-7.16,5.73,5.73,0,0,0,1.08-2.13,6.2,6.2,0,0,0-3.33.52,52.17,52.17,0,0,0-17.93,11.22l-.08.09c-3.07,3.2-3,4.61.45,7.38a1,1,0,0,0,1.35.15,115.6,115.6,0,0,1,22.47-9.65,3.49,3.49,0,0,0,1.27-.86c6.68-6,14.23-10.5,23.07-12.56a22.78,22.78,0,0,1,10.45-.4,6.7,6.7,0,0,1,3.12,1.57c-.17.31-.38.22-.56.19-4.47-.85-8.54.42-12.45,2.41a48.18,48.18,0,0,0-12.74,9.83,70.18,70.18,0,0,0-13.56,19.31,15.16,15.16,0,0,0-1.61,5.47c-.12,2.1.66,2.86,2.77,2.7a9.22,9.22,0,0,0,3.79-1.37,42.41,42.41,0,0,0,8.86-7.09,119.57,119.57,0,0,0,14.32-17.2,1.77,1.77,0,0,0,.2-1.83c-1.54-4.31-1.39-4.76,2-7.72,2.25-2,3.71-1.69,5.39.78,2.06,3,4.71,4.95,8.58,4.68a2.15,2.15,0,0,0,1.86-1,19.26,19.26,0,0,1,4.87-4.91A38.78,38.78,0,0,1,1207,597.5a3.7,3.7,0,0,1,4.32,2.41,11.21,11.21,0,0,1,1.06,5.59,2.24,2.24,0,0,1-.48,1.2,23.38,23.38,0,0,1-8,6.75,4.3,4.3,0,0,1-.78.29c-.33.11-.74.36-1,0s.27-.51.47-.7a55.39,55.39,0,0,0,6.26-7.25,4.63,4.63,0,0,0,1-2.13,6.57,6.57,0,0,0-3.31.54,52.41,52.41,0,0,0-17.84,11.15,12.28,12.28,0,0,0-1.93,2.43,2.47,2.47,0,0,0,.27,3.19c.55.63,1.21,1.16,1.78,1.77s1,.58,1.75.18a116.6,116.6,0,0,1,21.46-9.3,70.86,70.86,0,0,1,9.62-2.41,2.41,2.41,0,0,1,.35-.07c.51,0,1.25-.28,1.39.29s-.67.63-1.08.77c-7.06,2.38-14.16,4.65-21,7.51a83.65,83.65,0,0,0-10.57,5.13,15.58,15.58,0,0,1,3.23,4,4.28,4.28,0,0,1,0,4.23,11.72,11.72,0,0,1-3,3.69,34.44,34.44,0,0,1-18.9,7.64,4.37,4.37,0,0,1-5-4.21,3.2,3.2,0,0,1,.82-2.18,21,21,0,0,1,4.63-4.49,83.26,83.26,0,0,1,14-8.64c.25-.12.48-.25.85-.45l-1.56-1.4a23.41,23.41,0,0,1-3.82-4,6.42,6.42,0,0,1-1.41-4.35c.07-.68-.1-.76-.76-.65a15.92,15.92,0,0,1-6.19,0c-.43-.1-.58,0-.68.36-2,7.75-7.18,13.33-13.07,18.31-5.72,4.83-12,8.68-19.39,10.52a13.49,13.49,0,0,1-6.53.3,9,9,0,0,1-6.79-9.46c.41-6.14,3-11.33,6.7-16.09.3-.38.58-.76.86-1.15,0-.05,0-.15,0-.43a115.48,115.48,0,0,0-19.1,8.34,23.54,23.54,0,0,1,2.78,3.26,4.85,4.85,0,0,1,0,5.9,12.76,12.76,0,0,1-2.46,2.77,34.4,34.4,0,0,1-19.12,7.7,4.39,4.39,0,0,1-4.81-4.26,3.6,3.6,0,0,1,1-2.37,28.22,28.22,0,0,1,6.43-5.71,85.83,85.83,0,0,1,12.91-7.6c-.53-.5-1-1-1.48-1.39-1.86-1.64-3.74-3.27-4.79-5.59-.39-.87-.68-.16-.92,0a71.53,71.53,0,0,1-7.63,5.79,26.22,26.22,0,0,1-8.3,3.86,4.39,4.39,0,0,1-4.3-1.13,4.18,4.18,0,0,0-.44-.4,5.22,5.22,0,0,1-1.57-6.71,42.62,42.62,0,0,1,5.23-9.06c-.22,0-.34,0-.42,0A89.54,89.54,0,0,0,1058,638.09a19.57,19.57,0,0,0-2.21,4.23,2.62,2.62,0,0,0-.3,1.85c.43,1-.22.86-.76.81a4.17,4.17,0,0,1-2.49-1.07c-2.17-2-3.85-4.73-2.24-8.32a116.62,116.62,0,0,1,6.63-12.56c.07-.12.15-.26,0-.35s-.19.05-.29.09c-4.61,4.59-9.2,9.21-14.2,13.39a49,49,0,0,1-8.57,6.1c-3.52,1.85-5.23,1.73-8.32-2a4.75,4.75,0,0,1-.87-4.61c1.88-6.64,5.27-12.54,9-18.24a3,3,0,0,0,.53-1.1c-.32.3-.64.6-.94.91-6.59,6.69-13,13.53-20.15,19.67a42.31,42.31,0,0,1-7.35,5.34c-1.94,1.06-3.86,1.57-5.79,0s-3.36-3.57-2.67-6.41a44.55,44.55,0,0,1,3-8c-.57-.09-.86.3-1.18.51a149.93,149.93,0,0,1-26.39,13.95c-5.86,2.29-11.82,4.15-18.2,4.22a25,25,0,0,1-9.06-1.43c-5.73-2.11-8.85-6.4-9-12.51-.21-6.43,1.9-12.23,4.94-17.75a80.43,80.43,0,0,1,16.12-20c11.25-10.45,23.84-18.83,38.29-24.22,6.36-2.38,12.89-4,19.77-3.5a15.93,15.93,0,0,1,4.77,1.05,8.24,8.24,0,0,1,4.94,11,20.67,20.67,0,0,1-5.17,7.55c-3.78,3.71-8,6.7-13.26,8a16.71,16.71,0,0,1-2.12.34,3.07,3.07,0,0,1-3-1.4,4.76,4.76,0,0,1,.14-6.14A7.65,7.65,0,0,1,1005,585c-.45.71-.92,1.41-1.35,2.14-.16.29-.47.65-.18,1s.61.08.92,0a29.39,29.39,0,0,0,13.32-6.14,14.79,14.79,0,0,0,3.81-4.11c2.08-3.47.9-6.77-2.93-8.12a18,18,0,0,0-9.12-.33c-8.58,1.44-16.21,5.23-23.44,9.84-13.51,8.62-25.19,19.22-34.3,32.49-3.33,4.86-6.08,10-7.25,15.88a15.71,15.71,0,0,0,0,6.89c.9,3.65,3.78,5.86,8.17,6.46,5.88.8,11.55-.3,17.12-2,11.49-3.48,22-9,32.24-15.22a3.53,3.53,0,0,0,1.11-1.38,111.06,111.06,0,0,1,13.67-18.73,45.87,45.87,0,0,1,3.6-3.51,2.41,2.41,0,0,1,2.66-.55,9.78,9.78,0,0,1,5.82,6.11c.24.7.35,1.24-.73.79a2.1,2.1,0,0,0-2.19.63,39.77,39.77,0,0,0-5.38,5.78,94.14,94.14,0,0,0-13,20,9.88,9.88,0,0,0-1.14,3.87,10.38,10.38,0,0,0,2.49-1.26,123.64,123.64,0,0,0,15-11.88c5.87-5.15,11-11.07,16.43-16.62,2.41-2.45,4.9-4.82,7.53-7a3.12,3.12,0,0,1,3.95-.37,9.91,9.91,0,0,1,4.87,5.81c.19.66.11,1-.65.62a1.77,1.77,0,0,0-1.7.27,9.31,9.31,0,0,0-2.38,2c-5.93,7-11.66,14.19-15.87,22.42a22.19,22.19,0,0,0-2.13,5.56,1.46,1.46,0,0,0,0,1,18.66,18.66,0,0,0,4.76-2.45,128.3,128.3,0,0,0,14.46-11.64c.8-.71,1.56-1.48,2.4-2.17,4.49-3.67,8-8.18,11.38-12.87a49.69,49.69,0,0,1,6.74-7.61c1.66-1.53,2.72-1.68,4.61-.46a9.36,9.36,0,0,1,4.65,6.44c-1.77-.83-2.85.18-3.9,1.14a55.39,55.39,0,0,0-7.15,8.37c-2.21,3-4.47,5.92-6.4,9.1-.07.11-.14.26,0,.35S1065.66,625.46,1065.75,625.42Z" transform="translate(-668 -425)"/><path class="cls-2" d="M1198.88,520.55c-5.07,0-10.15,0-15.22,0a1.24,1.24,0,0,0-1.44,1c-2.73,8.46-5.5,16.9-8.25,25.35-.54,1.65-1,2-2.76,2.05H1154.3c-2.4,0-3.12-1-2.36-3.26l14.92-44.32,22-65.29c.75-2.26,1-2.47,3.43-2.47h13.67c2,0,2.36.23,3,2.17l33.12,98.5q1.92,5.67,3.83,11.34c.72,2.17-.11,3.3-2.42,3.31H1226.8c-1.75,0-2.24-.37-2.78-2-2.73-8.38-5.47-16.75-8.15-25.15a1.52,1.52,0,0,0-1.76-1.25C1209,520.58,1204,520.55,1198.88,520.55Z" transform="translate(-668 -425)"/><path class="cls-2" d="M917.7,533.59c0-2.64,0-5.28,0-7.91,0-2.18,1.4-3,3.35-2.06a55.05,55.05,0,0,0,20.18,6c5.61.49,11.2.56,16.59-1.37,4.61-1.65,7.87-4.67,8.95-9.62a16.42,16.42,0,0,0,.09-6.55,9.13,9.13,0,0,0-4-5.74,24.75,24.75,0,0,0-8-3.47c-5.85-1.61-11.78-2.9-17.48-5-8.84-3.31-15.22-9.09-17.76-18.34a42.65,42.65,0,0,1,2-29.16c4.62-10.44,13-16.21,24.08-18.14,10.12-1.75,20-.18,29.67,2.73a66,66,0,0,1,6.93,2.66,2.71,2.71,0,0,1,1.8,2.79c0,5.31,0,10.62,0,15.94,0,2.4-1.31,3.23-3.51,2.23a65.42,65.42,0,0,0-13.69-4.66c-5.62-1.16-11.29-1.88-17-.82-4.77.89-8.75,3.1-9.86,8.2-1.66,7.55.33,12.55,7.33,15.72a33.64,33.64,0,0,0,5,1.71c5.27,1.46,10.59,2.7,15.75,4.55,6.59,2.36,12.27,5.93,16.06,12a31.93,31.93,0,0,1,4.45,14.87,44.22,44.22,0,0,1-2.32,19c-3.6,9.68-10.6,15.85-20.31,19a60.67,60.67,0,0,1-25.33,2.49c-6.59-.69-13-2-19-5.05-4.71-2.4-3.9-1.88-4-6.3C917.68,537.42,917.7,535.5,917.7,533.59Z" transform="translate(-668 -425)"/><path class="cls-2" d="M1128.62,501.15q0,22.41,0,44.83c0,2.52-.46,3-3,3h-14.88c-2.75,0-3.24-.5-3.24-3.31v-89.4c0-1.73,0-1.73-1.79-1.73h-25.9c-2.27,0-2.8-.53-2.8-2.84q0-7.67,0-15.34c0-2.13.57-2.71,2.69-2.71h76.64c2.2,0,2.75.55,2.75,2.77v15.34c0,2.27-.53,2.78-2.85,2.78-8.8,0-17.59,0-26.39,0-1,0-1.24.23-1.24,1.23C1128.64,470.87,1128.62,486,1128.62,501.15Z" transform="translate(-668 -425)"/><path class="cls-5" d="M1056.37,622.77a1.39,1.39,0,0,1,.87-.75,1.8,1.8,0,0,1-.6,1Z" transform="translate(-668 -425)"/><path class="cls-6" d="M1065.75,625.42a1.33,1.33,0,0,1-.86.8,1.67,1.67,0,0,1,.61-1.06Z" transform="translate(-668 -425)"/><path class="cls-1" d="M1112.8,626.38a4.21,4.21,0,0,1-1.19,2.48,21.23,21.23,0,0,1-4.29,3.62,48.73,48.73,0,0,1-11.8,5.93C1100.71,633.69,1106.63,630,1112.8,626.38Z" transform="translate(-668 -425)"/><path class="cls-1" d="M1170.58,638.41c5.23-4.71,11.13-8.39,17.23-12a3.52,3.52,0,0,1-1.16,2.48,24.52,24.52,0,0,1-5.71,4.53A44.76,44.76,0,0,1,1170.58,638.41Z" transform="translate(-668 -425)"/><path class="cls-7" d="M1035,615.17c0,.4-.15.67-.39.63s-.06-.26,0-.37S1034.8,615.3,1035,615.17Z" transform="translate(-668 -425)"/><path class="cls-8" d="M1208.6,499.59h-12c-2,0-3.92,0-5.87,0-1,0-1.31-.11-.93-1.2,3-8.79,5.71-17.66,8.33-26.56.28-1,.56-1.91.9-3.09C1202,479.18,1205.12,489.32,1208.6,499.59Z" transform="translate(-668 -425)"/></svg>
                </div>
            
                <h1>Histórico do Aluno
                </h1>
        
                <div class='aluno_info'>
                    <p class='nome'>Nome:
                        <span class='nome_value'>${aluno.nome}</span>
                    </p>
                    <p class='curso'>Curso:
                        <span class='curso_value'>${aluno.curso}</span>
                    </p>
                    <p>COD.: <span class='ra_value'>${aluno.RA}</span></p>
                </div>
                <div class='seta_info'>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-phone" viewBox="0 0 16 16">
                        <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                      </svg> (11) 96500-2529</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe2" viewBox="0 0 16 16">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
                      </svg> www.setacursos.com.br</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg> @setacursos</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                      </svg> @setacursos</p>
                    <p>Rua Gustavo Bacarisas, 8, Jd. Novo Horizonte
                    </p>
                    <p>CEP: 04856-382 - São Paulo - SP
                    </p>
    
                </div>
                <div class='cursos_info'>
                    <p>Conheça nossos cursos</p>
                    <p> <span style="color:#0051ff">Informática</span> - 
                        <span style="color:#ff0062">Inglês</span> - 
                        <span style="color:#2a8532">Excel Avançado</span>  - 
                        <span style="color:#345e8d"> Desenvolvimento Web</span> - 
                        <span style="color:#f78317">Banco de Dados</span>
                    </p>
                </div>
    
            </div>
            <!--page_cover-->
            <!-------------------------------------------------------------------------------------->
            <!----------------------------------------PAGE------------------------------------------>
            <!-------------------------------------------------------------------------------------->
        ${contentPages.innerHTML}
      
    
        </body>
    </html>
    
    
    `
    
    
      return templateHistorico;
    };

module.exports = TemplateHistoricoAluno;
