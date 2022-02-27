/*

document.querySelector("#sort_date").addEventListener("click", (e) => {
  sortTable.sortByDate("#my_table", "#td_data", e);
});

document.querySelector("#sort_id").addEventListener("click", (e) => {
  sortTable.sortByIntTD("#my_table", "#td_id", e);
});

document.querySelector("#sort_nome").addEventListener("click", (e) => {
  sortTable.sortByTextTD("#my_table", "#td_nome", e);
});

document.querySelector("#nome_search").addEventListener("input", (e) => {
  sortTable.filterTableByInputText("#my_table", "#td_nome", e);
});
*/
const sortTable = () => { };
export default sortTable;

function invertDateOrder(d) {
  var p = d.split("/");
  return +(p[2] + p[1] + p[0]);
}
//------------------------------Filters by input--------------------------------
sortTable.filterTableByInputText = function (tableID, tdID, e) {
  cleanInputsSearch(tableID, e)
  removeAllActiveBtnSortClass(tableID)
  let inputValue = ((e.target.value).toLowerCase()).trim();
  let tableTbody = document.querySelector(tableID + " tbody");
  let rows = Array.from(tableTbody.rows);
  let newRows = [];
  rows.forEach((item) => {
    if (item.querySelector(tdID)?.innerHTML) {
      let nome = ((item.querySelector(tdID).innerHTML).toLowerCase()).trim();
      if (inputValue !== '' && nome.includes(inputValue)) {
        item.querySelector(tdID).classList.add('match_search')
        newRows.unshift(item);
      } else {
        item.querySelector(tdID).classList.remove('match_search')
        newRows.push(item);
      }
    }
  });
  //Remove a classe 'td_sort_active' de todos os elementos TD setados anteriormente.
  removeAllTDSortActiveClass(tableID)
  newRows.forEach((item) => {
    tableTbody.appendChild(item);
  });
  //Sort last row
  let sortTolastRowTR = tableTbody.querySelector('.sort_to_last_row');
  if (sortTolastRowTR) {
    tableTbody.appendChild(sortTolastRowTR);
  }
};

//------------------------------------Btn Sort------------------------------
//Sort DATE
sortTable.sortByDate = function (tableID, tdID, e) {
  let table = document.querySelector(tableID + " tbody");
  let rows = Array.from(table.rows);
  rows.sort((a, b) => {
    if (a.querySelector(tdID) && b.querySelector(tdID)) {
      let aINT = invertDateOrder(a.querySelector(tdID).innerHTML);
      let bINT = invertDateOrder(b.querySelector(tdID).innerHTML);
      return aINT - bINT;
    }
  });
  communEventsOfSortTableFunctions(tableID, tdID, e, rows)
};

//Sort INT
sortTable.sortByIntTD = function (tableID, tdID, e) {
  let tableTbody = document.querySelector(tableID + " tbody");
  let rows = Array.from(tableTbody.rows);
  rows.sort((a, b) => {
    a = a?.querySelector(tdID)?.innerHTML?.replace(/\D+/g, '');
    b = b?.querySelector(tdID)?.innerHTML?.replace(/\D+/g, '');
    return a - b;
  });
  communEventsOfSortTableFunctions(tableID, tdID, e, rows)
};

//Sort TEXT
sortTable.sortByTextTD = function (tableID, tdID, e) {
  console.log('click')
  let order = e?.target?.dataset?.sort_order;
  let table = document.querySelector(tableID + " tbody");
  let rows = Array.from(table.rows);
  rows.sort((a, b) => {
    let aText = a.querySelector(tdID)?.innerHTML;
    let bText = b.querySelector(tdID)?.innerHTML;
    if(aText > bText){
      return 1; 
    }else if(aText < bText){
      return -1; 
    }else{
      return 0;
    }
  });
  communEventsOfSortTableFunctions(tableID, tdID, e, rows)
};

//---------------------------------------------------------------------
//---------------------------------------------------------------------

