import './signUp.scss';

import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import { signIn } from '../authSlice';
import { url } from '../const';

export const SignUp = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessge] = useState();
  const [cookies, setCookie] = useCookies();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const onSignUp = () => {
    const data = {
      email: email,
      name: name,
      password: password,
    };

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const token = res.data.token;
        dispatch(signIn());
        setCookie('token', token);
        navigate('/');
      })
      .catch((err) => {
        setErrorMessge(`サインアップに失敗しました。 ${err}`);
      });

    if (auth) return <Navigate to='/' />;
  };
  return (
    <div className='signup'>
      <h2 className='signup__header'>新規作成</h2>
      <p className='error-message'>{errorMessage}</p>
      <form className='signup__form'>
        <label htmlFor='email'>メールアドレス</label>
        <br />
        <input id='email' type='email' onChange={handleEmailChange} className='signup__email-input' />
        <br />
        <label htmlFor='name'>ユーザ名</label>
        <br />
        <input id='name' type='text' onChange={handleNameChange} className='signup__name-input' />
        <br />
        <label htmlFor='pass'>パスワード</label>
        <br />
        <input id='pass' type='password' onChange={handlePasswordChange} className='signup__password-input' />
        <br />
        <button type='button' onClick={onSignUp} className='signup__button'>
          作成
        </button>
      </form>
    </div>
  );
};
