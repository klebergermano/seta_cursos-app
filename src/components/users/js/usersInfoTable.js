
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

    function getUsersList(){
        let usersList = getDocs(collection(db, 'users'));
        return usersList;
    }

    export async function insertUsersInfoTable(){
        getUsersList().then((res) => {
            return createTableUsersHTML(res)
        })
        .then((tableUsersHTML)=>{
            document.querySelector('#users_submenu_content').innerHTML = ""; 
            document.querySelector('#users_submenu_content').appendChild(tableUsersHTML);
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
        <th>Controle</th>
        </thead>
        <tbody></tbody>`;
        usersInfo.forEach((item)=>{
            let user = item.data();
            let row = document.createElement('tr');
            row.className = 'usersRow';
            let rowContent = 
            `
            <td class='usersTD user_foto'><img src='../src/assets/img/usersIcons/${user.photoURL}'/></td>
            <td class='usersTD user_name'>${user.name}</td>
            <td class='usersTD user_email'>${user.email}</td>
            <td class='usersTD user_level'>${user.role}</td>
            <td class='usersTD'>Delete | Edit</td> 
            `
            row.innerHTML = rowContent;
            tableUsersHTML.appendChild(row);
        })
        return tableUsersHTML;
    }