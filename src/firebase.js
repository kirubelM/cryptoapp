import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCTqUmUCDJD1Ld1cTx_UialkY8XC5ogFF0",
  authDomain: "cryptopia-464a3.firebaseapp.com",
  databaseURL: "https://cryptopia-464a3-default-rtdb.firebaseio.com",
  projectId: "cryptopia-464a3",
  storageBucket: "cryptopia-464a3.appspot.com",
  messagingSenderId: "385792028396",
  appId: "1:385792028396:web:e6d4b450294211ad793fc9",
  measurementId: "G-PZF3HKHMVW",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// const signInWithGoogle = () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       console.log();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
