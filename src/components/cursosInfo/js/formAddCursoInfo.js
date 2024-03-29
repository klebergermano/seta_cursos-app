//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc, getDocs, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { insertViewTableCursosInfoHTML } from "./viewTableCursosInfo.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//
//Others libraries
const VMasker = require("vanilla-masker");
//---------------------------------------------------------------//

export function insertFormAddCursosInfoHTML() {
  insertElementHTML('#cursos_info_content',
    './components/cursosInfo/formAddCursoInfo.html', eventsFormAddCursosInfo
  );
}

function setCargaHoraria() {
  const meses = document.querySelector('#form_add_curso_info #meses').value;
  const horas_aula = document.querySelector('#form_add_curso_info #horas_aula').value;
  const aulas_semana = document.querySelector('#form_add_curso_info #aulas_semana').value;
const aulas_por_mes = aulas_semana * 4; 
  let cargaHorariaInput = document.querySelector('#carga_horaria');
  cargaHorariaInput.value = parseInt(horas_aula) * parseInt(aulas_por_mes) * parseInt(meses) // duração * 8 aulas por mês * 2 horas por aula.
}
function setQtdAulas() {
  const aulas_semana = document.querySelector('#form_add_curso_info #aulas_semana').value;
  const aulas_por_mes = aulas_semana * 4; 
  const meses = document.querySelector('#form_add_curso_info #meses').value;
  const qtdAulas = document.querySelector('#qtd_aulas');
  qtdAulas.value = aulas_por_mes * meses; 
}
export function eventsFormAddCursosInfo() {
  insertOptionslistIdCursosInfo();
  VMasker(document.querySelector('#valor_mes')).maskMoney();
  btnCloseForm('#form_add_curso_info');

  //Listeners
  document.querySelector('#id_curso').addEventListener('change', () => {
    checkInputIDCurso();
  });

  document.querySelector('#form_add_curso_info').addEventListener('input', (e) => {
    if(e.target && e.target.id === 'meses' || e.target.id === 'horas_aula' || e.target.id === 'aulas_semana'){
      setCargaHoraria()
      setQtdAulas();

    }
  });
  let form = document.querySelector('#form_add_curso_info');
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (form.classList.contains('form_edit_curso_info')) {
      submitFormEditCursoInfo(e)
    } else {
      submitFormAddCursoInfo(e)
    }
  });
}

function insertOptionslistIdCursosInfo() {
  let listIdCursosInfo = document.querySelector("#list_id_cursos_info");
  getIdCursosInfo()
    .then((idCursos) => {
      let options = '';
      idCursos.forEach((item) => {
        options += `<option>${item}</option>`;
      });
      listIdCursosInfo.innerHTML = options;
    });

}
function invalidateInputIDCursoInfo() {
  let idInput = document.querySelector("#form_add_curso_info #id_curso");
  idInput.setCustomValidity("ID em uso ou inválida");
  idInput.classList.add('input_invalido');
}
function validateInputIDCursoInfo() {
  let idInput = document.querySelector("#form_add_curso_info #id_curso");
  idInput.classList.remove('input_invalido');
  idInput.setCustomValidity("");
}

function checkInputIDCurso() {
  let idCursoInput = document.querySelector("#id_curso").value;
  getIdCursosInfo()
    .then((ids) => {

      let valida = true;
      ids.forEach((idCurso) => {
        if (idCurso === idCursoInput) {
          valida = false;
        }
      })
      if (!valida) {
        invalidateInputIDCursoInfo()
      }
      else {
        validateInputIDCursoInfo();
      }
    });
}

function getIdCursosInfo() {
  let cursos_info_ids = getDocs(collection(db, 'cursos_info'))
    .then((cursos_info) => {
      let ids = [];
      cursos_info.forEach((item) => {
        ids.push(item.id)
      })
      return ids;
    })
  return cursos_info_ids;
}

export function submitFormEditCursoInfo(e) {
  let form = e.target;
  setDoc(doc(db, "cursos_info", form.id_curso.value),
    {
      cod: form.id_curso.value,
      categoria: form.categoria.value,
      nome: form.nome.value,
      horas_aula: form.horas_aula.value,
      aulas_semana: form.aulas_semana.value,
      meses: form.meses.value,
      qtd_aulas: form.qtd_aulas.value,
      carga_horaria: form.carga_horaria.value,
      modulos: form.modulos.value,
      modulos_certificado: form.modulos_certificado.value,
      parcelas: form.parcelas.value,
      valor: form.valor_mes.value,
   
      metadata: {
        modified: new Date()
      }
    }, { merge: true }
  ).then(() => {
    defaultEventsAfterSubmitForm('#form_add_curso_info', 'Curso adicionado com sucesso!');
  }).then(() => {
    insertViewTableCursosInfoHTML();
  })
    .catch(err => console.log(err));
}


export function submitFormAddCursoInfo(e) {
  let form = e.target;
  let idCurso = (form.id_curso.value).toUpperCase();
  setDoc(doc(db, "cursos_info", idCurso),
    {
      cod: idCurso,
      categoria: form.categoria.value,
      nome: form.nome.value,
      horas_aula: form.horas_aula.value,
      aulas_semana: form.aulas_semana.value,
      meses: form.meses.value,
      qtd_aulas: form.qtd_aulas.value,
      carga_horaria: form.carga_horaria.value,

      modulos: form.modulos.value,
      modulos_certificado: form.modulos_certificado.value,
      parcelas: form.parcelas.value,
      valor: form.valor_mes.value,
     
      metadata: {
        created: new Date(),
        modified: new Date()
      }
    }, { merge: true }
  ).then(() => {
    defaultEventsAfterSubmitForm('#form_add_curso_info', 'Curso adicionado com sucesso!');
  }).then(() => {
    //setTimeout usado para atrazer a atualização da página, evitando erro
    setTimeout(() => {
      insertViewTableCursosInfoHTML();
    }, 2000);
  }).then(() => {
    addLogInfo('log_cursos_info', 'insert', idCurso)
  })
    .catch((error) => {
      addLogInfo('log_cursos_info', 'error', idCurso, error)
    });
}

