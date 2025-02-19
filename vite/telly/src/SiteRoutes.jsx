import { Routes, Route, } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import { NotFound, } from './pages/user/index';
import HomePage from './pages/content/HomePage';
import CommunityPage from './pages/community/CommunityPage';


const SiteRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />}></Route>
      <Route path='/community' element={<CommunityPage />}></Route>
      {/* UserRoutes */}
      <Route path='/*' element={<UserRoutes />}></Route>
      {/*  */}
      <Route path='/*' element={<NotFound />}></Route>
      {/*  */}

    </Routes>
  )
}

export default SiteRoutes;