import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { EditList } from '../pages/EditList';
import { EditTask } from '../pages/EditTask';
import { Home } from '../pages/Home';
import { NewList } from '../pages/NewList';
import { NewTask } from '../pages/NewTask';
import { NotFound } from '../pages/NotFound';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';

export const Router = () => {
  const auth = useSelector((state) => state.auth.isSignIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          {auth ? (
            <>
              <Route path='/home' element={<Home />} />
              <Route path='/task/new' element={<NewTask />} />
              <Route path='/list/new' element={<NewList />} />
              <Route path='/lists/:listId/tasks/:taskId' element={<EditTask />} />
              <Route path='/lists/:listId/edit' element={<EditList />} />
            </>
          ) : (
            <Route path='/signin' element={<SignIn />} />
          )}
        </Route>
        <Route component={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
