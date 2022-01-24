
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore,  getDoc, doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);


import { insertElementHTML, confirmBoxDelete, readableRandomStringMaker} from "../../js_common/commonFunctions.js";
 
    export function insertViewTableDataLogHTML(){
        insertElementHTML("#log_data_content", "./components/logData/viewTableLogData.html",  eventsViewTableLogData, null, true)
    }


let $logsInfo = {};

function getLogData(logId){
return  getDoc(doc(db, 'log_data', logId))

}

function eventsViewTableLogData(){

let filtroInfo = getFiltroInfoLog(); 

    getLogData(filtroInfo)
    .then((res)=>{
        insertTableLogDataHTML(res);
    })
    select_log.addEventListener('change', (e)=>{
        let logId = e.target.value;
        getLogData(logId).then((res)=>{
            insertTableLogDataHTML(res);
        });
    });

}

function getFiltroInfoLog() {
    let filtroInfo = select_log.options[select_log.selectedIndex].value;
    return filtroInfo;
}



function insertTableLogDataHTML(log){
    let contentTableLogData = createTableLogDataHTML(log);
    view_table_log_data.querySelector('tbody').innerHTML = contentTableLogData.innerHTML;
}

function createTableLogDataHTML(log){
    let logInfo = log.data();
    let tbody = document.createElement('tbody'); 
if(logInfo){
    for( let [key, value] of Object.entries(logInfo)){
        let datetime = value.datetime.toDate();
        let tr = document.createElement('tr');
        let trContent = 
        `
        <td class='td_id'>${key}</td>
        <td class='td_datetime'><span class='date_text'>${datetime.toLocaleDateString('pt-BR')}</span>
        <span>${datetime.toLocaleTimeString('pt-BR')}</span></td>
        <td class='td_user'>${value.user}</td>
        <td class='td_level ${value.level}'>${value.level}</td>
        <td class='td_action ${value.action}'>${value.action}</td>
        <td class='td_msg'>${value.message}</td>
        `
        tr.innerHTML = trContent;
        tbody.appendChild(tr)
    }
}else{
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


