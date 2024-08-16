import './header.scss';

import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { Link, useNavigate } from 'react-router-dom';

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
      <Link to={auth ? '/home' : '/signin'} className='header__title'>
        <h1>Your TODO</h1>
      </Link>
      {auth ? (
        <button onClick={handleSignOut} className='header__sign-out-button'>
          サインアウト
        </button>
      ) : (
        <></>
      )}
    </header>
  );
};
