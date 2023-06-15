import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
// import { Button } from 'antd';
const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <div className='user-profile-container' >
        {user?.picture &&
          <img className="user-profile-img" src={user.picture} alt={user?.name}></img>}
        {/* <h2>{user?.name}</h2> */}
        <p>Hello, {user.given_name ? user.given_name : user.email.slice(0, 15)}</p>


      </div>
    )
  )
}

export default Profile;
