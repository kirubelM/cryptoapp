import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
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
