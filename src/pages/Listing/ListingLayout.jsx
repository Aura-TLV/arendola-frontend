import { Outlet } from 'react-router-dom';
import ListingPage from './ListingPage.jsx';

export default function ListingLayout() {
  return (
    <>
      <ListingPage />
      <Outlet />
    </>
  );
}
