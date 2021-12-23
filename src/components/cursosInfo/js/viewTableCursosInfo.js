
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection, deleteDoc, doc, setDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const {getAuth} = require("firebase/auth");
const auth = getAuth(firebaseApp);

let $cursosList = {};
import { insertElementHTML, confirmBoxDelete, readableRandomStringMaker} from "../../js_common/commonFunctions.js";
    function getCusosInfoList(){
        let cursosInfoList = getDocs(collection(db, 'cursos_info'));
        return cursosInfoList;
    }
    export function insertViewTableCursosInfoHTML(){
        insertElementHTML("#cursos_info_content", "./components/cursosInfo/viewTableCursosInfo.html",  eventsViewTableCursosInfo, null, true)
    }

    function eventsViewTableCursosInfo(){
        getCusosInfoList()
        .then((res) => {
         $cursosList = res;
           return createTableCursosInfoHTML(res)
        })
        .then((tbody)=>{
          document.querySelector('#view_table_cursos_info tbody').outerHTML = tbody.outerHTML;
        })
        .catch(err => console.log(err))
    }

    function eventBtnDeleteContrato(){
        /*
        let btns = document.querySelectorAll('.btn_delete_contrato');
        btns.forEach((item)=>{
          item.addEventListener('click', (e)=>{
            let idContrato = e.target.closest('td').dataset.id_contrato;
            let alunoNome = e.target.closest('td').dataset.aluno_nome;
            let msg = `<span style='color:red'><b>ATENÇÃO</b></span>
            <br/>Tem certeza que deseja deletar o contrato <b>${idContrato}</b> referente ao aluno <b>${alunoNome}</b>?
            <br/>Essa ação não podera ser desfeita!`;
            confirmBoxDelete("#bg_contrato_content", msg, ()=>{
                submitDeleteContrato(idContrato)
            })
          })
        })
        */
    }

function  submitDeleteCursoInfo(idContrato){
    deleteDoc(doc(db, 'contratos', idContrato))
    .then(()=>{
        let data = new Date();
        let id =  data.getFullYear()+''+(data.getMonth()+1)+''+data.getDate()+''+readableRandomStringMaker(5);
      setDoc(doc(db, "log", 'log_contratos'),{
        [id]: `Contrato ${idContrato} deletado em ${new Date()} por ${auth.currentUser.email}`
        },
        { merge: true})
    })
    .then(()=>{
        insertViewTableContratosHTML()
    })
    .catch((err)=> console.log(err));
    }
 
    function createTableCursosInfoHTML (cursosInfo){
    let tbody = document.createElement('tbody'); 
        cursosInfo.forEach((item)=>{
            let curso = item.data();
            let tr = document.createElement('tr');
            tr.setAttribute('data-id_curso', curso.nome );
    
            let trContent = 
            `
            <td>${curso.categoria}</td>
            <td>${curso.nome}</td>
            <td><textarea>${curso.modulos}</textarea></td>
            <td>${curso.valor}</td>
            <td>${curso.duracao}</td>
            <td>${curso.parcelas}</td>
        
            `
            tr.innerHTML = trContent;
            tbody.appendChild(tr);
        })
        return tbody;
    }