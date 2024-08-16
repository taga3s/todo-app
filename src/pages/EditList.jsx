import './editList.scss';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import { url } from '../const';

export const EditList = () => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const onUpdateList = () => {
    const data = {
      title: title,
    };

    axios
      .put(`${url}/lists/${listId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/home');
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。 ${err}`);
      });
  };

  const onDeleteList = () => {
    axios
      .delete(`${url}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/home');
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const list = res.data;
        setTitle(list.title);
      })
      .catch((err) => {
        setErrorMessage(`リスト情報の取得に失敗しました。${err}`);
      });
  }, [cookies.token, listId]);

  return (
    <div className='edit-list'>
      <h2>リスト編集</h2>
      <p className='error-message'>{errorMessage}</p>
      <form className='edit-list__form'>
        <label>タイトル</label>
        <br />
        <input type='text' className='edit-list__title' value={title} onChange={handleTitleChange} />
        <br />
        <button type='button' className='delete-list__button' onClick={onDeleteList}>
          削除
        </button>
        <button type='button' className='edit-list__button' onClick={onUpdateList}>
          更新
        </button>
      </form>
    </div>
  );
};
