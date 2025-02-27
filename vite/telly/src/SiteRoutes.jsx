import { Routes, Route, } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import { NotFound, } from './pages/user/index';
import HomePage from './pages/content/HomePage';
import Chat from './pages/content/Chat';
import FollowersList from './pages/content/FollowersList';
import FriendsList from './pages/content/FriendsList';
import CommunityPage from './pages/community/CommunityPage';
import CommunityMembers from './pages/community/CommunityMembers';
import CommunityList from './pages/community/CommunityList';
import EventList from './pages/community/EventList';
import EventPage from './pages/community/EventPage';
import PostDetail from './pages/content/PostDetail';


const SiteRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />}></Route>
      <Route path='/post/:post_id' element={<PostDetail />}></Route>
      <Route path='/chat' element={<Chat />}></Route>
      <Route path='/followers/:user_id' element={<FollowersList />}></Route>
      <Route path='/friends/:user_id' element={<FriendsList />}></Route>
      <Route path='/communities' element={<CommunityList />}></Route>
      <Route path='/community/:community_id' element={<CommunityPage />}></Route>
      <Route path='/community-members/:community_id' element={<CommunityMembers />}></Route>
      <Route path='/events/:community_id' element={<EventList />}></Route>
      <Route path='/community-members/:community_id/:event_id' element={<EventPage />}></Route>
      {/* UserRoutes */}
      <Route path='/*' element={<UserRoutes />}></Route>
      {/*  */}
      <Route path='/*' element={<NotFound />}></Route>
      {/*  */}

    </Routes>
  )
}

export default SiteRoutes;