import { useEffect } from "react";
import useFirebaseAuth from "./useFirebaseAuth";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const FirebaseAuthComponent = ({
  sendCoinsInPortfolio,
  updatePortfolioData,
}) => {
  const { idToken, listOfUsers, addUser } = useFirebaseAuth();
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    if (!listOfUsers.includes(idToken)) {
      addUser();
    } else {
      getUserPortfolio();
    }
  }, [idToken, listOfUsers]);

  const getUserPortfolio = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      for (let key in filteredData) {
        if (
          filteredData.hasOwnProperty(key) &&
          filteredData[key].userId === idToken
        ) {
          sendCoinsInPortfolio(filteredData[key]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return null; // or render any JSX if needed
};

export default FirebaseAuthComponent;
