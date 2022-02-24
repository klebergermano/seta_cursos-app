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
const sortTable = () => {};
export default  sortTable; 

function invertDateOrder(d) {
  var p = d.split("/");
  return +(p[2] + p[1] + p[0]);
}

sortTable.sortByDate = function (tableID, tdID, e) {
  let order = e.target.dataset.sort_order;
  let table = document.querySelector(tableID + " tbody");
  let rows = Array.from(table.rows);

  rows.sort((a, b) => {
    let aINT = invertDateOrder(a.querySelector(tdID).innerHTML);
    let bINT = invertDateOrder(b.querySelector(tdID).innerHTML);
    return aINT - bINT;
  });
  alternateBtnDataOrder(e);
  orderRowsAscDesc(rows, order);
  rows.forEach((item) => {
    table.appendChild(item);
  });
};

sortTable.sortByIntTD = function (tableID, tdID, e) {
  let order = e.target.dataset.sort_order;
  let table = document.querySelector(tableID + " tbody");
  let rows = Array.from(table.rows);

  rows.sort((a, b) => {
    let aINT = parseInt(a.querySelector(tdID).innerHTML);
    let bINT = parseInt(b.querySelector(tdID).innerHTML);
    console.log("data:", aINT);
    return aINT - bINT;
  });
  alternateBtnDataOrder(e);
  orderRowsAscDesc(rows, order);
  rows.forEach((item) => {
    table.appendChild(item);
  });
};

sortTable.sortByTextTD = function (tableID, tdID, e) {
  let order = e.target.dataset.sort_order;
  let table = document.querySelector(tableID + " tbody");
  let rows = Array.from(table.rows);

  rows.sort((a, b) => {
    let aText = a.querySelector(tdID).innerHTML;
    let bText = b.querySelector(tdID).innerHTML;
    if (aText > bText) {
      return 1;
    } else if (bText > aText) {
      return -1;
    }
    return 0;
  });
  alternateBtnDataOrder(e);
  orderRowsAscDesc(rows, order);
  rows.forEach((item) => {
    table.appendChild(item);
  });
};

sortTable.filterTableByInputText = function (tableID, tdID, e) {
  let nameValue = e.target.value;
  let table = document.querySelector(tableID + " tbody");
  let rows = Array.from(table.rows);

  let nRows = [];
  rows.forEach((item) => {
    let nome = item.querySelector(tdID).innerHTML;
    if (nome.toLowerCase().includes(nameValue)) {
      nRows.unshift(item);
    } else {
      nRows.push(item);
    }
  });
  table.innerHTML = "";
  nRows.forEach((item) => {
    table.appendChild(item);
  });
};

function alternateBtnDataOrder(e) {
  let btn = e?.target;
  if (btn?.dataset?.sort_order === "ASC") {
    btn.setAttribute("data-sort_order", "DESC");
  } else {
    btn.setAttribute("data-sort_order", "ASC");
  }
}
function orderRowsAscDesc(rows, order) {
  if (order === "ASC") {
    rows.sort();
  } else {
    rows.sort().reverse();
  }
}
