//---------------------------------------------------------------//
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc, getDocs, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { removeBugExtraBgFormBLockScreen} from "../../jsCommon/commonFunctions.js";
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//

export async function insertFormAddAulaGrupoHTML() {
  insertElementHTML('#controle_aula_content',
    './components/controleAula/formAddAulaGrupo.html', eventsFormAddAulaGrupo);
}

function addClassHoverDeleteDivAlunoAdicionado(){

}

function eventsFormAddAulaGrupo(form) {
  removeBugExtraBgFormBLockScreen()
  btnCloseForm("#form_add_aula_grupo");
  form.addEventListener("submit", (e) => {
    submitFormAddAulaGrupo(e);
  });

  eventClickBtnStatus(form)
  document.querySelector('#btn_add_aluno_grupo').addEventListener('click', (e) => {
    e.preventDefault();
    adicionaAluno()
  });



  createOptionsSelectAlunos().then((options) => {
    let alunoDatalist = document.querySelector('#alunos_datalist');
    alunoDatalist.innerHTML = options;
  });


  let divAluno = document.querySelector('.div_aluno_adicionado');
  eventsDivAlunoAdicinado(divAluno)



}

function setCursoSelect(e) {
  let RA = (e.target.value).split('-')[0];
  let divAluno = e.target.closest('.div_aluno_adicionado');
  let selectCurso = divAluno.querySelector('.select_curso');

  getDocs(collection(db, 'alunato', RA, 'cursos'))
    .then((res) => {
      let option = '<option disabled selected value="">Selecione o Curso</option>';
      res.forEach((item) => {
    
        option += `<option value='${item.data().curso_info.nome}'>${item.data().curso_info.nome}</option>`;
      })

      return option;

    }).then((res) => {
  
      selectCurso.innerHTML = res;
    })

}

function eventsDivAlunoAdicinado(divAluno) {
  console.log(divAluno);
  divAluno.querySelector('.btn_del_aluno')?.addEventListener('mouseover', (e)=>{
    divAluno.classList.add('hover_btn_del_aluno');
  });
  divAluno.querySelector('.btn_del_aluno')?.addEventListener('mouseout', (e)=>{
    divAluno.classList.remove('hover_btn_del_aluno');
  });

  divAluno.querySelector('.select_aluno_adicionado')?.addEventListener('input', (e) => {
    validaSelectAlunoAdicionado(e);
  });
  divAluno.querySelector('.select_curso')?.addEventListener('change', (e) => {
   
    enableSelectBimestre(e)
  })
  divAluno.querySelector('.select_bimestre')?.addEventListener('change', (e) => {

    validaSelectAula(e)
  })
}

function adicionaAluno() {
  let alunoHTML = document.querySelector('.div_aluno_adicionado');
  let bgAlunoAdicionado = document.querySelector("#bg_grupo_alunos");
  let divAluno = alunoHTML.cloneNode(true);
  divAluno.querySelector(".select_aluno_adicionado").value = '';
  divAluno.querySelector(".select_curso").setAttribute('disabled', true);
  divAluno.querySelector(".select_bimestre").setAttribute('disabled', true);
  divAluno.querySelector(".select_aula").setAttribute('disabled', true);

  let btnDel = document.createElement('button');
  btnDel.classList = 'btn_del_aluno'
  btnDel.innerHTML = " x ";
  btnDel.addEventListener('click', (e) => {
    e.preventDefault();
    btnDeleteAlunoAdicionado(e)
    validaSelectAlunoAdicionado();
  })
  divAluno.insertAdjacentElement('afterbegin', btnDel);
  bgAlunoAdicionado.appendChild(divAluno)

  eventsDivAlunoAdicinado(divAluno);


}

function enableSelectBimestre(e) {
  let divAluno = e.target.closest('.div_aluno_adicionado');
  divAluno.querySelector('.select_bimestre').removeAttribute('disabled');
}
function disableSelectBimestre(e) {
  let divAluno = e.target.closest('.div_aluno_adicionado');
  let selectBimestre = divAluno.querySelector('.select_bimestre')
  selectBimestre.setAttribute('disabled', true);
  selectBimestre.selectedIndex = 0;
}
function disableSelectAula(e) {
  let divAluno = e.target.closest('.div_aluno_adicionado');
  let selectBimestre = divAluno.querySelector('.select_aula')
  selectBimestre.setAttribute('disabled', true);
  selectBimestre.selectedIndex = 0;
}


