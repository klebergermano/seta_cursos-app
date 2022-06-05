
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, collection, getDocs } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { insertAlunoContent, getSnapshotAlunoCursosDB } from "./inserAlunoContent.js";
import { insertFormAddAulaGrupoHTML } from "./formAddAulaGrupo.js";
//---------------------------------------------------------------//

<<<<<<< HEAD
//=========================================================================
//TODO: REFATORAR E ADICIONAR COMENTÁRIOS
//=========================================================================


// Busca os alunos em Alunato no BD
// cria a opções de select com o resultado
// e Insere as opções criadas no #main_selec_aluno. 
async function insertOptionsInMainSelectAlunos() {
  let lastRA = getDocs(collection(db, "alunato"))
=======
//Cria as opções do Select de aluno através das informações do BD em alunato.
async function createOptionsSelectAluno() {
  return getDocs(collection(db, "alunato"))
>>>>>>> cfcc742 (chore: refatoração)
    .then((snap) => {
      let options = `<option disabled selected>Selecione um aluno</option>`;
      snap.forEach((doc) => {
        options += `<option  value='${doc.id}'>${doc.id} - ${doc.data().aluno.nome}</option>`;
      });
      return options;
    })
}

//Insere as opções de select no select "#main_select_aluno".
function insertOptionsInMainSelectAluno(optionSelect) {
  document.querySelector("#main_select_aluno").innerHTML = optionSelect;
}

// Limpa os campos de seleção de aluno ao setar a opção do select "main_select_aluno" para primeira 
// opção e Limpar o valor do input "#main_select_aluno_datalist",
function resetFieldsInputSelectAlunoContent() {
  document.querySelector('#main_select_aluno').selectedIndex = 0;
  document.querySelector('#main_select_aluno_datalist').value = '';
}

// Cria as opções do datalist
async function createOptionsDatalistSelectAluno() {
  return getDocs(collection(db, "alunato"))
    .then((snap) => {
      let optionsDatalist = ``;
      snap.forEach((doc) => {
        optionsDatalist += `<option  value='${doc.id}-${doc.data().aluno.nome}'/>`;
      });
      return optionsDatalist;
    })
}
// Eventos utilizados para gerar e controlar o campo input "#main_select_aluno_datalist". 
function EventsMainInputDataListAluno() {
  // Select Aluno - Datalist 
  createOptionsDatalistSelectAluno()
    .then((optionsDatalist) => {
      insertOptionsDatalistInSelectAluno(optionsDatalist)
    });

  document.querySelector('#main_select_aluno_datalist').addEventListener('input', (e) => {
    // Confere se o valor do  campo "#main_select_aluno_datalist" esta no datalist.
    if (validaDatalistMainSelectAluno(e)) {
      let AlunoRANome = e.target.value;
      let arrayAluno = AlunoRANome.split('-');
      let RA = arrayAluno[0];

      // Pega os dados do curso do Aluno baseado no RA e insere o conteúdo através da função 
      // de callback "insertAlunoContent()".
      getSnapshotAlunoCursosDB(RA, insertAlunoContent)

      // Limpa os bloqueios de aluno inválido.
      setAlunoValido();
    } else {
      // Bloqueia o campo e seta as ações de aluno inválido.
      setAlunoInvalido();
      // Insere o conteúdo vazio sem aluno adicionado.
      insereConteudoVazioSemAlunoAdicionado();
    }
  });
}

// Eventos utilizados para gerar e controlar o campo select "#main_select_aluno". 
function EventsMainSelectAluno() {
  // Cria as options do "#main_select_aluno".
  createOptionsSelectAluno()
    .then((optionsSelectAluno) => {
  // Insere as options no "#main_select_aluno".
      insertOptionsInMainSelectAluno(optionsSelectAluno);
    })

  document.querySelector('#main_select_aluno').addEventListener('change', (e) => {
    let RA = e.target.value;
    // Insere o conteúdo do aluno através do RA.
    getSnapshotAlunoCursosDB(RA, insertAlunoContent)
  });
}

// Insere as opções do datalist no "#datalist_main_select_aluno".
function insertOptionsDatalistInSelectAluno(optionsDatalist) {
  document.querySelector("#datalist_main_select_aluno").innerHTML = optionsDatalist;
}

// Testa se o valor inserido no "e.target" existe no datalist "#datalist_main_select_aluno".
function validaDatalistMainSelectAluno(e) {
  let select_aluno = e.target;
  let datalist = document.querySelector('#datalist_main_select_aluno');
  let datalistOpt = Array.from(datalist.options);
  let valorExisteNaLista = false;

  datalistOpt.forEach((option) => {
    if (select_aluno.value.trim() !== '') {
      if (select_aluno.value.trim() === option.value.trim()) {
        valorExisteNaLista = true;
      }
    }
  });
  return valorExisteNaLista;
}

// Adiciona invalidação no input "#main_select_aluno_datalist" de aluno.
function setAlunoInvalido() {
  document.querySelector('#main_select_aluno_datalist').setCustomValidity("Nome inválido");
  document.querySelector('#main_select_aluno_datalist').classList.add('input_invalido');
}
// Remove invalidações do campo "#main_select_aluno_datalist".
function setAlunoValido() {
  document.querySelector('#main_select_aluno_datalist').setCustomValidity("");
  document.querySelector('#main_select_aluno_datalist').classList.remove('input_invalido');
}

// Conteúdo vázio usado quando não há aluno selecionado.
function insereConteudoVazioSemAlunoAdicionado() {
  document.querySelector('#controle_aula_content').style.opacity = '1';
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

// Cria um objeto com o ícones para se utilizar no botão de alternar inputs de inserção de aluno.
function iconsSVG() {
  let SVG = {};
  SVG.select =
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  </svg>`;
  SVG.input = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-keyboard" viewBox="0 0 16 16">
  <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"/>
  <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"/>
  </svg>`
  return SVG;

}

//Alterna entre dois tipos de campo "input com datalist" e "select" para selectionar um aluno.
function alternarInputSelectAlunoContent() {
  let icons = iconsSVG();
  let btnAlterTipoSelecao = document.querySelector('#btn_alter_tipo_selecao');
  let selectAlunoContent = document.querySelector('#main_select_aluno');
  let inputDatalistAlunoContent = document.querySelector('#main_select_aluno_datalist');

  //Insere e Remove a classe "hide" no "selectAlunoContent".
  selectAlunoContent.classList.toggle('hide');

  //Confere a existência da classe "hide" no selectAlunoContent para determinar se
  //o inputDatalistAlunoContent deve ficar visivel ou invisivel.
  if (selectAlunoContent.classList.contains('hide')) {
    //Remove a classe "hide" do  inputDatalistAlunoContent deixando ele visivel.
    inputDatalistAlunoContent.classList.remove('hide');
    //Seta o icone de input no btnAlterTipoSelecao.
    btnAlterTipoSelecao.innerHTML = icons.input;
  } else {
    //Adiciona a classe "hide" no inputDatalistAlunoContent deixando ele invisivel.
    inputDatalistAlunoContent.classList.add('hide');
    //Seta o icone de select no btnAlterTipoSelecao.
    btnAlterTipoSelecao.innerHTML = icons.select;

  }
  //Limpa os campos de select e input da seleção de aluno.
  resetFieldsInputSelectAlunoContent();
  //Limpa o conteúdo apresentado do aluno inserindo o conteúdo vázio. 
  insereConteudoVazioSemAlunoAdicionado()
}

// Função principal que carrega o componente
export async function onload() {
  //Insere o conteúdo vazio, utilizado quando não há aluno selecionado.
  insereConteudoVazioSemAlunoAdicionado()

  //Events
  EventsMainInputDataListAluno()

  EventsMainSelectAluno()

  document.querySelector("#btn_add_aula_grupo").addEventListener('click', (e) => {
    insertFormAddAulaGrupoHTML();
  })

  document.querySelector('#btn_alter_tipo_selecao').addEventListener('click', (e) => {
    alternarInputSelectAlunoContent();
  });
}
