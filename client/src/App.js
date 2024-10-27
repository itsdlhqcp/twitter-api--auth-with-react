import React from 'react';
import './styles/main.scss';
import 'rsuite/dist/rsuite.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/profile.context';

function App() {
  return (
    <ProfileProvider>
        <Routes>
          <Route
          path='/signin' 
          element=
          {
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          
          } />
          <Route 
            path='/' 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
        </Routes>
    </ProfileProvider>
  );
}

export default App;
