import './editTask.scss';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import { url } from '../const';
import { formatWithISOString, toJST } from '../utils/datetime';

export const EditTask = () => {
  const navigate = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [detail, setDetail] = useState('');
  const [isDone, setIsDone] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleDatetimeChange = (e) => setDatetime(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done');
  const onUpdateTask = () => {
    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: formatWithISOString(datetime),
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDatetime(toJST(task.limit));
        setDetail(task.detail);
        setIsDone(task.done);
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, [cookies.token, listId, taskId]);

  return (
    <div className='edit-task'>
      <h2>タスク編集</h2>
      <p className='error-message'>{errorMessage}</p>
      <form className='edit-task__form'>
        <label htmlFor='title'>タイトル</label>
        <br />
        <input id='title' type='text' onChange={handleTitleChange} className='edit-task__title' value={title} />
        <br />
        <label htmlFor='limit'>期限</label>
        <br />
        <input id='limit' onChange={handleDatetimeChange} type='datetime-local' value={datetime} />
        <br />
        <label htmlFor='detail'>詳細</label>
        <br />
        <textarea id='detail' type='text' onChange={handleDetailChange} className='edit-task__detail' value={detail} />
        <br />
        <div>
          <input
            type='radio'
            id='todo'
            name='status'
            value='todo'
            onChange={handleIsDoneChange}
            checked={isDone === false ? 'checked' : ''}
          />
          未完了
          <input
            type='radio'
            id='done'
            name='status'
            value='done'
            onChange={handleIsDoneChange}
            checked={isDone === true ? 'checked' : ''}
          />
          完了
        </div>
        <button type='button' className='delete-task__button' onClick={onDeleteTask}>
          削除
        </button>
        <button type='button' className='edit-task__button' onClick={onUpdateTask}>
          更新
        </button>
      </form>
    </div>
  );
};
