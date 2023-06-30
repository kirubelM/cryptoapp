import React, { useState, useEffect, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { db } from '../firebase'
import { getDocs, collection, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore'
import { AppContext } from "../App";



const LoginButton = () => {
  const { coinsInPortfolio, setCoinsInPortfolio, portfolioBalance, setPortfolioBalance } = useContext(AppContext);

  const { loginWithRedirect, user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [idToken, setIdToken] = useState(" ");
  const [listOfUsers, setListOfUsers] = useState([idToken]);
  const usersCollectionRef = collection(db, "users");
  const [containsID, setContainsID] = useState(true);

  useEffect(() => {
    getToken()
  }, [isAuthenticated, user, idToken]);
  const getToken = async () => {
    try {
      const idTokenClaims = await getIdTokenClaims();

      let temp = idTokenClaims.sub.toString();
      setIdToken(temp)
      console.log("getToken before", containsID, idToken, 9)
    } catch (error) {
      console.error('Error retrieving ID token:', error);
    }
  };


  useEffect(() => {
    const updateDatabase = async () => {
      // let docid = listOfUsers.map((user) => console.log(user))
      try {
        // Update document in the database with the new values
        console.log('Database updated successfully', portfolioBalance);

        await updateDoc(doc(db, 'users', idToken), {
          coinInPortfolio: coinsInPortfolio,
          portfolioBalance: portfolioBalance,
        });

        console.log('Database updated successfully');
      } catch (error) {
        console.error('Error updating database:', error);
      }
    };



    // Call the updateDatabase function
    updateDatabase();
  }, [coinsInPortfolio, portfolioBalance])

  useEffect(() => {
    getUsersList();
  }, [idToken,]);
  const getUsersList = async () => {
    let filteredUserData;
    try {
      const data = await getDocs(usersCollectionRef);
      filteredUserData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(filteredUserData)
      const userIds = filteredUserData.map(user => user.userId.toString());
      console.log("User IDs", userIds);
      setListOfUsers(prevList => [...prevList, ...userIds]);
    } catch (err) {
      console.error(err);
    }

    setListOfUsers(prevList => {
      // console.log("Updated list of users", prevList);
      // console.log("Does user exist : ", prevList.includes(idToken), idToken);
      if (!prevList.includes(idToken)) {
        addUser(idToken);
      } else {
        console.log(filteredUserData)
        let currUser = filteredUserData.map((users) => {
          if (users.userId === idToken) {
            console.log(users.userId, idToken)
            console.log(users.portfolioBalance)
            setPortfolioBalance(users?.portfolioBalance)
            setCoinsInPortfolio(users?.coinInPortfolio)
            return users;
          }
        })

        let tempbalance = currUser[0]?.portfolioBalance ? currUser[0]?.portfolioBalance : currUser[1]?.portfolioBalance;
        let tempCoins = currUser[0]?.coinInPortfolio ? currUser[0]?.coinInPortfolio : currUser[1]?.coinInPortfolio;
      }
      return prevList;
    });
  }

  const addUser = async (userId) => {
    const userRef = doc(db, 'users', userId);
    try {
      await setDoc(userRef, {
        coinInPortfolio: coinsInPortfolio,
        portfolioBalance: portfolioBalance,
        userId: userId,
      });
      console.log('User added successfully!');
    } catch (err) {
      console.error(err);
    }
  };



  return (
    !isAuthenticated && (
      <Button className="sign-in-button" type="primary" onClick={() => loginWithRedirect()}>
        Login <LoginOutlined style={{
          fontSize: "1.75rem",
          fontWeight: "500"
        }} />
      </Button>
    )
  )
}

export default LoginButton; // add this line to export the LoginButton component
