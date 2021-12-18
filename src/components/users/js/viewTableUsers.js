
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
import {insertElementHTML, confirmBoxDelete} from "../../js_common/commonFunctions.js";


export function insertViewTableUsersHTML(){
    insertElementHTML("#users_content", "./components/users/viewTableUsers.html",  eventsViewTableUsers, null, true)
}
function eventsViewTableUsers(){
    getUsersList()
    .then((res) => {
        return createTableUsersHTML(res)
    })
    .then((tbody)=>{
        document.querySelector('#view_table_users tbody').outerHTML = tbody.outerHTML;
    })
    .catch(err => console.log(err))
}

function eventBtnDeleteUser(){
    let btns = document.querySelectorAll('#view_table_users .btn_delete_user');
    btns.forEach((item)=>{
      item.addEventListener('click', (e)=>{
        let idUser = e.target.closest('tr').dataset.uid;
        let userEmail = e.target.closest('tr').dataset.user_email;
        let username = e.target.closest('tr').dataset.username;
        let msg = `<span style='color:red'><b>ATENÇÃO</b></span>
        <br/>Tem certeza que deseja deletar o usuário <b>${userEmail}</b>?
        <br/>Essa ação não podera ser desfeita!`;
        confirmBoxDelete("#bg_view_table_users", msg, ()=>{
            submitDeleteUser(idUser, username)
        })
      })
    })
}



    function getUsersList(){
        let usersList = getDocs(collection(db, 'users'));
        return usersList;
    }
    
    function createTableUsersHTML (usersInfo){
    let tbody = document.createElement('tbody'); 

        usersInfo.forEach((item)=>{
            let user = item.data();
            let tr = document.createElement('tr');
          tr.setAttribute('data-uid', user.uid);
          tr.setAttribute('data-user_email', user.email);
          tr.setAttribute('data-username', user.name);
            let trContent = 
            `
            <td class='td_user_foto'><img src='../src/assets/img/usersIcons/${user.photoURL}'/></td>
            <td class='td_user_name'>${user.name}</td>
            <td class='td_user_email'>${user.email}</td>
            <td class='td_user_level'>${user.role}</td>
            `
            tr.innerHTML = trContent;
            tbody.appendChild(tr);
        })
        return tbody;
    }