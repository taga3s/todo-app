import './newList.scss';

import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import { url } from '../const';

export const NewList = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);
  const onCreateList = () => {
    const data = {
      title: title,
    };

    axios
      .post(`${url}/lists`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`リストの作成に失敗しました。${err}`);
      });
  };

  return (
    <div className='new-list'>
      <h2>リスト新規作成</h2>
      <p className='error-message'>{errorMessage}</p>
      <form className='new-list__form'>
        <label>タイトル</label>
        <br />
        <input type='text' onChange={handleTitleChange} className='new-list__title' />
        <br />
        <button type='button' onClick={onCreateList} className='new-list__button'>
          作成
        </button>
      </form>
    </div>
  );
};
