
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
            document.querySelector('#users_sub_content').innerHTML = ""; 
            document.querySelector('#users_sub_content').appendChild(tableUsersHTML);
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
        <th></th>
        </thead>
        <tbody></tbody>`;
        usersInfo.forEach((item)=>{
            let user = item.data();
            let row = document.createElement('tr');
            row.className = 'usersRow';
            let rowContent = 
            `
            <td class='td_user_foto'><img src='../src/assets/img/usersIcons/${user.photoURL}'/></td>
            <td class='td_user_name'>${user.name}</td>
            <td class='td_user_email'>${user.email}</td>
            <td class='td_user_level'>${user.role}</td>
            <td class='td_controls'>
            <button class='btn_delete_user'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
                Deletar
            </button>
            <button class='btn_edit_user'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
</svg>
            Editar</button>
            </td> 
            `
            row.innerHTML = rowContent;
            tableUsersHTML.appendChild(row);
        })
        return tableUsersHTML;
    }