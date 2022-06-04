
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDoc, doc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import sortTable from "../../jsCommon/sortTable.js"; 

import insertElementHTML from "../../jsCommon/insertElementHTML.js";
//---------------------------------------------------------------//

export function insertViewTableDataLogHTML() {
    insertElementHTML("#log_data_content", "./components/logData/viewTableLogData.html", eventsViewTableLogData, null, true);
}

let $logsInfo = {};
function getLogData(logId) {
    return getDoc(doc(db, 'log_data', logId))
}

function eventsFilters() {
    sortTable.sortByIntTD('#view_table_log_data', '.td_id', false);

    let table = document.querySelector('#view_table_log_data');
    table.querySelector('#sort_id').addEventListener('click', (e) => {
        sortTable.sortByIntTD('#view_table_log_data', '.td_id', e);
    })
    table.querySelector('#sort_data').addEventListener('click', (e) => {
        sortTable.sortByDate('#view_table_log_data', '.td_data', e);
    })

    table.querySelector('#sort_user').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#view_table_log_data', '.td_user', e);
    })

    table.querySelector('#sort_level').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#view_table_log_data', '.td_level', e);
    })
    table.querySelector('#sort_action').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#view_table_log_data', '.td_action', e);
    })

    document.querySelector('#bg_view_table_log_data #input_search_message').addEventListener('input', (e) => {
        sortTable.filterTableByInputText('#view_table_log_data', '.td_msg', e);
    })
}

function eventsViewTableLogData() {
    let filtroInfo = getFiltroInfoLog();
        
        

    getLogData(filtroInfo)
        .then((res) => {
            insertTableLogDataHTML(res);
        }).then(()=>{
   //Esse sortTable seta o estado inicial de organização da tabela.
   // sortTable.sortByDate('#view_table_log_data', '.td_data', false);
   eventsFilters();

        })
     select_log.addEventListener('change', (e) => {
        let logId = e.target.value;
        getLogData(logId).then((res) => {
            insertTableLogDataHTML(res);
        }).then(()=>{
     //Esse sortTable seta o estado inicial de organização da tabela depois do select
           // sortTable.sortByDate('#view_table_log_data', '.td_data', false);
           eventsFilters();

        })
    });
}

function getFiltroInfoLog() {
    let filtroInfo = select_log.options[select_log.selectedIndex].value;
    return filtroInfo;
}

function convertDateToNumber(d) {
    var p = d.split("/");
    return +(p[2] + p[1] + p[0]);
}

function sortTbodyElementByDate(tableID) {
    let tbody = document.querySelector(`${tableID} tbody`);
    let rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort(function (a, b) {
        return (
            convertDateToNumber(a.querySelector('.td_data').innerHTML) -
            convertDateToNumber(b.querySelector('.td_data').innerHTML)
        );
    });
    tbody.innerHTML = '';
    rows.reverse().forEach((item) => {
        tbody.appendChild(item);
    });
}

function insertTableLogDataHTML(log) {
    let contentTableLogData = createTableLogDataHTML(log);
    view_table_log_data.querySelector('tbody').innerHTML = contentTableLogData.innerHTML;
   // sortTbodyElementByDate('#view_table_log_data')


}

function createTableLogDataHTML(log) {
    let logInfo = log.data();
    let tbody = document.createElement('tbody');
    if (logInfo) {
        for (let [key, value] of Object.entries(logInfo)) {
            let datetime = value.datetime.toDate();
            let tr = document.createElement('tr');
            let trContent =
                `
        <td class='td_id'>${key}</td>
        <td class='td_data'>
           ${datetime.toLocaleDateString('pt-BR')}
        </td>
        <td class='td_hora'>
             ${datetime.toLocaleTimeString('pt-BR')}
        </td>
        <td class='td_user'>${value.user}</td>
        <td class='td_level '><span class='${value.level}'>${value.level}</span></td>
        <td class='td_action ${value.action}'>${value.action}</td>
        <td class='td_msg'><textarea readonly='true'>${value.message}</textarea></td>
        `
            tr.innerHTML = trContent;
            tbody.appendChild(tr)
        }
    } else {
        let tr = document.createElement('tr');
        let trContent = `
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr)
    }
    return tbody;
}


