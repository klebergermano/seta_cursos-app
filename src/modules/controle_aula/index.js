import * as insertAulasCursosFunc from "./InsertAulasCursosFunc.js";

import * as formAddAula from "./formAddAula.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as formAddCursos from "./formAddCurso.js";
import * as formAddAluno from "./formAddAluno.js";
import * as commonFunc from "../common/commonFunctions.js";
import * as dragForms from "./dragForms.js";

//TODO: Arrumar ordem de execução das funções
export function onload(){

  //events FormAddAluno.js
  formAddAluno.eventsFormAddAluno();
  
  insertAulasCursosFunc.eventInputSelectAluno();
  dbAlunoHistFunc.dbRealTimeAlunoHistCursos("RA01", insertAulasCursosFunc.insertContentAlunoCurso);
  formAddAula.navAddFormsDisplayEvent();
  //FORMS
  formAddAula.eventFormsAdd();
  formAddAula.eventSelectAlunoAddAula();
  commonFunc.AddEventBtnCloseForm();

  //Carrega a lista de cursos do primeiro aluno quando inciado
  //no formulário form_add_aulas
  formAddAula.insertSelectCursosAddAula("RA01");
  
   
  //Curso
  formAddCursos.eventSelectAlunoAddCurso();
  
  //TODO: gerando erro ao carregar
  // formAddAluno.validaSelectOptionsAddAluno();
}


//----------------------------------------------------------
