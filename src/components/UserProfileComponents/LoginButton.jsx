import React, { useEffect } from 'react';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { AppContext } from '../../App';
import { useContext } from 'react';
import useLoginButtonLogic from '../useLoginButtonLogic'; // Import the useLoginButtonLogic hook

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { setCoinsInPortfolio, setPortfolioBalance } = useContext(AppContext);

  const { listOfUsers, getUsersList } = useLoginButtonLogic();

  useEffect(() => {
    getUsersList();
  }, []);

  return (
    !isAuthenticated && (
      <Button className="sign-in-button" type="primary" onClick={() => loginWithRedirect()}>
        Login <LoginOutlined style={{ fontSize: '1.75rem', fontWeight: '500' }} />
      </Button>
    )
  );
};

export default LoginButton;
