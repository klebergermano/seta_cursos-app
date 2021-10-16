

import * as commonFunc from "../../js_common/commonFunctions.js";

import * as formAddUser from "./formAddUser.js";
import * as formReauthUser from "./formReauthUser.js";

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, setDoc, getDoc, onSnapshot } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);


//----------------------------------------------------

import * as relogin from "./reLogin.js";
//------------------------------------------------------




function getUserList(){
    let usersList = getDocs(collection(db, 'users'));
    return usersList;
    }

    function insertUsersInfoInPage(){
        getUserList().then((res) => {
            return createTableUsersHTML(res)
        })
        .then((tableUsersHTML)=>{
            document.querySelector('#users_content').appendChild(tableUsersHTML);
        })
        .catch(err => console.log(err))
    }
    
    
    
    function createTableUsersHTML (usersInfo){
    let tableUsersHTML = document.createElement('table'); 
    tableUsersHTML.setAttribute('border', '1'); 
        tableUsersHTML.id='users_table_info';
        tableUsersHTML.className='table_info';
        tableUsersHTML.innerHTML = `
        <thead> 
            <th>Foto</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Categoria</th>
            <th>Privilégio</th>
    
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
            <td class='usersTD user_email'>${user.email}</td>
            <td class='usersTD user_level'>${user.role}</td>
            <td class='usersTD user_privilege'>${user.privilege}</td>
    
            
            `
            row.innerHTML = rowContent;
            tableUsersHTML.appendChild(row);
        })
        return tableUsersHTML;
    }
   

export function onload(){

    document.querySelector('#btn_add_user').addEventListener('click', (e)=>{
        formReauthUser.insertFormReauthUser();
    })
    insertUsersInfoInPage()
}