function validaSelectAlunoAdicionado(e) {
  if(e){
    let divAluno = e.target.closest('.div_aluno_adicionado');
    let select_aluno = e.target;
    let datalist = document.querySelector('#bg_grupo_alunos #alunos_datalist');
    let datalistOpt = Array.from(datalist.options);
    let valorExisteNaLista = false;
  
    datalistOpt.forEach((option) => {
      if (select_aluno.value.trim() === option.value.trim()) {
        valorExisteNaLista = true;
      }
    });
    if (!valorExisteNaLista) {
      select_aluno.setCustomValidity("Nome inválido");
      select_aluno.classList.add('input_invalido');
      divAluno.querySelector('.select_curso').setAttribute('disabled', true)
      divAluno.querySelector('.select_curso').innerHTML = "<option selected disabled>Selecione o Curso</option>";
      disableSelectBimestre(e)
      disableSelectAula(e)
  
    } else {
      setCursoSelect(e)
      divAluno.querySelector('.select_curso').removeAttribute('disabled')
      select_aluno.setCustomValidity("");
      select_aluno.classList.remove('input_invalido');
    }
    removeOptionsSelectionadosDatalist()
  }
 
}

function removeOptionsSelectionadosDatalist() {
  let select_aluno = document.querySelectorAll('.select_aluno_adicionado');
  let datalist = document.querySelector('#bg_grupo_alunos #alunos_datalist');
  let datalistOpt = Array.from(datalist.options);
  datalistOpt.forEach((item) => {
    item.removeAttribute('disabled')
  });
  select_aluno.forEach((item) => {
    let RA = item.value.split('-')[0];
    let opt = datalist.querySelector(`[data-ra='${RA}']`);
    if (opt) {
      opt.setAttribute('disabled', true);
    }
  })
}



function validaSelectAula(e) {
  let divAluno = e.target.closest('.div_aluno_adicionado');
  let infoAula;
  infoAula = getInfoFormAddAula(divAluno);
  blockSelectOptionsAddAulas(divAluno, infoAula);
 
}

function getInfoFormAddAula(divAluno) {
  let infoAddAula = {};
  let selectAluno = divAluno.querySelector(".select_aluno_adicionado");
  let RA = (selectAluno.value).split('-')[0];
  let selectCurso = divAluno.querySelector(".select_curso");
  let curso = selectCurso.options[
    selectCurso.selectedIndex
  ].value;
  let selectBimestre = divAluno.querySelector(".select_bimestre");
  let bimestre = selectBimestre.options[
    selectBimestre.selectedIndex
  ].value;
  infoAddAula.RA = RA;
  infoAddAula.curso = curso;
  infoAddAula.bimestre = bimestre;
  return infoAddAula;
}
function blockSelectOptionsAddAulas(divAluno, infoAula) {
  let RA = infoAula.RA;
  let curso = infoAula.curso;
  let bimestre = infoAula.bimestre;
  //Bloqueia as options do select #aula_numero no formulário form_add_aula
  let select = divAluno.querySelector(".select_aula");
  select.removeAttribute('disabled')
  let aulasKeys = getKeysAulas(RA, curso, bimestre);

  aulasKeys.then((res) => {
    //if evita o primeira execução do código desnecessária caso o array seja vazio.
    if (res) {
      //options[i] são as options do select
      for (let i = 0; i <= select.options.length - 1; i++) {
        //remove o attributo disable setado anteriormente
        if (select.options[i].value !== "") {
          select.options[i].removeAttribute("disabled");
        }
        //res[j] são as aulas ja feitas
        for (let j = 0; j <= res.length; j++) {
          if (res[j] === select.options[i].value) {
            select.options[i].setAttribute("disabled", "true");
          }
        }
      }
    }
  });
}

function getKeysAulas(RA, idCurso, bimestre) {
  let keysAulas = [];
  let nomeCursoBD;
  let aluno = getDocs(collection(db, 'alunato', RA, 'cursos'));
  let keys = aluno.then((res) => {
    res.forEach((item) => {
      if (item.data().curso_info.nome === idCurso) {
        if (item.data().bimestres[bimestre]) {
          keysAulas = Object.keys(item.data().bimestres[bimestre]);
        }
      }
    });
  }).then(() => {
    return keysAulas;
  }).catch((err) => { console.log(err) });
  return keys;
}

//------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------


function submitFormAddAulaGrupo(e) {
  e.preventDefault();
  let form = e.target;
  let divAlunos = form.querySelectorAll('.div_aluno_adicionado');
  divAlunos.forEach((item) => {

    let RA = item.querySelector('.select_aluno_adicionado').value.split('-')[0];
    let curso = item.querySelector('.select_curso').value;
    let bimestre = item.querySelector('.select_bimestre').value;
    let aula = item.querySelector('.select_aula').value;
    form.RA = RA;
    form.bimestre = bimestre;
    form.aula = aula;
    form.curso = curso;

    setDoc(doc(db, 'alunato', RA, 'cursos', curso),
      { bimestres: blocoAddAula(form) },
      { merge: true }
    )
      .then(() => {
        addLogInfo('log_alunato', 'update', `${RA} - ${curso} - ${bimestre} - insert_aula_${aula}`);
      })
      .catch((error) => {
        console.log(error);
        addLogInfo('log_alunato', 'error', `${RA} - ${curso} - ${bimestre} - insert_aula_${aula}`, error);
      });

  });
  defaultEventsAfterSubmitForm("#form_add_aula_grupo", "Aulas adicionadas com sucesso!")

}








