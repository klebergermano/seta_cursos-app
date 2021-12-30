import permissions from "./permissions.js";
import * as users from "../../../components/users/js/index.js";
import * as commonFunc from "../../../components/js_common/commonFunctions.js";
import * as permissionsFunc from "../../../components/users/js/permissions.js";

export function checkRolePermission(auth){
    let currentUser = auth.currentUser;
    removeUnauthorizedElement(currentUser)
}

function removeUnauthorizedElement(currentUser){
    users.getUserCompleteInfo(currentUser)
     .then((userInfo)=>{
         let userRole = userInfo.role;
     permissionsFunc.getRolePermission(userRole)
     .then((permissions)=>{
         let userPermission = permissions.data();
         let authElements = document.querySelectorAll('*[data-auth]');
        authElements.forEach((item)=>{
            let itemDataAuth = item.dataset.auth;
            if(!userPermission[itemDataAuth]){
                removeElement(item)
            }           
        })
 
         });
     })
   
 }




function removeElement(item){
    let parent = item.parentElement;
    parent.removeChild(item);
}