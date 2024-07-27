import * as React from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Loader from './common/Loader';
import RequireAuth from './auth/RequireAuth';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/userSlice/userSlice';
import SimpleSnackbar from './common/Snackbar';
const Navbar = React.lazy(() => import('./common/Navbar'));
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Messages = React.lazy(() => import('./pages/Messages'));
const MessageById = React.lazy(() => import('./pages/MessageById'));
const NewMessage = React.lazy(() => import('./pages/NewMessage'));
const Login =  React.lazy(() => import('./auth/Login'));
const Register = React.lazy(() => import('./auth/Register'))

function App() {
  const dispatch = useDispatch()
  
  
  React.useEffect(() => {
    let localUser = localStorage.getItem('user');
    if(localUser && localUser !== 'undefined'){
      let data = JSON.parse(localUser as string);
      dispatch(setUser(data));
    }
  }, [])

  return (
    <>
      <SimpleSnackbar />
      <Navbar></Navbar>
      <Routes>
        <Route path="/login" element={<React.Suspense fallback={<Loader />}> <Login /> </React.Suspense>}></Route>
        <Route path="/register" element={<React.Suspense fallback={<Loader />}> <Register /> </React.Suspense>}></Route>
        
        <Route path="/" element={<React.Suspense fallback={<Loader />}> <Home /> </React.Suspense>}></Route>
        <Route path="/profile/:id" element={<React.Suspense fallback={<Loader />}> <Profile /> </React.Suspense>}></Route>
        <Route path="/messages" element={<React.Suspense fallback={<Loader />}> <RequireAuth> <Messages /> </RequireAuth> </React.Suspense>}>
          <Route path="" element={<React.Suspense fallback={<Loader />}>  <RequireAuth> <NewMessage /> </RequireAuth> </React.Suspense>}></Route>
          <Route path=":id" element={<React.Suspense fallback={<Loader />}> <RequireAuth> <MessageById /> </RequireAuth> </React.Suspense>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
