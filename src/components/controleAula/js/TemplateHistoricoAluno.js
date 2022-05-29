//Other libraries
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const document = new JSDOM('...').window.document;
//---------------------------------------------------------------//

function getReverseObjectKeys(obj) {
    let objKeys = Object.keys(obj);
    let sortedObjKeys = objKeys.sort();
    return sortedObjKeys;
}

function createTable(aluno, bimestresKeys, index) {
    let bgTables = document.createElement('div');
    let tableAulas = document.createElement('table');
    tableAulas.className = 'table_aulas';
    tableAulas.setAttribute('border', '1');
    tableAulas.innerHTML = "<thead></thead><tbody></tbody>";
    let thAulas = `<th colspan="4">${bimestresKeys[index]} </th>`;
    tableAulas.querySelector('thead').innerHTML = thAulas;

    let bimestreContent = aluno.bimestres[bimestresKeys[index]];
    let aulasKeys = getReverseObjectKeys(bimestreContent);
    let rowReposicaoAula = document.createElement('tr');

    let tableReposicao = document.createElement('table');
    tableReposicao.className = 'table_reposicao';
    tableReposicao.setAttribute('border', '1');
    tableReposicao.innerHTML = "<thead></thead><tbody></tbody>";
    let thRepo = `<th colspan="4">${bimestresKeys[index]} - Reposições</th>`;
    tableReposicao.querySelector('thead').innerHTML = thRepo;

    let tdPontoExtra = document.createElement('td');
    tdPontoExtra.style.opacity = '0';
    let tr = document.createElement('tr');
    let count = 1;
    let countRepo = 1;
    let countAulas = 0;
    let aulaRepoExiste = false;
    for (let k = 0; k < aulasKeys.length; k++) {
        let aula = bimestreContent[aulasKeys[k]];
        let td = document.createElement('td');
        td.className = 'aula_' + aula.status;

        if (aulasKeys[k].includes('aula') && !aulasKeys[k].includes('reposição')) {
            countAulas++;
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
            if (count === 4) {
                tableAulas.querySelector('tbody').appendChild(tr);
                tr = document.createElement('tr');
                count = 1;
            } else {
                count++;
            }
        } else if (aulasKeys[k].includes('feedback')) {
            let rowFeedback = document.createElement('tr');
            let tdFeedback = document.createElement('td');
            tdFeedback.className = "Desempenho geral: "
            tdFeedback.setAttribute('colspan', '4');
            tdFeedback.innerHTML = `Feedback: ${aula.observacao}`;
            rowFeedback.appendChild(tdFeedback)
            tableAulas.querySelector('tbody').insertAdjacentElement('afterbegin', rowFeedback);
        } else if (aulasKeys[k].includes('reposição')) {
            aulaRepoExiste = true;
            let tdRepoAula = document.createElement('td');
            tdRepoAula.className = "aula_reposicao"
            tdRepoAula.innerHTML =
                `<span>
                    ${aulasKeys[k]}
                    </span>
                    <p>${aula.data} - ${aula.horario}</p>

                    <p>${aula.detalhes}</p>
                    `
            // rowReposicaoAula.appendChild(tdRepoAula);
            rowReposicaoAula.insertAdjacentElement('afterbegin', tdRepoAula);
            if (countRepo === 4) {
                tableReposicao.querySelector('tbody').appendChild(rowReposicaoAula);
                rowReposicaoAula = document.createElement('tr');
                countRepo = 1;
            } else {
                countRepo++;
            }
        } else if (aulasKeys[k].includes('ponto')) {
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

    for (let i = 0; i < aulasPendentes; i++) {
        aulaNumero++;
        let td = document.createElement('td');
        td.className = 'aula_pendente'
        td.innerHTML = "Aula Pendente " + aulaNumero;
        tr.appendChild(td)
        if (count === 4) {
            tableAulas.querySelector('tbody').appendChild(tr);
            tr = document.createElement('tr');
            count = 1;
        } else {
            count++;
        }
    }

    if (aulaRepoExiste) { tableReposicao.style.display = 'block' } else {
        tableReposicao.style.display = 'none'
    }

    tableReposicao.querySelector('tbody').appendChild(rowReposicaoAula);
    tableReposicao.querySelector('tbody').lastChild.appendChild(tdPontoExtra);

    bgTables.appendChild(tableAulas);
    bgTables.appendChild(tableReposicao);
    return bgTables;
}

function createContentAulaHTML(aluno) {

    let bgPages = document.createElement('div');
    bgPages.className = "bg_pages";

    let bimestresKeys = getReverseObjectKeys(aluno.bimestres);
    for (let index = 0; index < bimestresKeys.length; index++) {
        let pages = document.createElement('div');
        pages.className = "pages page_content";
        let table = createTable(aluno, bimestresKeys, index)
        //Adiciona "table" em "pages"
        pages.appendChild(table);
        //Adiciona "pages" em "bgPages"
        bgPages.appendChild(pages);
    }



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
                    background: #ffe url('https://firebasestorage.googleapis.com/v0/b/app-seta-cursos.appspot.com/o/hist%C3%B3rico_aluno.jpg?alt=media&token=960436f1-7396-490a-9790-46557b5e2619');
                    background-size: 100% 100%;
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
                    table-layout: fixed;
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
                    max-width:200px !important;
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
                    margin-top: 240px;
                    line-height: 40px;
                    font-size: 18px;
                    border-radius: 5px;
                    overflow: hidden;
                }
                .aluno_info p{ 
                    border-bottom:1px solid #ccc; 
                    padding: 10px 20px !important;
                    }
                    .aluno_info p:last-child{ 
                        border-bottom:0px;
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
        
                <div class='aluno_info'>
                <p>COD.: <span class='ra_value'>${aluno.RA}</span></p>
                    <p class='nome'>Nome:
                        <span class='nome_value'>${((aluno.nome).substring((aluno.nome).indexOf("-") + 1)).trim()}</span>
                    </p>
                    <p class='curso'>Curso:
                        <span class='curso_value'>${aluno.curso}</span>
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
