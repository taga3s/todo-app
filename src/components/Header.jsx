import './header.css';

import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { useNavigate } from 'react-router-dom';

import { signOut } from '../authSlice';

export const Header = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie('token');
    navigate('/signin');
  };

  return (
    <header className='header'>
      <h1>Todoアプリ</h1>
      {auth ? (
        <button onClick={handleSignOut} className='sign-out-button'>
          サインアウト
        </button>
      ) : (
        <></>
      )}
    </header>
  );
};
