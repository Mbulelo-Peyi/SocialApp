import React from 'react';
import { Header } from './components/index';
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SiteRoutes from './SiteRoutes';

function App() {

  return (
    <React.Fragment>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path='/*' element={<SiteRoutes />}></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </React.Fragment>
  )
}

export default App
