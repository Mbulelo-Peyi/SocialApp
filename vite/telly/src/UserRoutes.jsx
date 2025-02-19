import { Routes,Route} from 'react-router-dom';
import {  
    NotFound,
    Faq,
    Login,
    Profile,
    Register,
    AccountActivation,
    PasswordChange,
    ResetPassword,
    ResetPasswordConfirm,
    Settings,
    AccountSettings,
    Complaint,
    DeleteAccount,
    Activate,
  
} from './pages/user/index';
import { Notifications } from './pages/notifications/index';

import PrivateRoute from './utils/PrivateRoute';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/activation' element={<AccountActivation />}></Route>
            <Route path='/faq' element={<Faq />}></Route>
            <Route path='/*' element={<NotFound />}></Route>
            <Route path='/reset_password' element={<ResetPassword />}></Route>
            <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />}></Route>
            <Route path='/activate/:uid/:token' element={<Activate />}></Route>
            <Route element={<PrivateRoute/>}>
              {/*  */}

              
              <Route path='/account-settings' element={<AccountSettings/>}></Route>
              <Route path='/complaint' element={<Complaint/>}></Route>
              <Route path='/settings' element={<Settings/>}></Route>
              <Route path='/delete-account' element={<DeleteAccount/>}></Route>
              <Route path='/password-change' element={<PasswordChange />}></Route>
              <Route path='/profile' element={<Profile />}></Route>
              <Route path='/notifications' element={<Notifications />}></Route>
              {/*  */}
            </Route>
        </Routes>
    )
}

export default UserRoutes;