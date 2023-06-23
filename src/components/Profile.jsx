import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { db } from '../firebase'
import { getDocs, collection, addDoc } from 'firebase/firestore'
const Profile = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [idToken, setIdToken] = useState("");
  // const [userID, setUserID] = useState('');
  const [listOfUsers, setListOfUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const [containsID, setContainsID] = useState(true);

  ///////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   const getToken = async () => {
  //     try {
  //       const idTokenClaims = await getIdTokenClaims();
  //       // console.log(idTokenClaims);

  //       // const token = idTokenClaims.__raw;
  //       console.log(idTokenClaims.sub.toString().substring(14));
  //       setIdToken("2")
  //       // setIdToken(idTokenClaims.sub);
  //       console.log("getToken before", containsID, idToken)

  //     } catch (error) {
  //       console.error('Error retrieving ID token:', error);
  //     }
  //   };

  //   if (isAuthenticated && user) {
  //     getToken();
  //   }
  // }, [isAuthenticated, idToken]);


  // //////////////////////////////////////////////////////////
  // useEffect(() => {

  //   const getUsersList = async () => {
  //     try {
  //       const data = await getDocs(usersCollectionRef);
  //       const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  //       let i = [];
  //       filteredData.forEach((user) => {
  //         i.push(user.userId.toString())
  //       });
  //       console.log("after set", listOfUsers)
  //       setListOfUsers([...i]);

  //       // setUserID(filteredData.id);
  //       console.log("list of user", listOfUsers)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }
  // }, [isAuthenticated]);



  // useEffect(() => {
  //   // console.log("updated", idToken);
  //   addUser()
  //   console.log()
  // }, [idToken]);



  // const addUser = async () => {
  //   if (false && idToken && !userExists()) {
  //     console.log("does user exist: ", listOfUsers.includes(idToken), idToken, listOfUsers);
  //     try {
  //       await addDoc(usersCollectionRef, {
  //         coinInPortfolio: { "portfolio": [0, 0, 0, 0, 0] },
  //         portfolioBalance: 454,
  //         userId: idToken,
  //       });
  //       // getUsersList();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }

  // const userExists = () => {
  //   // getUsersList()

  //   setContainsID(listOfUsers?.includes(idToken));


  //   return false;
  // }
  // // console.log(listOfUsers);
  return (
    isAuthenticated && (
      <div className='user-profile-container' >
        {/* {addUser()} */}
        {user?.picture &&
          <img className="user-profile-img" src={user.picture} alt={user?.name}></img>}
        {/* <h2>{user?.name}</h2> */}
        <p>Hello, {user.given_name ? user.given_name : user.email.slice(0, 15)}</p>
        {/* <p>User ID Token: {idToken}</p> */}


      </div>
    )
  )
}

export default Profile;