//----------------------------------------------------
import {firebaseApp} from "../../../components/dbConfig/firebaseApp.js";
const {getAuth, signOut } =  require("firebase/auth");
const {getFirestore, doc, getDoc, setDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);



  export function timerIdleMouseMoveFunc(segundos, callback) {
    let currentTime = segundos;
  
    //-------------------------------------
    var wait = false;
    window.addEventListener("mousemove", () => {
      //Throttle mousemove
      if (!wait) {
        wait = true;
        currentTime = segundos;
  
        setTimeout(() => {
          wait = false;
        }, 60000);
      }
    });
    //-------------------------------------
  
    let interval = setInterval(() => {
      currentTime -= 1;
      if (currentTime <= 0) {
       callback();
        clearInterval(interval);
      }
    }, 1000);
  }
  


  
function logOut() {
    console.log("Logout!!!");
  }
  