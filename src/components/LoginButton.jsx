import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { db } from '../firebase'
import { getDocs, collection, addDoc } from 'firebase/firestore'



const LoginButton = () => {

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
    getUsersList();
  }, [idToken,]);
  const getUsersList = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const userIds = filteredData.map(user => user.userId.toString());
      console.log("User IDs", userIds);
      setListOfUsers(prevList => [...prevList, ...userIds]);
    } catch (err) {
      console.error(err);
    }

    setListOfUsers(prevList => {
      // console.log("Updated list of users", prevList);
      // console.log("Does user exist : ", prevList.includes(idToken), idToken);
      if (!prevList.includes(idToken)) {
        addUser();
      }
      // Return the unchanged list, since we're not making any further updates here.
      return prevList;
    });
  }

  const addUser = async () => {
    try {
      await addDoc(usersCollectionRef, {
        coinInPortfolio: { "portfolio": [0, 0, 0, 0, 0] },
        portfolioBalance: 4774,
        userId: idToken,
      });
    } catch (err) {
      console.error(err);
    }
  }



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