//Bloco de código comum compartilhado pelas funções sortTable.
function communEventsOfSortTableFunctions(tableID, tdID, e, rows) {
  let order = e?.target?.dataset?.sort_order;
  let tableTbody = document.querySelector(tableID + " tbody");
  //Testa se há "Event Button".
  if (e) {
    //Alterna o data-sort_order do botão para "ASC/DESC".
    alternateBtnDatasetSortOrder(e);
    //Set a classe btn_sort_active no botão clicado.
    setClassBtnSortActive(tableID, e);
  }
  //Ordena as linhas da tabela baseado na variável 'order' que deve ser ASC/DESC.
  orderRowsAscDesc(rows, order);
  //Remove a classe 'td_sort_active' de todos os elementos TD setados anteriormente.
  removeAllTDSortActiveClass(tableID)
  rows.forEach((item) => {
    //Adiciona a classe 'td_sort_active' para o elemento TD passado.
    if (item?.querySelector(tdID)) {
      addTDSortActiveClass(item.querySelector(tdID));
    }
    //Re-adiciona as linhas do tbody que foram ordenadas.
    tableTbody.appendChild(item);
  });

    //Sort last row
    let sortTolastRowTR = tableTbody.querySelector('.sort_to_last_row');
    if (sortTolastRowTR) {
      tableTbody.appendChild(sortTolastRowTR);
    }

}

//Adicona a classe 'td_sort_active' para o elemento TD.
function addTDSortActiveClass(TD) {
  TD.classList.add('td_sort_active');
}

//Remove a classe 'td_sort_active' de todos os elementos da tabela.
function removeAllTDSortActiveClass(tableID) {
  let tdActiveSort = document.querySelectorAll(tableID + ' .td_sort_active');
  tdActiveSort.forEach((item) => {
    item.classList.remove('td_sort_active');
  });
}

//Remove todas as classe'btn_sort_active' de todos os elementos da tabela.
function removeAllActiveBtnSortClass(tableID) {
  let table = document.querySelector(tableID);
  let btns = table.querySelectorAll('.btn_sort');
  btns.forEach((item) => {
    item.classList.remove('btn_sort_active');
  })
}

//Adiciona a classe 'btn_sort_active' ao elemento clicado.
//Essa classe é usada para mostrar o "botão sort" que está ativo.
function setClassBtnSortActive(tableID, e) {
  removeAllMatchSearchClass(tableID, e)
  let table = document.querySelector(tableID);
  let btns = table.querySelectorAll('.btn_sort');
  btns.forEach((item) => {
    item.classList.remove('btn_sort_active');
  })
  e.target.classList.add('btn_sort_active')
}

//Remove a classe 'match_search' de todos os elementos da tabela.
function removeAllMatchSearchClass(tableID, e) {
  let table = document.querySelector(tableID);
  let matchs = table.querySelectorAll('.match_search');
  matchs.forEach((item) => {
    item.classList.remove('match_search')
  });
}

//Limpa o valor de todos os inputs que possuam a classe 'input_search'.
function cleanInputsSearch(tableID, e) {
  let inputAtual = e.target;
  let table = document.querySelector(tableID);
  let inputs = table.querySelectorAll('.input_search');
  removeAllMatchSearchClass(tableID, e)
  inputs.forEach((item) => {
    if (item.id !== inputAtual.id) {
      item.value = '';
    }
  });
}

//Alterna o 'data-sort_order' do elemento clicado para "ASC/DESC".
function alternateBtnDatasetSortOrder(e) {
  let btn = e?.target;
  if (btn?.dataset?.sort_order === "ASC") {
    btn.setAttribute("data-sort_order", "DESC");
  } else {
    btn.setAttribute("data-sort_order", "ASC");
  }
}

//Ordena as linhas da tabela baseado na variável 'order' que deve ser ASC/DESC.
function orderRowsAscDesc(rows, order) {
  if (order === "ASC") {
    rows.sort();
  } else if(order === "DESC") {
    rows.sort().reverse();
  }else{
    rows.sort();

  }
}
