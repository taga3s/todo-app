import './home.scss';

import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  // https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
  // https://web.dev/articles/control-focus-with-tabindex?hl=ja
  const listItemRefs = useRef([]);
  const listItemRefsCallback = useMemo(() => {
    return (node) => {
      if (node !== null && !listItemRefs.current.includes(node)) {
        listItemRefs.current.push(node);
      }
    };
  }, [lists]);

  const handleSwitchList = (e) => {
    const targetId = e.target.id;
    const currentIndex = listItemRefs.current.findIndex((ref) => ref.id === targetId);
    const nextIndex = currentIndex + 1;
    const prevIndex = currentIndex - 1;

    if (e.key === 'ArrowRight' && currentIndex < listItemRefs.current.length - 1) {
      listItemRefs.current.forEach((ref, index) => {
        if (index === nextIndex) {
          ref.tabIndex = 0;
          ref.focus();
        } else {
          ref.tabIndex = -1;
        }
      });
    }
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      listItemRefs.current.forEach((ref, index) => {
        if (index === prevIndex) {
          ref.tabIndex = 0;
          ref.focus();
        } else {
          ref.tabIndex = -1;
        }
      });
    }
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
          <ul className='task-list__tab' onKeyDown={handleSwitchList}>
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <li
                  id={list.id}
                  key={key}
                  className={`task-list__tab-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectList(list.id)}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleSelectList(list.id) : {})}
                  ref={listItemRefsCallback}
                  tabIndex={`${key === 0 ? 0 : -1}`}
                  aria-label='リストを選択する'
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
