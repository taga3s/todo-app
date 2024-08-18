import './newTask.scss';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import { url } from '../const';
import { formatWithISOString } from '../utils/datetime';

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [detail, setDetail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDatetimeChange = (e) => setDatetime(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleSelectList = (id) => setSelectListId(id);
  const onCreateTask = () => {
    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: formatWithISOString(datetime),
    };
    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, [cookies.token]);

  return (
    <div className='new-task'>
      <h2 className='new-task__header'>タスク新規作成</h2>
      <p className='error-message'>{errorMessage}</p>
      <form className='new-task__form'>
        <label htmlFor='list'>リスト</label>
        <br />
        <select id='list' onChange={(e) => handleSelectList(e.target.value)} className='new-task__select-list'>
          {lists.map((list, key) => (
            <option key={key} value={list.id}>
              {list.title}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor='title'>タイトル</label>
        <br />
        <input id='title' type='text' onChange={handleTitleChange} className='new-task__title' />
        <br />
        <label htmlFor='limit'>期限</label>
        <br />
        <input id='limit' onChange={handleDatetimeChange} type='datetime-local' className='new-task__datetime' />
        <br />
        <label htmlFor='detail'>詳細</label>
        <br />
        <textarea id='detail' type='text' onChange={handleDetailChange} className='new-task__detail' />
        <br />
        <button type='button' className='new-task__button' onClick={onCreateTask}>
          作成
        </button>
      </form>
    </div>
  );
};
