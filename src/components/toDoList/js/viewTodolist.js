//Ramda Functional Programming -----------------------------------//
import * as R from '../../../../node_modules/ramda/dist/ramda.js';

//---------------------------------------------------------------//
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, getDoc, setDoc, collection, where, deleteDoc, query, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);
const { getAuth } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//helpers
import $ from "../../../functions/helpers/$.js";
import dragElementAbsolute from "../../../functions/helpers/dragElementAbsolute.js";
import appendFetchedElHTML from "../../../functions/helpers/appendFetchedElHTML.js";
import setCurrentDateIntoInputEl from "../../../functions/helpers/setCurrentDateIntoInputEl.js";
import resetSimblingElInputDate from "../../../functions/helpers/resetSimblingElInputDate.js";
import addEventListenerToEl from "../../../functions/helpers/addEventListenerToEl.js";
import maxOrMinimizeEl from "../../../functions/helpers/maxOrMinimizeEl.js";
//todoList
import submitFormAddTodoList from './formToDoList.js';
import removeItemTodolist from './removeItemTodolist.js';

//--------------------------------------------------------------//

const viewTodolist = (() => {
  async function appendOrRemoveViewTodolist() {
    const bgViewTablaTodolist = $("bg_view_table_todolist")
    bgViewTablaTodolist
      ? $('page_content').removeChild(bgViewTablaTodolist) // Se bg_view_table_todolist existe é removido do page_element.
      : appendViewTodolist() // Se não existir é adicionado.
  }
  const appendViewTodolist = async () => {
    try {
      (await appendFetchedElHTML('./components/todoList/viewTodolist.html'))('page_content')(_eventsTodolist.bind(viewTodolist));
    } catch (e) { console.log(e) }
  }


  const _eventsTodolist = async () => {
    dragElementAbsolute($('bg_view_table_todolist'));
    _marginViewTodolist();
    _btnCloseViewTodolist();
    _insertContentTableViewHTML(await _getUserTodoList());
    _doubleClickWindowBarEvent();
    _eventsBtnAddTodolist();
    _addEventsBtnRemoveItemTodolist();
  }

  function delegateEventToBtnRemoveItem(e){
    if(e.target && e.target?.nodeName === 'BUTTON' && e.target.classList.contains('btn_remove_item_todolist')) removeItemTodolist(e);
  }
  const _addEventsBtnRemoveItemTodolist = () =>{
    addEventListenerToEl($('view_table_todolist'))('click')(delegateEventToBtnRemoveItem)
  }
  const _marginViewTodolist = () => {
    const el = $('bg_view_table_todolist');
    const appContent = $('appContent')
    let top = appContent.scrollTop + 'px';
    el.style.top = top;
    //---------------------------------------------------//
    _watchScrollEvent(appContent)
  }

  const _changeMarginTop = (el, val) => {
    el.style.top = val + 'px';
  }
  const _watchScrollEvent = (el) => {
    let table = $('bg_view_table_todolist');
    el.addEventListener('scroll', (e) => {
      if (table && table.offsetTop <= e.target.scrollTop) { _changeMarginTop(table, e.target.scrollTop) }
    })
  }

  const _btnCloseViewTodolist = () => {
    $('btn_close_view_todolist')?.addEventListener('click', () => {
      $('page_content').removeChild($('bg_view_table_todolist'))
    });
  }

  const appendFormAddTodoHTML = async () => {
    try {
      (await appendFetchedElHTML('./components/todoList/formAddTodo.html'))('bg_view_table_todolist')(_eventFormAddTodo);
    } catch (err) {
      console.log(err)
    }
  }
  const _insertContentTableViewHTML = (userTodolist) => {
    $('view_table_todolist').querySelector('tbody').innerHTML = createContentTableTodolistHTML(userTodolist);
  }

  function createContentTableTodolistHTML(userTodolist) {
    let tbody = document.createElement('tbody');
    for (let key in userTodolist) {
      const item = userTodolist[key];
      const tr = document.createElement('tr');
      tr.setAttribute('item_id', key);
      let trContent =
        `
          <td class='td_id'>${key}</td>
          <td class='td_prioridade'>${item.prioridade}</td>
          <td class='td_titulo'>${item.titulo}</td>
          <td class='td_descricao'><textarea>${item.descricao}</textarea></td>
          <td class='td_data'>${item.data}</td>
          <td class='td_prazo'>${item.prazo}</td>
          <td class='td_checkbox'>
          <input type='checkbox'>
          </td>
          <td class='td_controls'>
            <button title="Deletar item to-do list" class='btn_remove_item_todolist'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </td>
          `
      tr.innerHTML = trContent;
      tbody.appendChild(tr);
    }
    return tbody.outerHTML;
  }

  const _doubleClickWindowBarEvent = () => {
    const bgViewTableTodolist = $('bg_view_table_todolist');
    bgViewTableTodolist.querySelector('.window_bar').addEventListener('dblclick', () => {
      maxOrMinimizeEl(bgViewTableTodolist, $('appContent'));
    })
  }
  const appendFormAddTodoHTMLIfNotExists = () => { if (!$('form_add_todo')) appendFormAddTodoHTML(); }
  const _eventsBtnAddTodolist = () => addEventListenerToEl($('btn_add_todo'))('click')(appendFormAddTodoHTMLIfNotExists)

  //Eventos do "form_add_todo".
  const _eventFormAddTodo = () => {
    const btnCloseForm = $('form_add_todo').querySelector('.btn_close_form')
    addEventListenerToEl(btnCloseForm)('click')(_removeForm);
    submitFormAddTodoList()
    setCurrentDateIntoInputEl($('form_add_todo').querySelector('#data'))
    _eventBtnSelectFlag();
    _eventBtnResetInputDate($('form_add_todo').querySelector('.btnCleanInput'))
  }

  const _removeForm = (e) => e.target.closest('form').remove();

  const _eventBtnResetInputDate = btn => addEventListenerToEl(btn)('click')(resetSimblingElInputDate)

  const _getUserContent = async () => await getDocs(collection(db, 'users', auth.currentUser.uid, 'content'));

  // Retorna o to-do list do usuário
  const _getUserTodoList = async () => {
    try {
      const userContent = await _getUserContent()
      const todoList = userContent.docs.filter((item) => item.id === 'to-do_list');
      return todoList[0].data();
    } catch (err) { console.log(err) }

  }

  // Eventos do botão de seleção de prioridade.a
  const _eventBtnSelectFlag = () => {
    const btnSelectFlag = $('btnSelectFlag')
    btnSelectFlag.addEventListener("click", (e) => {
      let element = e.target.nodeName === "LI" ? e.target : e.target.parentElement;
      element.nodeName !== "LI" ? _toggleSubmenu() : _setValueSubmenu(element);

      function _setValueSubmenu(li) {
        btnSelectFlag.querySelector("span").innerHTML = li.innerHTML;
        btnSelectFlag.querySelector("#prioridade").value = li.textContent.trim();
        $('subMenuFlags').style.display = 'none';
      }

      function _toggleSubmenu() {
        const subMenuFlags = $('subMenuFlags');
        subMenuFlags.style.display === 'block' ? (subMenuFlags.style.display = 'none') : (subMenuFlags.style.display = 'block');
      }
    })
  }

  //Retorna as funções plublicas.
  return {
    appendOrRemoveViewTodolist
  }
})();

export default viewTodolist;


