import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "../firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";

const useFirebaseAuth = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [idToken, setIdToken] = useState("");
  const [listOfUsers, setListOfUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    getToken();
  }, [isAuthenticated, user]);

  const getToken = async () => {
    try {
      const idTokenClaims = await getIdTokenClaims();
      let temp = idTokenClaims.sub.toString();
      setIdToken(temp);
    } catch (error) {
      console.error("Error retrieving ID token:", error);
    }
  };

  useEffect(() => {
    getUsersList();
  }, [idToken]);

  const getUsersList = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const userIds = filteredData.map((user) => user.userId.toString());
      setListOfUsers(userIds);
    } catch (err) {
      console.error(err);
    }
  };

  const addUser = async () => {
    try {
      await addDoc(usersCollectionRef, {
        coinInPortfolio: { portfolio: [0, 0, 0, 0, 0] },
        portfolioBalance: 4774,
        userId: idToken,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    idToken,
    listOfUsers,
    addUser,
  };
};

export default useFirebaseAuth;
