
import * as formReauthUser from "./formReauthUser.js";
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
import * as userPermissions from "./formConfigPerm.js";
import * as formConfigPerm from "./formConfigPerm.js";
const {getFirestore, collection, getDocs, doc,  getDoc } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);


export function getUserCompleteInfo(currentUser){
    let userInfo = getDoc(doc(db, "users",  currentUser.uid))
    .then((res)=>{
      let userInfo = {
        uid: currentUser.uid,
        email: currentUser.email,
        username: res.data().name,
        photoURL: res.data().photoURL,
        privilege: res.data()["privilege"],
        role: res.data()["role"]
      }
      return userInfo; 
    });
     return userInfo;
    }

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
    
        </thead>
        <tbody></tbody>`;
        usersInfo.forEach((item)=>{
            let user = item.data();
            let row = document.createElement('tr');
            row.className = 'usersRow';
        if(user.uid){
            let rowContent = 
            `
            <td class='usersTD user_foto'><img src='../src/assets/img/usersIcons/${user.photoURL}'/> </td>
            <td class='usersTD user_name'>${user.name}</td>
            <td class='usersTD user_email'>${user.email}</td>
            <td class='usersTD user_level'>${user.role}</td>
            `
            row.innerHTML = rowContent;
            tableUsersHTML.appendChild(row);
        }
        })
        return tableUsersHTML;
    }
   

export function onload(){
   
    document.querySelector('#btn_add_user').addEventListener('click', (e)=>{
        formReauthUser.insertFormReauthUser();
    })
    document.querySelector('#btn_config_permissions').addEventListener('click', (e)=>{
        formConfigPerm.insertFormConfigPerm();
    })
    insertUsersInfoInPage()
}

