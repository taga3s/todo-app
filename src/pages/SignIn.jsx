import './signin.scss';

import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { signIn } from '../authSlice';
import { url } from '../const';

export const SignIn = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [cookies, setCookie] = useCookies();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const onSignIn = () => {
    axios
      .post(`${url}/signin`, { email: email, password: password })
      .then((res) => {
        setCookie('token', res.data.token);
        dispatch(signIn());
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`サインインに失敗しました。${err}`);
      });
  };

  if (auth) return <Navigate to='/' />;

  return (
    <div className='signin'>
      <h2 className='signin__header'>サインイン</h2>
      <p className='error-message'>{errorMessage}</p>
      <form className='signin__form'>
        <label htmlFor='email' className='signin__email-label'>
          メールアドレス
        </label>
        <br />
        <input id='email' type='email' className='signin__email-input' onChange={handleEmailChange} />
        <br />
        <label htmlFor='pass' className='signin__password-label'>
          パスワード
        </label>
        <br />
        <input id='pass' type='password' className='signin__password-input' onChange={handlePasswordChange} />
        <br />
        <button type='button' className='signin__button' onClick={onSignIn}>
          サインイン
        </button>
      </form>
      <Link to='/signup'>新規作成はこちら</Link>
    </div>
  );
};
