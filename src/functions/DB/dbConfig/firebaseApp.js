
const {initializeApp} = require("firebase/app") 
import firebaseConfig from "./firebaseConfig.js";
export const firebaseApp = initializeApp(firebaseConfig);