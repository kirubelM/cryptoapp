import { useAuth0 } from '@auth0/auth0-react'

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();


  return (
    isAuthenticated && (
      <div className='user-profile-container' >
        {user?.picture &&
          <img className="user-profile-img" src={user.picture} alt={"pic"}></img>}
        <p>Hello, {user.given_name ? user.given_name : user.email.slice(0, 15)}</p>
      </div>
    )
  )
}

export default Profile;