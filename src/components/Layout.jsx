import './layout.scss';

import { Outlet } from 'react-router-dom';

import { Header } from './Header';

const Layout = () => {
  return (
    <>
      <Header />
      <main className='layout'>
        <Outlet />
      </main>
    </>
  );
};

export { Layout };
