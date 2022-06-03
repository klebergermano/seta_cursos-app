
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, collection, getDocs } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { displaySpinnerLoad } from "../../jsCommon/spinnerJS.js";
import { insertAlunoContent, getSnapshotAlunoCursosDB } from "./inserAlunoContent.js";
import { insertFormAddAulaGrupoHTML } from "./formAddAulaGrupo.js";
//---------------------------------------------------------------//

//=========================================================================
//TODO: REFATORAR E ADICIONAR COMENTÁRIOS
//=========================================================================



async function insertOptionsInMainSelectAlunos() {
  let lastRA = getDocs(collection(db, "alunato"))
    .then((snap) => {
      let arrRAList = [];
      let selectAluno = `<option disabled selected>Selecione um aluno</option>`;
      snap.forEach((doc) => {
        arrRAList.push(doc.id);
        selectAluno += `<option  value='${doc.id}'>${doc.id} - ${doc.data().aluno.nome}</option>`;
      });
      document.querySelector("#main_select_aluno").innerHTML = selectAluno;
      return arrRAList;
    }).then((arrRAList) => {
      let lastRA = (arrRAList.sort())[arrRAList.length - 1];
      //setLastRAOptionSelected(lastRA)
      return lastRA;
    })
  return lastRA;
}



function alternarModoMainSelectAluno(){
let SVGInput = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-keyboard" viewBox="0 0 16 16">
  <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"/>
  <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"/>
</svg>
`
let SVGSelect = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg>

`

let btnAlterTipoSelecao = document.querySelector('#btn_alter_tipo_selecao');

  semAlunoControleAulaContent()
  let mainSelectAluno = document.querySelector('#main_select_aluno');
  let mainSelectAlunoDatalist = document.querySelector('#main_select_aluno_datalist');
  mainSelectAluno.classList.toggle('hide');

  if(mainSelectAluno.classList.contains('hide')){
    //Modo input
    btnAlterTipoSelecao.innerHTML  = SVGInput;
    mainSelectAlunoDatalist.classList.remove('hide');
    resetMainSelectAluno()
  }else{
    //Modo select
    btnAlterTipoSelecao.innerHTML  = SVGSelect;
    mainSelectAlunoDatalist.classList.add('hide');
    resetMainSelectAlunoDatalist();
  }
}

function resetMainSelectAluno(){
  document.querySelector('#main_select_aluno').selectedIndex = 0;
}
function resetMainSelectAlunoDatalist(){
  document.querySelector('#main_select_aluno_datalist').value = '';
  
}
async function createOptionsDatalistSelectAluno() {
  let lastRA = getDocs(collection(db, "alunato"))
    .then((snap) => {
      let arrRAList = [];
      let optionsDatalist = ``;
      snap.forEach((doc) => {
        arrRAList.push(doc.id);
        optionsDatalist += `<option  data-ra='${doc.id}' value='${doc.id}-${doc.data().aluno.nome}'/>`;
      });
      insertOptionsDatalistInSelectAluno(optionsDatalist)
      return arrRAList;

    }).then((arrRAList) => {
      let lastRA = (arrRAList.sort())[arrRAList.length - 1];
      setLastRAOptionSelected(lastRA)
      return lastRA;
    })
  return lastRA;
}


function insertOptionsDatalistInSelectAluno(optionsDatalist){
  document.querySelector("#datalist_mais_select_aluno").innerHTML = optionsDatalist;
}

function setLastRAOptionSelected(lastRA) {
  let mainsSelectOption = document.querySelectorAll("#main_select_aluno option");
  let options = Array.from(mainsSelectOption);
  options.forEach((item) => {
    if (item.value === lastRA) {
      item.setAttribute('selected', true);
    }
  });
}

function setAlunoInvalido(){
  document.querySelector('#main_select_aluno_datalist').setCustomValidity("Nome inválido");
  document.querySelector('#main_select_aluno_datalist').classList.add('input_invalido');
 
}
function setAlunoValido(){
  document.querySelector('#main_select_aluno_datalist').setCustomValidity("");
  document.querySelector('#main_select_aluno_datalist').classList.remove('input_invalido');
 
}


function validaMainSelectAluno(e) {
  let select_aluno = e.target;
  let datalist = document.querySelector('#datalist_mais_select_aluno');
  let datalistOpt = Array.from(datalist.options);
  let valorExisteNaLista = false;

  datalistOpt.forEach((option) => {
    if(select_aluno.value.trim() !== ''){
      if (select_aluno.value.trim() === option.value.trim()) {
        valorExisteNaLista = true;
      }
    }

  });
return valorExisteNaLista; 
}

export async function onload() {
  //displaySpinnerLoad("#page_content")
//------------------- Nova função ------------
  createOptionsDatalistSelectAluno()
  .then((RA)=>{

   semAlunoControleAulaContent();

  });

  document.querySelector('#main_select_aluno_datalist').addEventListener('input', (e) => {
    if(validaMainSelectAluno(e)){
      let aluno = e.target.value;
      let arrValue = aluno.split('-');
      let RA = arrValue[0];
        getSnapshotAlunoCursosDB(RA, insertAlunoContent)
      setAlunoValido();

    }else{
      setAlunoInvalido();
      semAlunoControleAulaContent();
    }
  });
//--------------------------------------------
//Insere as options o main_select_aluno
  insertOptionsInMainSelectAlunos()
    .then((RA) => {
     semAlunoControleAulaContent();
      //getSnapshotAlunoCursosDB(RA, insertAlunoContent)
    });
//--------------------------------------------
  document.querySelector('#main_select_aluno').addEventListener('change', (e) => {
      let RA = e.target.value;
        getSnapshotAlunoCursosDB(RA, insertAlunoContent)
  });

  document.querySelector("#btn_add_aula_grupo").addEventListener('click', (e) => {
    insertFormAddAulaGrupoHTML();
  })

  document.querySelector('#btn_alter_tipo_selecao').addEventListener('click', (e)=>{
    alternarModoMainSelectAluno();
  });
}

function semAlunoControleAulaContent(){
  document.querySelector('#controle_aula_content').style.opacity='1';
  document.querySelector('#controle_aula_content').innerHTML = `
  <nav class="nav_cursos_aluno"></nav>
  <div class="bg_curso_vazio bg_curso"   style="display: block; ">
  <div class="bg_info_curso_vazio">
      <h3 style='width:100%'>
      Nenhum aluno selecionado
    </h3> <br/>
    <img  style='max-width:100%; opacity:0.5; max-height:200px; margin:0 auto;' src='https://cdn-icons-png.flaticon.com/512/32/32527.png' />
      </div>
</div>
  `;
}