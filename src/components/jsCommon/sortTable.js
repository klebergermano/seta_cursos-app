import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
<input id='nome_search' type='text' />
<table id='my_table'  border='1' style="width:100%; border-collapse: collapse;">
  <thead>
    <th>id <button id='sort_id'>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
  </svg>
</button></th>
    <th>Nome
    <button id='sort_nome'>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
  </svg>
</button>
    </th>
    <th>Contact</th>
    <th>Country</th>
  <thead>
<tbody>
<tr>
<td id='td_id'>7 </td>
  <td id='td_nome'>Maria da Conceição</td>
  <td>Maria Anders</td>
  <td>Germany</td>
</tr>
<tr>
<td id='td_id'>2</td>
  <td id='td_nome'>Alexandre de Silva</td>
  <td>teste</td>
  <td>Mexico</td>
</tr>
<td id='td_id'>13</td>
  <td id='td_nome'>Caroline Albuquerque</td>
  <td>Francisco Chang</td>
  <td>Brasil</td>
</tr>
<td id='td_id'>12</td>
  <td id='td_nome'>Denis Silva</td>
  <td> Chang</td>
  <td>Mexico</td>
</tr>
</tbody>
</table>
</div>
`;

document.querySelector("#sort_id").addEventListener("click", (e) => {
  sortTable.sortByIntTD("#my_table", "#td_id", e);
});

document.querySelector("#sort_nome").addEventListener("click", (e) => {
  sortTable.sortByTextTD("#my_table", "#td_nome", e);
});

document.querySelector("#nome_search").addEventListener("input", (e) => {
  sortTable.filterTableByInputText("#my_table", "#td_nome", e);
});

const sortTable = () => {};

sortTable.sortByIntTD = function (tableID, tdID, e) {
  let order = e.target.dataset.sort_order;
  let table = document.querySelector(tableID + " tbody");
  let rows = Array.from(table.rows);

  rows.sort((a, b) => {
    let aINT = parseInt(a.querySelector(tdID).innerHTML);
    let bINT = parseInt(b.querySelector(tdID).innerHTML);
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




