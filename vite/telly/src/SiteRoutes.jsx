import { Routes, Route, } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import { NotFound, } from './pages/user/index';
import PrivateRoute from './utils/PrivateRoute';
import {
  HomePage,
  Chat,
  ChatList,
  FollowersList,
  FriendsList,
  CommunityPage,
  CommunityMembers,
  CommunityList,
  EventList,
  CommunityRules,
  CommunityRule,
  EventPage,
  PostDetail,
  SearchPage,
} from './pages/index';



const SiteRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute/>}>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/post/:post_id' element={<PostDetail />}></Route>
        <Route path='/search_query' element={<SearchPage />}></Route>
        <Route path='/chat/:room_id' element={<Chat />}></Route>
        <Route path='/chats' element={<ChatList />}></Route>
        <Route path='/followers/:user_id' element={<FollowersList />}></Route>
        <Route path='/friends/:user_id' element={<FriendsList />}></Route>
        <Route path='/communities' element={<CommunityList />}></Route>
        <Route path='/community/:community_id' element={<CommunityPage />}></Route>
        <Route path='/community-members/:community_id' element={<CommunityMembers />}></Route>
        <Route path='/events/:community_id' element={<EventList />}></Route>
        <Route path='/event/:community_id/:event_id' element={<EventPage />}></Route>
        <Route path='/rules/:community_id' element={<CommunityRules />}></Route>
        <Route path='/rule/:community_id/:rule_id' element={<CommunityRule />}></Route>
      </Route>
      {/* UserRoutes */}
      <Route path='/*' element={<UserRoutes />}></Route>
      {/*  */}
      <Route path='/*' element={<NotFound />}></Route>
      {/*  */}

    </Routes>
  )
}

export default SiteRoutes;