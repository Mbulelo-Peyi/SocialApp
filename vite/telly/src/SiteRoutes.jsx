import { Routes, Route, } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import { NotFound, } from './pages/user/index';
import HomePage from './pages/content/HomePage';
import Chat from './pages/content/Chat';
import FollowersList from './pages/content/FollowersList';
import FriendsList from './pages/content/FriendsList';
import CommunityPage from './pages/community/CommunityPage';
import PostDetail from './pages/content/PostDetail';


const SiteRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />}></Route>
      <Route path='/post/:post_id' element={<PostDetail />}></Route>
      <Route path='/chat' element={<Chat />}></Route>
      <Route path='/followers' element={<FollowersList />}></Route>
      <Route path='/friends' element={<FriendsList />}></Route>
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