//----------------------------------------------------------------------
//----------------------------------------------------------------------



function blocoAddAula(form) {
  let aula = {};
  if (form.aula_categoria.value === "prova" || form.aula_categoria.value === "reposição de prova") {
    aula = {
      [form.bimestre]: {
        [form.aula]: {
          categoria: form.aula_categoria.value,
          status: form.status.value,
          tema: form.tema.value,
          data: form.data.value,
          horario: form.horario.value,
          nota: form.nota_prova.value,
          numero_questoes: form.numero_questoes.value,
          observacao: form.obs_prova.value,
        },
      },
    };
  } else {
    aula = {
      [form.bimestre]: {
        [form.aula]: {
          categoria: form.aula_categoria.value,
          status: form.status.value,
          tema: form.tema.value,
          data: form.data.value,
          horario: form.horario.value,
          detalhes: form.detalhes.value,
        },
      },
    };
  }
  return aula;
}



function btnDeleteAlunoAdicionado(e) {
  let element = e.target.closest('.div_aluno_adicionado');
  let parent = element.parentElement;
  parent.removeChild(element);
}

async function createOptionsSelectAlunos() {
  let options = getDocs(collection(db, "alunato"))
    .then((snap) => {
      let arrRAList = [];
      let selectAluno = ``;
      snap.forEach((doc) => {
       
        arrRAList.push(doc.id);
        selectAluno += `<option  data-ra='${doc.id}' value='${doc.id}-${doc.data().aluno.nome}'/>`;
      });
      return selectAluno;
    })
  return options;
}

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

function eventClickBtnStatus(form) {
  let btns = form.querySelector('#div_status_aula').querySelectorAll('label');;
  btns.forEach((item) => {
    item.addEventListener('click', () => {
      setClassBtnStatus(form)
    });
  });
}


function setClassBtnStatus(form) {
  removeClassActivedBtnStatus();
  let btns = form.querySelector('#div_status_aula').querySelectorAll('label');
  btns.forEach((item) => {
    if (item.querySelector('input').checked === true) {
      item.classList.add('actived_' + item.id);
      let tema = form.querySelector("#tema");
      let detalhes = form.querySelector("#detalhes");
      if (item.querySelector('input').value !== 'concluida') {
        tema.setAttribute('disabled', true); tema.value = "";
        detalhes.setAttribute('disabled', true); detalhes.value = "";
      } else {
        tema.removeAttribute('disabled');
        detalhes.removeAttribute('disabled');
      }
    }
  });
}

function removeClassActivedBtnStatus() {
  let btns = document.querySelectorAll('label');
  btns.forEach((item) => {
    item.className = '';
  });
}

function insertOptionsInSelectAluno(form) {
  let select = form.querySelector('#select_aluno');
  let mainSelect = document.querySelector('#main_select_aluno');
  select.innerHTML = mainSelect.innerHTML;
  select.selectedIndex = mainSelect.selectedIndex;
  select.setAttribute('disabled', true);
  form.querySelector('#aluno_nome').innerHTML = '<span>Aluno: </span>' + select.options[select.selectedIndex].textContent;
}
/*
export async function insertOptionSelectCurso(form) {
  let select = form.querySelector('.select_curso');
  let option = ``;
  let bg_curso = document.querySelectorAll(".bg_curso");
  let navCursos = document.querySelector('.nav_cursos_aluno');
  let activeCurso = navCursos.querySelector('.active').dataset.active;
  bg_curso.forEach((curso) => {
    if (stringToID(curso.dataset.curso) === activeCurso) {
      select.innerHTML = `<option value='${curso.dataset.curso}' selected>${curso.dataset.curso}</option>`
    }
  })
  form.querySelector('#curso_nome').innerHTML = '<span>Curso: </span>' + select.options[select.selectedIndex].textContent;
}
*/



function setInputsProva(form) {
  let selectAula = form.querySelector(".select_aula");
  let aula_categoria = form.querySelector("#aula_categoria");

  selectAula.addEventListener('change', (e) => {
    if (e.target.value === "aula 16" || e.target.value === "reposição da aula 16") {
      form.querySelector("#bg_prova_inputs").style.display = "flex";
      form.querySelector("#div_detalhes").style.display = "none";
      form.querySelector("#nota_prova").setAttribute("required", true);
      form.querySelector("#numero_questoes").setAttribute("required", true);
      form.querySelector("#obs_prova").setAttribute("required", true);
      form.querySelector("#detalhes").removeAttribute("required");
      aula_categoria.value = 'prova'

    } else {
      aula_categoria.value = "comum"
      form.querySelector("#div_detalhes").style.display = "flex";
      form.querySelector("#bg_prova_inputs").style.display = "none";
      form.querySelector("#nota_prova").removeAttribute("required");
      form.querySelector("#numero_questoes").removeAttribute("required");
      form.querySelector("#obs_prova").removeAttribute("required");
      form.querySelector("#detalhes").setAttribute("required", true);
    }
  })
}