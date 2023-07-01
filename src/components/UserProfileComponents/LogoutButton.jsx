import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <Button className="sign-in-button" type="primary" onClick={() => logout()}>
        Logout <LogoutOutlined style={{
          fontSize: "1.75rem",
          fontWeight: "500"
        }} />
      </Button>
    )
  )
}

export default LogoutButton;