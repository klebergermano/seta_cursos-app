import permissions from "./permissions.js";
import * as users from "../../../components/users/js/index.js";
import * as commonFunc from "../../../components/js_common/commonFunctions.js";
import * as permissionsFunc from "../../../components/users/js/permissions.js";



export function checkPermission(auth){
  
    let currentUser = auth.currentUser;
    removeUnauthorizedElement(currentUser)
}



function removeUnauthorizedElement(currentUser){
   users.getUserCompleteInfo(currentUser)
    .then((userInfo)=>{
        let role = userInfo.role;
    permissionsFunc.getPermissions().then((permissions)=>{
        console.log(permissions.data());
        let userPermission = permissions.data()[role];
        let authElements = document.querySelectorAll('*[data-auth]');
       authElements.forEach((item)=>{
           let itemDataAuth = item.dataset.auth;
           if(!userPermission[itemDataAuth]){
               console.log('removed!', item.dataset.auth );
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