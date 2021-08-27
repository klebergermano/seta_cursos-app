import * as insertAulasCursosFunc from "./InsertAulasCursosFunc.js";
import * as formAddAulas from "./formAddAulas.js";

import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as formAddCursos from "./formAddCursos.js";
import * as formAddAlunos from "./formAddAlunos.js";
import * as commonFunc from "../common/commonFunctions.js";
import * as dragForms from "./dragForms.js";

//TODO: Arrumar ordem de execução das funções
export function onload(){
  
  insertAulasCursosFunc.eventInputSelectAluno();
  dbAlunoHistFunc.dbRealTimeAlunoHistCursos("RA01", insertAulasCursosFunc.insertContentAlunoCurso);
  formAddAulas.navAddFormsDisplayEvent();
  //FORMS
  formAddAulas.eventFormsAdd();
  formAddAulas.eventSelectAlunoAddAula();

  commonFunc.AddEventBtnCloseForm();

  //Carrega a lista de cursos do primeiro aluno quando inciado
  //no formulário form_add_aulas
  formAddAulas.insertSelectCursosAddAula("RA01");
  
  //Aluno
  formAddAlunos.insertOptionsAddAlunoRA();
  
   
  //Curso
  formAddCursos.eventSelectAlunoAddCurso();
  
  //TODO: gerando erro ao carregar
  // formAddAlunos.validaSelectOptionsAddAluno();
}


//----------------------------------------------------------
