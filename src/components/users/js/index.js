

import * as commonFunc from "../../js_common/commonFunctions.js";
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

function insertFormAddUser(){
    commonFunc.insertElementHTML('#bg_form_add_user', './components/users/formAddUser.html', eventsFormAddUser);
}

function insertUsersInfoInPage(){
    getUserList().then((res) => {
        return createTableUsersHTML(res)
    })
    .then((tableUsersHTML)=>{
        document.querySelector('#users_content').appendChild(tableUsersHTML);
    }).catch(err => console.log(err))
}

function eventsFormAddUser(){
    commonFunc.btnCloseForm('form_add_user');
}

function createTableUsersHTML (usersInfo){
let tableUsersHTML = document.createElement('table'); 
tableUsersHTML.setAttribute('border', '1'); 
    tableUsersHTML.id='users_table_info';
    tableUsersHTML.className='table_info';
    tableUsersHTML.innerHTML = `
    <thead> 
        <th>Foto</th>
        <th>Name</th>
        <th>Privilege</th>
        <th>Email</th>
        <th>Level</th>

    </thead>
    <tbody></tbody>`;
    usersInfo.forEach((item)=>{
      
        let user = item.data();
        let row = document.createElement('tr');
        row.className = 'usersRow';
        let rowContent = 
        `
        <td class='usersTD user_foto'><img src='../src/assets/img/usersIcons/${user.photoURL}'/> </td>
        <td class='usersTD user_name'>${user.name}</td>
        <td class='usersTD user_privilege'>${user.privilege}</td>
        <td class='usersTD user_email'>${user.email}</td>
        <td class='usersTD user_level'>${user.level}</td>
        
        `
        row.innerHTML = rowContent;
        tableUsersHTML.appendChild(row);
    })
    return tableUsersHTML;
}

function getUserList(){
    let usersList = getDocs(collection(db, 'users'));
    return usersList;
    }


   

export function onload(){
    document.querySelector('#btn_add_user').addEventListener('click', (e)=>{
        insertFormAddUser()
    })
    insertUsersInfoInPage()
}