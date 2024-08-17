import './home.scss';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

import { url } from '../const';
import { calcUntilLimit, toJST } from '../utils/datetime';

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo'); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, [cookies.token]);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== 'undefined') {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [cookies.token, lists]);

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };
  return (
    <div>
      <p className='error-message'>{errorMessage}</p>
      <div>
        <div className='task-list'>
          <div className='task-list__header'>
            <h2>リスト一覧</h2>
            <div className='task-list__menu'>
              <Link to='/list/new' className='task-list__menu-button'>
                新規作成
              </Link>
              <Link to={`/lists/${selectListId}/edit`} className='task-list__menu-button'>
                選択中のリストを編集
              </Link>
            </div>
          </div>
          <ul className='task-list__tab'>
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <li
                  key={key}
                  className={`task-list__tab-item ${isActive ? 'active' : ''}`}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleSelectList(list.id) : {})}
                  onClick={() => handleSelectList(list.id)}
                  tabIndex={'0'}
                  aria-label='Choose list item'
                  role='button'
                >
                  {list.title}
                </li>
              );
            })}
          </ul>
        </div>
        <hr className='divider' />
        <div className='tasks'>
          <div className='tasks__header'>
            <h2>タスク一覧</h2>
            <Link to='/task/new' className='tasks__new-button'>
              タスク新規作成
            </Link>
          </div>
          <div className='display-select-wrapper'>
            <select onChange={handleIsDoneDisplayChange} className='display-select'>
              <option value='todo'>未完了</option>
              <option value='done'>完了</option>
            </select>
          </div>
          <Tasks tasks={tasks} selectListId={selectListId} isDoneDisplay={isDoneDisplay} />
        </div>
      </div>
    </div>
  );
};

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;

  if (isDoneDisplay == 'done') {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <Link to={`/lists/${selectListId}/tasks/${task.id}`} key={key} className='task-item'>
              <div className='task-item__left'>
                <span>{task.title}</span>
                <span className='task-item__left-limit'>
                  期限: {toJST(task.limit)}（あと{calcUntilLimit(task.limit)}）
                </span>
              </div>
              <span>{task.done ? '完了' : '未完了'}</span>
            </Link>
          ))}
      </ul>
    );
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => (
          <Link to={`/lists/${selectListId}/tasks/${task.id}`} key={key} className='task-item'>
            <div className='task-item__left'>
              <span>{task.title}</span>
              <div className='task-item__left-limit'>
                <span>期限: {toJST(task.limit)}</span>
                <span>（あと{calcUntilLimit(task.limit)}）</span>
              </div>
            </div>
            <span>{task.done ? '完了' : '未完了'}</span>
          </Link>
        ))}
    </ul>
  );
};
