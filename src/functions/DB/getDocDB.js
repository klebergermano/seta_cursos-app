//Firebase
import { firebaseApp } from "./dbConfig/firebaseApp.js";

const { getFirestore, setDoc, getDocs, collection, getDoc, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);

const getDataDocDB = async( collection, docID)=>{
    const document = await getDoc(doc(db, collection, docID));
    return document.data();
}

export default getDataDocDB; 