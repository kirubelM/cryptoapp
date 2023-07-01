import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { AppContext } from "../App";
import { useContext } from "react";

const useLoginButtonLogic = () => {
  const {
    coinsInPortfolio,
    setCoinsInPortfolio,
    portfolioBalance,
    setPortfolioBalance,
  } = useContext(AppContext);
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [idToken, setIdToken] = useState(" ");
  const [listOfUsers, setListOfUsers] = useState([idToken]);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    getToken();
  }, [isAuthenticated, user, idToken]);

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
    const updateDatabase = async () => {
      try {
        await updateDoc(doc(db, "users", idToken), {
          coinInPortfolio: coinsInPortfolio,
          portfolioBalance: portfolioBalance,
        });

        console.log("Database updated successfully");
      } catch (error) {
        console.error("Error updating database:", error);
      }
    };

    updateDatabase();
  }, [coinsInPortfolio, portfolioBalance]);

  useEffect(() => {
    getUsersList();
  }, [idToken]);

  const getUsersList = async () => {
    let filteredUserData;
    try {
      const data = await getDocs(usersCollectionRef);
      filteredUserData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const userIds = filteredUserData.map((user) => user.userId.toString());
      setListOfUsers((prevList) => [...prevList, ...userIds]);
    } catch (err) {
      console.error(err);
    }

    setListOfUsers((prevList) => {
      if (!prevList.includes(idToken)) {
        addUser(idToken);
      } else {
        let currUser = filteredUserData.map((users) => {
          if (users.userId === idToken) {
            setPortfolioBalance(users?.portfolioBalance);
            setCoinsInPortfolio(users?.coinInPortfolio);
            return users;
          }
        });
      }
      return prevList;
    });
  };

  const addUser = async (userId) => {
    const userRef = doc(db, "users", userId);
    try {
      await setDoc(userRef, {
        coinInPortfolio: coinsInPortfolio,
        portfolioBalance: portfolioBalance,
        userId: userId,
      });
      console.log("User added successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return {
    idToken,
    listOfUsers,
    getUsersList,
    addUser,
  };
};

export default useLoginButtonLogic;
